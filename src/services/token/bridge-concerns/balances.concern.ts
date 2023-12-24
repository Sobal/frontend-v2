import {
  Connection,
  PublicKey,
  RpcResponseAndContext,
  TokenAmount,
} from '@solana/web3.js';

import { getAssociatedTokenAddress } from '@solana/spl-token';

import { formatUnits } from '@ethersproject/units';

import BridgeTokenService from '../bridge-token.service';

// TYPES
export type BalanceMap = { [address: string]: string };

export default class BalancesConcern {
  network: string;
  provider: Connection;
  nativeAssetAddress: string;
  nativeAssetDecimals: number;

  constructor(private readonly service: BridgeTokenService) {
    this.network = this.service.configService.network.key;
    this.provider = this.service.rpcProviderService;
    this.nativeAssetAddress =
      this.service.configService.network.nativeAsset.address;
    this.nativeAssetDecimals =
      this.service.configService.network.nativeAsset.decimals;
  }

  async get(account: string, tokens: string[]): Promise<BalanceMap> {
    console.log('getting for', account);
    console.log('tokens obj', tokens);

    const multicalls: Promise<any>[] = [];

    tokens.forEach(address => {
      const request = this.fetchBalances(account, address);
      multicalls.push(request);
    });

    const paginatedBalances = await Promise.all<BalanceMap>(multicalls);
    const validPages = paginatedBalances.filter(
      page => !(page instanceof Error)
    );

    return validPages.reduce((result, current) =>
      Object.assign(result, current)
    );
  }

  private async fetchBalances(
    account: string,
    address: string
  ): Promise<BalanceMap> {
    try {
      const balanceMap = {};

      // If native asset included in addresses, filter out for
      // multicall, but fetch indpendently and inject.
      if (address.toLowerCase() === this.nativeAssetAddress.toLowerCase()) {
        balanceMap[this.nativeAssetAddress] = await this.fetchNativeBalance(
          account
        );
      }
      console.log('fetching for', account, 'token', address);

      const mintAccount = new PublicKey(address);
      const walletPubkey = new PublicKey(account);

      const assocTokenAccountAddress = await getAssociatedTokenAddress(
        mintAccount,
        walletPubkey
      );

      const response = await this.provider.getTokenAccountBalance(
        assocTokenAccountAddress
      );

      return {
        ...this.associateBalances(response, address),
        ...balanceMap,
      };
    } catch (error) {
      console.error('Failed to fetch balances for:', address);
      throw error;
    }
  }

  private async fetchNativeBalance(account: string): Promise<string> {
    const walletPubkey = new PublicKey(account);
    const balance = await this.provider.getBalance(walletPubkey);
    return formatUnits(balance.toString(), this.nativeAssetDecimals);
  }

  private associateBalances(
    balance: RpcResponseAndContext<TokenAmount>,
    address: string
  ): BalanceMap {
    return {
      [address]: (
        Number(balance.value.amount) / Math.pow(10, balance.value.decimals)
      ).toString(),
    };
  }
}

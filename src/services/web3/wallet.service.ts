import { Network } from '@/lib/config';
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';

import ConfigService, { configService } from '@/services/config/config.service';
import {
  rpcProviderService as _rpcProviderService,
  rpcProviderService,
} from '../rpc-provider/rpc-provider.service';
import { TransactionBuilder } from './transactions/transaction.builder';
import { WalletProvider } from '@/dependencies/wallets/Web3Provider';
import { Contract } from 'ethers';

interface Web3Profile {
  ens: string | null;
  avatar: string | null;
}

export default class WalletService {
  appProvider: JsonRpcProvider;
  ensProvider: JsonRpcProvider;
  ensContract: string;
  userProvider!: ComputedRef<WalletProvider>;
  txBuilder!: TransactionBuilder;

  constructor(
    private readonly rpcProviderService = _rpcProviderService,
    private readonly config: ConfigService = configService
  ) {
    this.appProvider = this.rpcProviderService.jsonProvider;
    this.ensProvider = this.rpcProviderService.getJsonProvider(Network.MAINNET);
    this.ensContract =
      this.config.getNetworkConfig(Network.MAINNET).ensBatchContract ?? '';
  }

  public setUserProvider(provider: ComputedRef<WalletProvider>) {
    this.userProvider = provider;
    this.setTxBuilder(provider.value.getSigner());
  }

  public setTxBuilder(signer: JsonRpcSigner) {
    this.txBuilder = new TransactionBuilder(signer);
  }

  async getEnsName(addresses: string[]): Promise<string[] | null> {
    try {
      const reverseRecords = new Contract(
        this.ensContract,
        ['function getNames(address[] addresses) view returns (string[] r)'],
        this.ensProvider
      );
      return await reverseRecords.getNames(addresses);
    } catch (error) {
      return null;
    }
  }

  async getEnsAvatar(address: string): Promise<string | null> {
    try {
      return await this.ensProvider.getAvatar(address);
    } catch (error) {
      return null;
    }
  }

  async getProfile(address: string): Promise<Web3Profile> {
    const userEns = await this.getEnsName([address]);
    return {
      ens: userEns ? userEns[0] : '',
      avatar: await this.getEnsAvatar(address),
    };
  }

  async getUserAddress(): Promise<string> {
    const signer = this.userProvider.value.getSigner();
    const userAddress: string = await signer.getAddress();
    return userAddress;
  }

  public async getCurrentBlock(): Promise<number> {
    return await rpcProviderService.getBlockNumber();
  }
}

export const walletService = new WalletService();

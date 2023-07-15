import { AddressZero } from '@ethersproject/constants';
import { TransactionResponse } from '@ethersproject/providers';
import BigNumber from 'bignumber.js';

import { PoolSeedToken } from '@/composables/pools/usePoolCreation';

import { TransactionBuilder } from '@/services/web3/transactions/transaction.builder';
import { JoinPoolRequest, WeightedPoolEncoder } from '@sobal/sdk';
import { WeightedPool__factory } from '@balancer-labs/typechain';
import WeightedPoolsService from './weighted-pool.service';
import polygonCreatePoolReceipt from './__mocks__/polygon-create-pool-receipt';
import polygonCreatePoolReceiptNoEvents from './__mocks__/polygon-create-pool-receipt-no-events';
import { Web3ProviderMock } from '@/dependencies/wallets/wallet-connector-mocks';
import { initEthersContractWithDefaultMocks } from '@/dependencies/EthersContract.mocks';

const tokens: Record<string, PoolSeedToken> = {};
const weightedPoolsService = new WeightedPoolsService();

const mockPoolId =
  'EEE8292CB20A443BA1CAAA59C985CE14CA2BDEE5000100000000000000000263';

vi.mock('@/services/web3/transactions/transaction.builder');

initEthersContractWithDefaultMocks();
// Overwrite connect
//@ts-ignore
WeightedPool__factory.connect = () => {
  return {
    getPoolId: () => Promise.resolve(mockPoolId),
  };
};

describe('PoolCreator', () => {
  const mockPoolName = 'TestPool';
  const mockPoolSymbol = '50WETH-50USDT';
  const mockRateProviders = [AddressZero, AddressZero];
  const mockSwapFee = '0.01';
  const mockOwner = AddressZero;

  beforeEach(() => {
    vi.clearAllMocks();
    tokens.MKR = {
      tokenAddress: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
      weight: 70,
      isLocked: false,
      id: '0',
      amount: '0',
    };
    tokens.WETH = {
      tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      weight: 20,
      isLocked: false,
      id: '1',
      amount: '0',
    };
    tokens.USDT = {
      tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      weight: 10,
      isLocked: false,
      id: '2',
      amount: '0',
    };
  });

  const mockProvider = new Web3ProviderMock();
  // @ts-ignore
  mockProvider.getTransactionReceipt = async () => polygonCreatePoolReceipt;

  describe('create', () => {
    describe('happy case', () => {
      beforeEach(async () => {
        tokens.WETH.weight = 50;
        tokens.USDT.weight = 50;
        await weightedPoolsService.create(
          mockProvider,
          mockPoolName,
          mockPoolSymbol,
          mockSwapFee,
          [tokens.WETH, tokens.USDT],
          mockOwner
        );
      });

      it('Should call sendTransaction with the correct information', () => {
        // @ts-ignore
        const txBuilderInstance = TransactionBuilder.mock.results[0].value;
        const sendTransactionArgs =
          txBuilderInstance.contract.sendTransaction.mock.calls[0];
        expect(sendTransactionArgs[0].action).toEqual('create');
        const sendTransactionParams = sendTransactionArgs[0].params;
        expect(sendTransactionParams[0]).toEqual(mockPoolName);
        expect(sendTransactionParams[1]).toEqual(mockPoolSymbol);
        expect(sendTransactionParams[2]).toEqual([
          tokens.WETH.tokenAddress,
          tokens.USDT.tokenAddress,
        ]);
        expect(sendTransactionParams[3]).toEqual([
          new BigNumber(tokens.WETH.weight).multipliedBy(1e16).toString(),
          new BigNumber(tokens.USDT.weight).multipliedBy(1e16).toString(),
        ]);
        expect(sendTransactionParams[4]).toEqual(mockRateProviders);
        expect(sendTransactionParams[5]).toEqual(
          new BigNumber(mockSwapFee).multipliedBy(1e18).toString()
        );
        expect(sendTransactionParams[6]).toEqual(mockOwner);
        // Verify salt has expected format:
        expect(sendTransactionParams[7]).toStartWith('0x');
        expect(sendTransactionParams[7]).toHaveLength(66);
      });
    });

    describe('error handling', () => {
      it('should error if a zero length string is passed in for the pool owner', () => {
        tokens.WETH.weight = 50;
        tokens.USDT.weight = 50;
        expect(
          weightedPoolsService.create(
            mockProvider,
            mockPoolName,
            mockPoolSymbol,
            mockSwapFee,
            [tokens.WETH, tokens.USDT],
            ''
          )
        ).rejects.toEqual('No pool owner specified');
      });
    });
  });

  describe('details', () => {
    const mockPoolAddress = '0x3bB9d50A0743103F896D823B332EE15E231848D1';

    it('should take a pool create transaction response and return details about the pool', async () => {
      const poolDetails = await weightedPoolsService.retrievePoolIdAndAddress(
        mockProvider,
        'hash'
      );
      expect(poolDetails?.id).toEqual(mockPoolId);
      expect(poolDetails?.address).toEqual(mockPoolAddress);
    });

    it('should work with a polygon create pool transaction receipt', async () => {
      const poolDetails = await weightedPoolsService.retrievePoolIdAndAddress(
        mockProvider,
        'hash'
      );
      expect(poolDetails?.address.toLowerCase()).toEqual(
        '0x3bb9d50a0743103f896d823b332ee15e231848d1'
      );
    });

    it('should work with a polygon create pool transaction receipt with no events', async () => {
      const mockProvider = {
        getTransactionReceipt: () => polygonCreatePoolReceiptNoEvents,
        getSigner: vi.fn(),
      } as any;
      const poolDetails = await weightedPoolsService.retrievePoolIdAndAddress(
        mockProvider,
        'hash'
      );
      expect(poolDetails?.address.toLowerCase()).toEqual(
        '0x92e244b931bd6c71c1db2e50326480a0ba530fc7'
      );
    });
  });

  describe('initJoin', () => {
    let joinTx: TransactionResponse;
    const mockSender = '0xeeedce01a98ebc40f76b2d1f403e52d55b74feee';
    const mockReceiver = '0xabcdce01a98ebc40f76b2d1f403e52d55b74fddd';

    // Conversion rate 1 WETH = 3000 USDT
    const tokenBalances = [
      new BigNumber(2e18).toString(), // WETH, 18 demials
      new BigNumber(6000e6).toString(), // USDT, 6 decimals
    ];

    beforeEach(async () => {
      joinTx = await weightedPoolsService.initJoin(
        mockProvider,
        mockPoolId,
        mockSender,
        mockReceiver,
        [tokens.WETH.tokenAddress, tokens.USDT.tokenAddress],
        tokenBalances
      );
    });

    it('Should call sendTransaction with the correct information', () => {
      // @ts-ignore
      const txBuilderInstance = TransactionBuilder.mock.results[0].value;
      const sendTransactionArgs =
        txBuilderInstance.contract.sendTransaction.mock.calls[0];
      expect(sendTransactionArgs[0].action).toEqual('joinPool');
      const sendTransactionParams = sendTransactionArgs[0].params;
      expect(sendTransactionParams[0]).toEqual(mockPoolId);
      expect(sendTransactionParams[1]).toEqual(mockSender);
      expect(sendTransactionParams[2]).toEqual(mockReceiver);
      const joinPoolRequest: JoinPoolRequest = sendTransactionParams[3];
      expect(joinPoolRequest.assets).toEqual([
        tokens.WETH.tokenAddress,
        tokens.USDT.tokenAddress,
      ]);
      expect(joinPoolRequest.maxAmountsIn).toEqual([
        '2000000000000000000',
        '6000000000',
      ]);

      const expectedUserData = WeightedPoolEncoder.joinInit(
        tokenBalances.map(tb => tb.toString())
      );
      expect(joinPoolRequest.userData).toEqual(expectedUserData);
      expect(joinPoolRequest.fromInternalBalance).toEqual(false);
    });

    it('Should return the transaction data of the mined transaction', () => {
      expect(joinTx).toBeTruthy();
    });
  });

  describe('calculateTokenWeights', () => {
    it('Should return 50e16/50e16 for 2 Token happy case. ', () => {
      tokens.MKR.weight = 50;
      tokens.WETH.weight = 50;
      const normalizedWeights: string[] =
        weightedPoolsService.calculateTokenWeights([tokens.MKR, tokens.WETH]);
      expect(normalizedWeights[0]).toEqual(new BigNumber(0.5e18).toString());
      expect(normalizedWeights[1]).toEqual(new BigNumber(0.5e18).toString());
    });

    it('Should return weights that add up to exactly 1e18', () => {
      tokens.MKR.weight = 33.33;
      tokens.WETH.weight = 33.33;
      tokens.USDT.weight = 33.33;
      const normalizedWeights: string[] =
        weightedPoolsService.calculateTokenWeights([
          tokens.MKR,
          tokens.WETH,
          tokens.USDT,
        ]);
      expect(normalizedWeights[0]).toEqual('333333333333333333');
      expect(normalizedWeights[1]).toEqual('333333333333333333');
      expect(normalizedWeights[2]).toEqual('333333333333333334');
    });
  });
});

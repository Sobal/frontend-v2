import { Goals, trackGoal } from '@/composables/useFathom';
import {
  verifyNetwork,
  verifyTransactionSender,
} from '@/providers/wallet.provider';
import { WalletError } from '@/types';
import {
  JsonRpcSigner,
  TransactionRequest,
  TransactionResponse,
} from '@ethersproject/providers';
import { captureException } from '@sentry/browser';
import { TransactionConcern } from './transaction.concern';
import { configService } from '@/services/config/config.service';

export class RawConcern extends TransactionConcern {
  constructor(private readonly signer: JsonRpcSigner) {
    super();
  }

  public async sendTransaction(
    options: TransactionRequest
  ): Promise<TransactionResponse> {
    console.log('sendTransaction', options);

    try {
      const gasSettings = await this.gas.settings(this.signer, options);

      const txOptions = { ...options, ...gasSettings };

      await Promise.all([
        verifyTransactionSender(this.signer),
        verifyNetwork(this.signer),
      ]);

      trackGoal(Goals.RawTransactionSubmitted);
      return await this.signer.sendTransaction(txOptions);
    } catch (err) {
      const error = err as WalletError;

      if (this.shouldLogFailure(error)) {
        await this.logFailedTx(options, error);
      }
      return Promise.reject(error);
    }
  }

  public async call(options: TransactionRequest): Promise<string> {
    const gasSettings = await this.gas.settings(this.signer, options);
    options = { ...options, ...gasSettings };

    return await this.signer.call(options);
  }

  private async logFailedTx(
    options: TransactionRequest,
    error: WalletError
  ): Promise<void> {
    const sender = await this.signer.getAddress();
    const chainId = await this.signer.getChainId();
    const block = await this.signer.provider.getBlockNumber();
    const msgValue = options.value ? options.value.toString() : 0;
    const simulate = `https://dashboard.tenderly.co/balancer/v2/simulator/new?contractAddress=${options.to}&rawFunctionInput=${options.data}&block=${block}&blockIndex=0&from=${sender}&gas=8000000&gasPrice=0&value=${msgValue}&network=${chainId}`;
    const level = configService.network.testNetwork ? 'error' : 'fatal';

    captureException(error, {
      level,
      extra: {
        sender,
        simulate,
        options,
        originalError: error?.data?.originalError,
      },
    });
  }
}

import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { WalletType, WalletTypes } from '@/types/wallet';
import { NeonProxyRpcApi } from './classes/api';
import {
  createMintNeonWeb3Transaction,
  createMintSolanaTransaction,
  createUnwrapSOLTransaction,
  createWrapAndTransferSOLTransactionWeb3,
  neonNeonWeb3Transaction,
  neonTransferMintWeb3Transaction,
  sendNeonTransaction,
  sendSolanaTransaction,
  simulateTransaction,
  solanaNEONTransferTransaction,
  unwrapNeonWeb3,
} from './functions/transactions';
import { configService } from '@/services/config/config.service';
import { TokenInfo } from '@/types/TokenList';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Signer } from '@ethersproject/abstract-signer';
import { WalletAdapterProps } from '@solana/wallet-adapter-base';
import { NeonProgramStatus } from './interfaces/api';
import { NewTransaction, TransactionType } from '../useTransactions';
import { sleep } from '@/lib/utils';

export async function bridgeToken(
  walletType: WalletType,
  token: TokenInfo,
  amount: number,
  account: string,
  provider: JsonRpcProvider,
  connection: Connection,
  publicKeyTrimmed: string,
  signer: Signer,
  chainId: number,
  sendTransaction: WalletAdapterProps['sendTransaction'],
  neonProxyApi: NeonProxyRpcApi | undefined,
  neonProxyStatus: NeonProgramStatus | undefined,
  addTransaction: (newTransaction: NewTransaction) => void,
  addNotificationForSolanaTransaction: (
    id: string,
    type: TransactionType
  ) => void
) {
  if (!neonProxyStatus || !neonProxyApi) throw 'API not available';

  const solanaWallet = new PublicKey(publicKeyTrimmed);
  const nativeOverride = ref(false);

  const neonEvmProgram = new PublicKey(neonProxyStatus.NEON_EVM_ID);

  // Solana to EVM
  if (walletType === WalletTypes.Solana) {
    if (!configService.network.nativeAsset.address_spl)
      throw 'Native Asset SPL Address Missing';

    const neonTokenMint = new PublicKey(
      configService.network.nativeAsset.address_spl
    );

    if (
      token.address === configService.network.nativeAsset.address ||
      configService.network.tokens.Addresses.wNativeAsset.toLowerCase() ===
        token.address.toLowerCase()
    ) {
      const transaction = await solanaNEONTransferTransaction(
        solanaWallet,
        account,
        neonEvmProgram,
        neonTokenMint,
        configService.network.nativeAsset,
        amount,
        chainId
      );

      transaction.recentBlockhash = (
        await connection.getLatestBlockhash('finalized')
      ).blockhash;

      const simulatedTx = await simulateTransaction(
        connection,
        transaction,
        'finalized'
      );
      console.log('Solana Simulated Transaction', simulatedTx);

      const signature = await sendSolanaTransaction(
        connection,
        transaction,
        true,
        sendTransaction,
        { skipPreflight: false }
      );

      addTransaction({
        id: signature,
        type: 'tx',
        action: `bridgeTokens`,
        summary: `Transfer ${amount} ${token.symbol} to ${configService.network.chainName}`,
      });

      await sleep(1000);

      addNotificationForSolanaTransaction(signature, 'tx');

      // TX Type: Solana
      return signature;
    } else if (
      configService.network.solanaNativeAsset &&
      token.address.toLowerCase() ===
        configService.network.solanaNativeAsset.address.toLowerCase()
    ) {
      if (!token.address_spl) throw 'Solana native SPL token address missing';

      const transaction = await createWrapAndTransferSOLTransactionWeb3(
        connection,
        provider,
        neonProxyApi,
        neonProxyStatus,
        neonEvmProgram,
        solanaWallet,
        account,
        configService.network.solanaNativeAsset,
        amount,
        chainId
      );

      transaction.recentBlockhash = (
        await connection.getLatestBlockhash('finalized')
      ).blockhash;

      const simulatedTx = await simulateTransaction(
        connection,
        transaction,
        'finalized'
      );
      console.log('Solana Simulated Transaction', simulatedTx);

      const signature = await sendSolanaTransaction(
        connection,
        transaction,
        true,
        sendTransaction,
        { skipPreflight: false }
      );

      addTransaction({
        id: signature,
        type: 'tx',
        action: `bridgeTokens`,
        summary: `Transfer ${amount} ${token.symbol} to ${configService.network.chainName}`,
      });

      await sleep(1000);

      addNotificationForSolanaTransaction(signature, 'tx');

      // TX Type: Solana
      return signature;
    } else {
      const transaction = await neonTransferMintWeb3Transaction(
        connection,
        provider,
        neonProxyApi,
        neonProxyStatus,
        neonEvmProgram,
        solanaWallet,
        account,
        token,
        amount,
        chainId
      );

      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;

      const simulatedTx = await simulateTransaction(
        connection,
        transaction,
        'finalized'
      );
      console.log('Solana Simulated Transaction', simulatedTx);

      const signature = await sendSolanaTransaction(
        connection,
        transaction,
        true,
        sendTransaction,
        { skipPreflight: false }
      );

      addTransaction({
        id: signature,
        type: 'tx',
        action: `bridgeTokens`,
        summary: `Transfer ${amount} ${token.symbol} to ${configService.network.chainName}`,
      });

      await sleep(1000);

      addNotificationForSolanaTransaction(signature, 'tx');

      // TX Type: Solana
      return signature;
    }
    // EVM to Solana
  } else {
    if (
      configService.network.tokens.Addresses.wNativeAsset.toLowerCase() ===
      token.address.toLowerCase()
    ) {
      const unwrapTx = await unwrapNeonWeb3(signer, token, amount);
      nativeOverride.value = true;

      addTransaction({
        id: unwrapTx.hash,
        type: 'tx',
        action: `bridgeTokens`,
        summary: `Unwrap ${amount} ${token.symbol}`,
      });

      // TX Type: EVM
      await unwrapTx.wait();
    }

    if (!token.address_spl && !nativeOverride.value)
      throw 'No SPL token address for this token';
    const tokenOverride: TokenInfo = nativeOverride.value
      ? { ...configService.network.nativeAsset, chainId }
      : { ...token };
    const mintPubkey = new PublicKey(tokenOverride.address_spl ?? '');

    if (tokenOverride.address === configService.network.nativeAsset.address) {
      if (!configService.network.bridgeNativeTransferContract)
        throw 'No bridge native transfer contract';
      const neonTransaction = await neonNeonWeb3Transaction(
        provider,
        account,
        configService.network.bridgeNativeTransferContract,
        solanaWallet,
        amount
      );

      const signedNeonTransaction = await sendNeonTransaction(
        neonTransaction,
        signer
      );
      console.log('Neon Transaction Hash', signedNeonTransaction);

      addTransaction({
        id: signedNeonTransaction.hash,
        type: 'tx',
        action: `bridgeTokens`,
        summary: `Transfer ${amount} ${token.symbol} from ${configService.network.chainName} to Solana`,
      });

      // TX Type: EVM
      return signedNeonTransaction;
    } else {
      const associatedToken = getAssociatedTokenAddressSync(
        mintPubkey,
        solanaWallet
      );
      const solanaTransaction = createMintSolanaTransaction(
        solanaWallet,
        mintPubkey,
        associatedToken,
        neonProxyStatus
      );
      solanaTransaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;
      const neonTransaction = await createMintNeonWeb3Transaction(
        provider,
        account,
        associatedToken,
        tokenOverride,
        amount
      );

      const simulatedTx = await simulateTransaction(
        connection,
        solanaTransaction,
        'finalized'
      );
      console.log('Solana Simulated Transaction', simulatedTx);
      const signedSolanaTransaction = await sendSolanaTransaction(
        connection,
        solanaTransaction,
        true,
        sendTransaction,
        { skipPreflight: false }
      );

      addTransaction({
        id: signedSolanaTransaction,
        type: 'tx',
        action: `bridgeTokens`,
        summary: `Prepare to receive ${amount} ${token.symbol} on Solana`,
      });

      await sleep(1000);

      addNotificationForSolanaTransaction(signedSolanaTransaction, 'tx');

      // TX Type: Solana
      console.log('Solana Transaction Hash', signedSolanaTransaction);

      const signedNeonTransaction = await sendNeonTransaction(
        neonTransaction,
        signer
      );

      addTransaction({
        id: signedNeonTransaction.hash,
        type: 'tx',
        action: `bridgeTokens`,
        summary: `Transfer ${amount} ${token.symbol} from ${configService.network.chainName} to Solana`,
      });

      // TX Type: EVM
      console.log('Neon Transaction Hash', signedNeonTransaction);

      await signedNeonTransaction.wait();

      if (
        configService.network.bridgeUnwrapOut &&
        configService.network.bridgeUnwrapOut.includes(
          mintPubkey.toString().toLowerCase()
        )
      ) {
        const unwrapTransaction = await createUnwrapSOLTransaction(
          connection,
          solanaWallet,
          tokenOverride
        );
        unwrapTransaction.recentBlockhash = (
          await connection.getLatestBlockhash()
        ).blockhash;

        const simulatedTx = await simulateTransaction(
          connection,
          unwrapTransaction,
          'finalized'
        );
        console.log('Solana Simulated Transaction', simulatedTx);

        const signature = await sendSolanaTransaction(
          connection,
          unwrapTransaction,
          true,
          sendTransaction,
          { skipPreflight: false }
        );

        addTransaction({
          id: signature,
          type: 'tx',
          action: `bridgeTokens`,
          summary: `Unwrap ${token.symbol} on Solana`,
        });

        addNotificationForSolanaTransaction(signature, 'tx');

        // TX Type: Solana
        console.log('Unwrap Tx Hash', signature);
      }
      return signedNeonTransaction;
    }
  }
}

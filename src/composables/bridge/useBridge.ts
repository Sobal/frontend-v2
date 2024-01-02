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
} from './functions/transactions';
import { configService } from '@/services/config/config.service';
import { TokenInfo } from '@/types/TokenList';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Signer } from '@ethersproject/abstract-signer';
import { WalletAdapterProps } from '@solana/wallet-adapter-base';
import { NeonProgramStatus } from './interfaces/api';

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
  neonProxyApi: NeonProxyRpcApi,
  neonProxyStatus: NeonProgramStatus
) {
  const solanaWallet = new PublicKey(publicKeyTrimmed);

  const neonEvmProgram = new PublicKey(neonProxyStatus.NEON_EVM_ID);

  // Solana to EVM
  if (walletType === WalletTypes.Solana) {
    if (!configService.network.nativeAsset.address_spl)
      throw 'Native Asset SPL Address Missing';

    const neonTokenMint = new PublicKey(
      configService.network.nativeAsset.address_spl
    );

    if (token.address === configService.network.nativeAsset.address) {
      console.log(
        'neonEvmProgram,neonTokenMint',
        neonEvmProgram,
        neonTokenMint
      );

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
      ).blockhash; // Network blockhash
      const signature = await sendSolanaTransaction(
        connection,
        transaction,
        false,
        sendTransaction,
        { skipPreflight: false }
      ); // method for sign and send transaction to network

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
        false,
        sendTransaction,
        { skipPreflight: false }
      ); // method for sign and send transaction to network

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
      console.log('Solana Transaction Hash', signature);
      return signature;
    }
    // EVM to Solana
  } else {
    if (!token.address_spl) throw 'No SPL token address for this token';
    const mintPubkey = new PublicKey(token.address_spl);

    if (token.address === configService.network.nativeAsset.address) {
      console.log('sending native neon to solana');
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
        token,
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
      console.log('Solana Transaction Hash', signedSolanaTransaction);
      const signedNeonTransaction = await sendNeonTransaction(
        neonTransaction,
        signer
      );
      console.log('Neon Transaction Hash', signedNeonTransaction);

      if (
        configService.network.bridgeUnwrapOut &&
        configService.network.bridgeUnwrapOut.includes(
          mintPubkey.toString().toLowerCase()
        )
      ) {
        const unwrapTransaction = await createUnwrapSOLTransaction(
          connection,
          solanaWallet,
          token
        );
        unwrapTransaction.recentBlockhash = (
          await connection.getLatestBlockhash()
        ).blockhash;
        const signature = await sendSolanaTransaction(
          connection,
          unwrapTransaction,
          true,
          sendTransaction,
          { skipPreflight: false }
        );
        console.log('Unwrap Tx Hash', signature);
      }
      return signedNeonTransaction;
    }
  }
}

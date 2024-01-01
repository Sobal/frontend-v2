import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { WalletType, WalletTypes } from '@/types/wallet';
import { NeonProxyRpcApi } from './classes/api';
import {
  createMintNeonWeb3Transaction,
  createMintSolanaTransaction,
  neonTransferMintWeb3Transaction,
  sendNeonTransaction,
  sendSolanaTransaction,
  simulateTransaction,
} from './functions/transactions';
import { configService } from '@/services/config/config.service';
import { TokenInfo } from '@/types/TokenList';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Signer } from '@ethersproject/abstract-signer';
import { WalletAdapterProps } from '@solana/wallet-adapter-base';

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
  sendTransaction: WalletAdapterProps['sendTransaction']
) {
  const solanaWallet = new PublicKey(publicKeyTrimmed);

  const neonNeonEvmUrl = configService.network.rpc;
  const solanaUrl = configService.network.solanaRpc;

  const neonProxyApi = new NeonProxyRpcApi({
    neonProxyRpcApi: neonNeonEvmUrl,
    solanaRpcApi: solanaUrl,
  });

  const neonProxyStatus = await neonProxyApi.evmParams();
  const neonEvmProgram = new PublicKey(neonProxyStatus.NEON_EVM_ID);

  if (walletType === WalletTypes.Solana) {
    console.log(
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
  } else {
    const mintPubkey = new PublicKey(token.address_spl ?? '');
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
    return signedNeonTransaction;
  }
}

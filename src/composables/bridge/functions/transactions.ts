import {
  AccountMeta,
  Connection,
  PublicKey,
  SendOptions,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  TransactionSignature,
} from '@solana/web3.js';
import { NeonProxyRpcApi } from '../classes/api';
import {
  ClaimInstructionResult,
  NeonEmulate,
  NeonProgramStatus,
  SolanaAccount,
} from '../interfaces/api';
import { Amount } from '../interfaces/tokens';
import { parseUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
import { Wallet } from 'ethers';
import {
  Provider,
  TransactionRequest,
  TransactionResponse,
} from '@ethersproject/providers';
import { SHA256 } from 'crypto-js';
import {
  createApproveInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';
import { erc20ForSPLContract } from './contracts';
import { COMPUTE_BUDGET_ID, NEON_HEAP_FRAME } from '../constants/addresses';
import {
  authAccountAddress,
  collateralPoolAddress,
  neonBalanceProgramAddress,
  neonWalletProgramAddress,
} from './addresses';
import { numberTo64BitLittleEndian, toBytesInt32 } from './utils/addresses';
import { NEON_STATUS_DEVNET_SNAPSHOT } from '../constants/proxy';
import { EvmInstruction } from '../constants/instructions';
import { encode } from 'bs58';
import { TokenInfo } from '@/types/TokenList';
import { WalletAdapterProps } from '@solana/wallet-adapter-base';
import { Signer } from '@ethersproject/abstract-signer';

export async function neonTransferMintWeb3Transaction(
  connection: Connection,
  provider: Provider,
  proxyApi: NeonProxyRpcApi,
  proxyStatus: NeonProgramStatus,
  neonEvmProgram: PublicKey,
  solanaWallet: PublicKey,
  neonWallet: string,
  splToken: TokenInfo,
  amount: Amount,
  chainId: number
): Promise<any> {
  const fullAmount = parseUnits(amount.toString(), splToken.decimals);
  console.log('fullAmount', fullAmount);
  const associatedTokenAddress = getAssociatedTokenAddressSync(
    new PublicKey(splToken.address_spl ?? ''),
    solanaWallet
  );
  console.log('associatedTokenAddress', associatedTokenAddress);
  const claimData = claimTransactionData(
    associatedTokenAddress,
    neonWallet,
    fullAmount
  );
  console.log('claimData', claimData);
  const walletSigner = solanaWalletSigner(provider, solanaWallet, neonWallet);
  console.log('walletSigner', walletSigner);
  const signedTransaction = await neonClaimTransactionFromSigner(
    claimData,
    walletSigner,
    neonWallet,
    splToken
  );
  console.log('signedTransaction', signedTransaction);
  const { neonKeys, neonTransaction, legacyAccounts } =
    await createClaimInstruction(proxyApi, signedTransaction);
  console.log(
    'neonKeys, neonTransaction, legacyAccounts',
    neonKeys,
    neonTransaction,
    legacyAccounts
  );
  return neonTransferMintTransaction(
    connection,
    proxyStatus,
    neonEvmProgram,
    solanaWallet,
    neonWallet,
    walletSigner,
    neonKeys,
    legacyAccounts,
    neonTransaction,
    splToken,
    fullAmount,
    chainId
  );
}

export function claimTransactionData(
  associatedToken: PublicKey,
  neonWallet: string,
  amount: BigNumber
): string {
  const claimTo = erc20ForSPLContract().encodeFunctionData('claimTo', [
    associatedToken.toBuffer(),
    neonWallet,
    amount,
  ]);
  return claimTo;
}

export async function neonClaimTransactionFromSigner(
  claimData: string,
  walletSigner: Wallet,
  neonWallet: string,
  splToken: TokenInfo
): Promise<string> {
  const transaction: TransactionRequest = {
    data: claimData,
    gasLimit: `0x5F5E100`, // 100000000
    gasPrice: `0x0`,
    from: neonWallet,
    to: splToken.address, // contract address
  };
  console.log('wallet signer address', walletSigner.getAddress());
  return await walletSigner.signTransaction(transaction);
}

export function solanaWalletSigner(
  provider: Provider,
  solanaWallet: PublicKey,
  neonWallet: string
): Wallet {
  const emulateSignerPrivateKey = `0x${SHA256(
    solanaWallet.toBase58() + neonWallet
  ).toString()}`;
  console.log('emulateSignerPrivateKey', emulateSignerPrivateKey);
  const wallet = new Wallet(emulateSignerPrivateKey, provider);
  return wallet;
}

export async function createClaimInstruction(
  proxyApi: NeonProxyRpcApi,
  neonTransaction: string
): Promise<ClaimInstructionResult> {
  try {
    let neonEmulate: NeonEmulate;
    const legacyAccounts: SolanaAccount[] = [];
    const accountsMap = new Map<string, AccountMeta>();
    if (neonTransaction) {
      neonEmulate = await proxyApi.neonEmulate([neonTransaction.slice(2)]);
      if (neonEmulate) {
        const { accounts = [], solana_accounts = [] } = neonEmulate;
        for (const account of accounts) {
          const key = account['account'];
          accountsMap.set(key, {
            pubkey: new PublicKey(key),
            isSigner: false,
            isWritable: true,
          });
          if (account['contract']) {
            const key = account['contract'];
            accountsMap.set(key, {
              pubkey: new PublicKey(key),
              isSigner: false,
              isWritable: true,
            });
          }
        }

        for (const account of solana_accounts) {
          const { pubkey, is_legacy, is_writable } = account;
          accountsMap.set(pubkey, {
            pubkey: new PublicKey(pubkey),
            isSigner: false,
            isWritable: is_writable,
          });
          if (is_legacy) {
            legacyAccounts.push(account);
          }
        }
      }
    }

    return {
      neonKeys: Array.from(accountsMap.values()),
      neonTransaction,
      legacyAccounts,
    };
  } catch (e) {
    console.log(e);
  }
  // @ts-ignore
  return { neonKeys: [], neonTransaction: null };
}

export async function neonTransferMintTransaction(
  connection: Connection,
  proxyStatus: NeonProgramStatus,
  neonEvmProgram: PublicKey,
  solanaWallet: PublicKey,
  neonWallet: string,
  emulateSigner: Wallet,
  neonKeys: AccountMeta[],
  legacyAccounts: SolanaAccount[],
  neonTransaction: string,
  splToken: TokenInfo,
  amount: BigNumber,
  chainId: number
): Promise<Transaction> {
  const computedBudgetProgram = new PublicKey(COMPUTE_BUDGET_ID);
  const [delegatePDA] = authAccountAddress(
    emulateSigner.address,
    neonEvmProgram,
    splToken
  );
  const [neonWalletBalanceAddress] = neonBalanceProgramAddress(
    neonWallet,
    neonEvmProgram,
    chainId
  );
  const [emulateSignerBalanceAddress] = neonBalanceProgramAddress(
    emulateSigner.address,
    neonEvmProgram,
    chainId
  );
  const neonWalletBalanceAccount = await connection.getAccountInfo(
    neonWalletBalanceAddress
  );
  const emulateSignerBalanceAccount = await connection.getAccountInfo(
    emulateSignerBalanceAddress
  );
  const associatedTokenAddress = getAssociatedTokenAddressSync(
    new PublicKey(splToken.address_spl ?? ''),
    solanaWallet
  );
  const transaction = new Transaction({ feePayer: solanaWallet });

  transaction.add(
    createComputeBudgetHeapFrameInstruction(computedBudgetProgram, proxyStatus)
  );
  transaction.add(
    createApproveDepositInstruction(
      solanaWallet,
      delegatePDA,
      associatedTokenAddress,
      amount.toNumber()
    )
  );

  if (!neonWalletBalanceAccount) {
    transaction.add(
      createAccountBalanceInstruction(
        solanaWallet,
        neonEvmProgram,
        neonWallet,
        chainId
      )
    );
  }

  if (!emulateSignerBalanceAccount) {
    transaction.add(
      createAccountBalanceInstruction(
        solanaWallet,
        neonEvmProgram,
        emulateSigner.address,
        chainId
      )
    );
  }

  for (const account of legacyAccounts) {
    const instruction = await createAccountBalanceForLegacyAccountInstruction(
      connection,
      account,
      solanaWallet,
      neonEvmProgram,
      chainId
    );
    if (instruction) {
      transaction.add(instruction);
    }
  }

  if (neonTransaction) {
    transaction.add(
      createExecFromDataInstructionV2(
        solanaWallet,
        neonWallet,
        neonEvmProgram,
        neonTransaction,
        neonKeys,
        proxyStatus,
        chainId
      )
    );
  }

  return transaction;
}

export function createComputeBudgetHeapFrameInstruction(
  programId: PublicKey,
  proxyStatus: NeonProgramStatus
): TransactionInstruction {
  const a = Buffer.from([0x01]);
  const b = Buffer.from(
    toBytesInt32(parseInt(proxyStatus.NEON_HEAP_FRAME ?? NEON_HEAP_FRAME))
  );
  const data = Buffer.concat([a, b]);
  return new TransactionInstruction({ programId, data, keys: [] });
}

export function createExecFromDataInstructionV2(
  solanaWallet: PublicKey,
  neonWallet: string,
  neonEvmProgram: PublicKey,
  neonRawTransaction: string,
  neonKeys: AccountMeta[],
  proxyStatus: NeonProgramStatus,
  chainId: number
): TransactionInstruction {
  const count = Number(
    proxyStatus.NEON_POOL_COUNT ?? NEON_STATUS_DEVNET_SNAPSHOT.NEON_POOL_COUNT
  );
  const treasuryPoolIndex = Math.floor(Math.random() * count) % count;
  const [balanceAccount] = neonBalanceProgramAddress(
    neonWallet,
    neonEvmProgram,
    chainId
  );
  const [treasuryPoolAddress] = collateralPoolAddress(
    neonEvmProgram,
    treasuryPoolIndex
  );
  const a = Buffer.from([EvmInstruction.TransactionExecuteFromInstruction]);
  const b = Buffer.from(toBytesInt32(treasuryPoolIndex));
  const c = Buffer.from(neonRawTransaction.slice(2), 'hex');
  const data = Buffer.concat([a, b, c]);
  const keys: AccountMeta[] = [
    { pubkey: solanaWallet, isSigner: true, isWritable: true },
    { pubkey: treasuryPoolAddress, isSigner: false, isWritable: true },
    { pubkey: balanceAccount, isSigner: false, isWritable: true },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
    ...neonKeys,
  ];

  return new TransactionInstruction({ programId: neonEvmProgram, keys, data });
}

export async function createAccountBalanceForLegacyAccountInstruction(
  connection: Connection,
  account: SolanaAccount,
  solanaWallet: PublicKey,
  neonEvmProgram: PublicKey,
  chainId: number
): Promise<TransactionInstruction | null> {
  const accountAddress = new PublicKey(account.pubkey);
  const accountInfo = await connection.getAccountInfo(accountAddress);
  if (accountInfo) {
    const neonAddress = `0x${accountInfo?.data.slice(1, 21).toString('hex')}`;
    return createAccountBalanceInstruction(
      solanaWallet,
      neonEvmProgram,
      neonAddress,
      chainId
    );
  }
  return null;
}

export function createAccountBalanceInstruction(
  solanaWallet: PublicKey,
  neonEvmProgram: PublicKey,
  neonWallet: string,
  chainId: number
): TransactionInstruction {
  const [neonWalletAddress] = neonWalletProgramAddress(
    neonWallet,
    neonEvmProgram
  );
  const [balanceAddress] = neonBalanceProgramAddress(
    neonWallet,
    neonEvmProgram,
    chainId
  );
  const keys = [
    { pubkey: solanaWallet, isSigner: true, isWritable: true },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: balanceAddress, isSigner: false, isWritable: true },
    { pubkey: neonWalletAddress, isSigner: false, isWritable: true },
  ];
  const a = Buffer.from([EvmInstruction.AccountCreateBalance]);
  const b = Buffer.from(neonWallet.slice(2), 'hex');
  const c = numberTo64BitLittleEndian(chainId);
  const data = Buffer.concat([a, b, c]);
  return new TransactionInstruction({ programId: neonEvmProgram, keys, data });
}

export function createApproveDepositInstruction(
  solanaWallet: PublicKey,
  neonPDAWallet: PublicKey,
  associatedToken: PublicKey,
  amount: number | bigint
): TransactionInstruction {
  return createApproveInstruction(
    associatedToken,
    neonPDAWallet,
    solanaWallet,
    amount
  );
}

export async function sendSolanaTransaction(
  connection: Connection,
  transaction: Transaction,
  confirm = false,
  sendTransaction: WalletAdapterProps['sendTransaction'],
  options?: SendOptions
): Promise<TransactionSignature> {
  const signed = await sendTransaction(transaction, connection, options);
  solanaTransactionLog(transaction);
  if (confirm) {
    await connection.confirmTransaction(signed);
  }
  return signed;
}

export async function sendNeonTransaction(
  transaction: TransactionRequest,
  signer: Signer
): Promise<TransactionResponse> {
  const receipt = await signer.sendTransaction(transaction);
  return receipt;
}

export function solanaTransactionLog(transaction: Transaction): void {
  console.log(
    transaction.instructions
      .map(({ programId, keys, data }, index) => {
        return `[${index}] programId: ${programId.toBase58()}
keys:
${keys
  .map(
    k =>
      `${k.pubkey.toBase58()} [${k.isSigner ? 'signer' : ''}${
        k.isSigner && k.isWritable ? ', ' : ''
      }${k.isWritable ? 'writer' : ''}]`
  )
  .join('\n')}
data:
${encode(data)}
0x${Buffer.from(data).toString('hex')}
${JSON.stringify(data)}
------------------------------`;
      })
      .join('\n\n')
  );
}

export function createMintSolanaTransaction(
  solanaWallet: PublicKey,
  tokenMint: PublicKey,
  associatedToken: PublicKey,
  proxyStatus: NeonProgramStatus
): Transaction {
  const computedBudgetProgram = new PublicKey(COMPUTE_BUDGET_ID);
  const transaction = new Transaction({ feePayer: solanaWallet });
  // transaction.add(createComputeBudgetUtilsInstruction(computedBudgetProgram, proxyStatus));
  transaction.add(
    createComputeBudgetHeapFrameInstruction(computedBudgetProgram, proxyStatus)
  );
  transaction.add(
    createAssociatedTokenAccountInstruction(
      tokenMint,
      associatedToken,
      solanaWallet,
      solanaWallet
    )
  );
  return transaction;
}

export async function createMintNeonWeb3Transaction(
  provider: Provider,
  neonWallet: string,
  associatedToken: PublicKey,
  splToken: TokenInfo,
  amount: Amount,
  gasLimit = 5e4
): Promise<TransactionRequest> {
  const data = mintNeonTransactionData(associatedToken, splToken, amount);
  const transaction = createMintNeonTransaction(neonWallet, splToken, data);
  transaction.gasPrice = await provider.getGasPrice();
  const gasEstimate = (await provider.estimateGas(transaction)).toNumber();
  transaction.nonce = await provider.getTransactionCount(neonWallet);
  // @ts-ignore
  transaction.gasLimit = gasEstimate > gasLimit ? gasEstimate + 1e4 : gasLimit;
  return transaction;
}

export function mintNeonTransactionData(
  associatedToken: PublicKey,
  splToken: TokenInfo,
  amount: Amount
): string {
  const fullAmount = parseUnits(amount.toString(), splToken.decimals);
  return erc20ForSPLContract().encodeFunctionData('transferSolana', [
    associatedToken.toBuffer(),
    fullAmount,
  ]);
}

export function createMintNeonTransaction(
  neonWallet: string,
  splToken: TokenInfo,
  data: string
): TransactionRequest {
  return { data, from: neonWallet, to: splToken.address, value: `0x0` };
}

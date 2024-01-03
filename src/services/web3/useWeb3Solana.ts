import { useWallet } from 'solana-wallets-vue';
import { computed, ref } from 'vue';
import { configService } from '../config/config.service';

/** STATE */
const isSolanaWalletSelectVisible = ref(false);
const toggleSolanaWalletSelectModal = (value?: boolean) => {
  isSolanaWalletSelectVisible.value =
    value ?? !isSolanaWalletSelectVisible.value;
};

export default function useWeb3Solana() {
  const {
    connected,
    wallets,
    wallet,
    connect,
    connecting,
    select,
    publicKey,
    disconnect,
    disconnecting,
    sendTransaction,
  } = useWallet();

  const allowedWallets = computed(() => wallets.value);

  const chosenWallet = computed(() => wallet.value);

  const isConnected = computed(() => connected.value);

  const content = computed(() => {
    if (connecting.value) return 'Connecting...';
    if (connected.value) return 'Connected';
    if (disconnecting.value) return 'Disconnecting...';
    if (wallet.value) return `Connect to ${wallet.value?.adapter.name}`;
    return 'Connect Solana Wallet';
  });

  const publicKeyBase58 = computed(() => publicKey.value?.toBase58());
  const publicKeyTrimmed = computed(() => {
    if (!wallet.value || !publicKeyBase58.value) return '';
    return publicKeyBase58.value;
  });

  const isConnecting = computed(() => {
    return connecting.value && !wallet.value;
  });

  const solanaExplorerLinks = {
    txLink: (txHash: string) =>
      `${configService.network.solanaExplorer}/tx/${txHash}/${configService.network.solanaExplorerSuffix}`,
    addressLink: (address: string) =>
      `${configService.network.solanaExplorer}/address/${address}/${configService.network.solanaExplorerSuffix}`,
    tokenLink: (address: string) =>
      `${configService.network.solanaExplorer}/token/${address}/${configService.network.solanaExplorerSuffix}`,
  };

  return {
    content,
    publicKeyTrimmed,
    chosenWallet,
    allowedWallets,
    isConnected,
    isSolanaWalletSelectVisible,
    isConnecting,
    solanaExplorerLinks,

    //methods
    toggleSolanaWalletSelectModal,
    connect,
    disconnect,
    select,
    sendTransaction,
  };
}

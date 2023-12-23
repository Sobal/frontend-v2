import { useWallet } from 'solana-wallets-vue';
import { computed, ref } from 'vue';

/** STATE */
const isSolanaWalletSelectVisible = ref(false);
const toggleSolanaWalletSelectModal = (value?: boolean) => {
  isSolanaWalletSelectVisible.value =
    value ?? !isSolanaWalletSelectVisible.value;
};

// const delayedToggleSolanaWalletSelectModal = debounce(
//   toggleSolanaWalletSelectModal,
//   200
// );

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

  return {
    content,
    publicKeyTrimmed,
    chosenWallet,
    allowedWallets,
    isConnected,
    isSolanaWalletSelectVisible,
    isConnecting,

    //methods
    toggleSolanaWalletSelectModal,
    connect,
    disconnect,
    select,
  };
}

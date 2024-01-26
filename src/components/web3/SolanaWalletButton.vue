<script lang="ts" setup>
import {
  WalletAdapterProps,
  WalletReadyState,
} from '@solana/wallet-adapter-base';
import useWeb3Solana from '@/services/web3/useWeb3Solana';
import { watch } from 'vue';

interface Props {
  wallet: WalletAdapterProps;
  walletState: WalletReadyState;
}

const props = defineProps<Props>();

const {
  connect,
  select,
  chosenWallet,
  isConnected,
  toggleSolanaWalletSelectModal,
} = useWeb3Solana();

const handleClick = async () => {
  select(props.wallet.name);
  toggleSolanaWalletSelectModal();
};

const isNotInstalled = computed(
  () =>
    props.walletState !== WalletReadyState.Installed &&
    props.walletState !== WalletReadyState.Loadable
);

watch(chosenWallet, async () => {
  if (chosenWallet.value && isConnected) {
    await connect().catch(() => {
      console.log('Failed to connect');
    });
    toggleSolanaWalletSelectModal(false);
  }
});
</script>

<template>
  <button
    class="wallet-connect-btn-solana"
    :disabled="isNotInstalled"
    @click="handleClick"
  >
    <div class="flex items-center w-full">
      <img :src="`${wallet.icon}`" class="mr-4 w-10 h-10" />
      <h5
        class="flex justify-between w-full text-base text-gray-700 dark:text-white"
      >
        <span class="capitalize">{{ wallet.name }}</span>
        <span v-if="isNotInstalled" class="text-gray-400">not installed</span>
      </h5>
    </div>
  </button>
</template>


<style scoped>
.wallet-connect-btn-solana {
  @apply transition-all;
  @apply bg-white dark:bg-gray-850 hover:bg-gray-50 dark:hover:bg-gray-800;
  @apply border dark:border-gray-900;
  @apply p-4 flex justify-start items-center w-full h-14 rounded-md mb-3 shadow-lg;
}
</style>
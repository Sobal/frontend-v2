<script lang="ts" setup>
import useWeb3Solana from '@/services/web3/useWeb3Solana';
import SolanaWalletButton from '@/components/web3/SolanaWalletButton.vue';
import { WalletReadyState } from '@solana/wallet-adapter-base';

interface Props {
  isVisible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isVisible: false,
});

const emit = defineEmits(['close']);

const { allowedWallets } = useWeb3Solana();

const stateOrder = {
  [WalletReadyState.Installed]: 0,
  [WalletReadyState.Loadable]: 1,
  [WalletReadyState.NotDetected]: 2,
  [WalletReadyState.Unsupported]: 3,
};

const sortedWallets = allowedWallets.value
  .sort((a, b) => a.adapter.name.localeCompare(b.adapter.name))
  .sort((a, b) => stateOrder[a.readyState] - stateOrder[b.readyState]);
</script>

<template>
  <BalModal
    :title="$t('connectWalletSolana')"
    :show="props.isVisible"
    @close="emit('close')"
  >
    <SolanaWalletButton
      v-for="wallet in sortedWallets"
      :key="wallet.adapter.name"
      :wallet="wallet.adapter"
      :walletState="wallet.readyState"
    />
  </BalModal>
</template>
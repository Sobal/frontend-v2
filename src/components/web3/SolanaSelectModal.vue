<script lang="ts" setup>
import useWeb3Solana from '@/services/web3/useWeb3Solana';
import SolanaWalletButton from '@/components/web3/SolanaWalletButton.vue';

interface Props {
  isVisible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isVisible: false,
});

const emit = defineEmits(['close']);

const { allowedWallets } = useWeb3Solana();
console.log(allowedWallets.value);
</script>

<template>
  <BalModal
    title="Connect to a Solana wallet"
    :show="props.isVisible"
    @close="emit('close')"
  >
    <SolanaWalletButton
      v-for="wallet in allowedWallets"
      :key="wallet.adapter.name"
      :wallet="wallet.adapter"
    />
  </BalModal>
</template>
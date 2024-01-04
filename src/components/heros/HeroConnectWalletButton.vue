<script lang="ts" setup>
import useFathom from '@/composables/useFathom';
import useWeb3 from '@/services/web3/useWeb3';

/**
 * COMPOSABLES
 */
const { startConnectWithInjectedProvider } = useWeb3();
const { trackGoal, Goals } = useFathom();

/**
 * METHODS
 */
function onClickConnect() {
  startConnectWithInjectedProvider();
  trackGoal(Goals.ClickHeroConnectWallet);
}
</script>

<template>
  <div
    class="text-3xl font-semibold text-center xl:text-left text-pink-400 cursor-pointer"
    @click="onClickConnect"
  >
    {{ $t('walletDisconnected') }}
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

// import DarkModeToggle from '@/components/btns/DarkModeToggle.vue';
import useBreakpoints from '@/composables/useBreakpoints';
import { useSidebar } from '@/composables/useSidebar';
import useWeb3 from '@/services/web3/useWeb3';

import AppNavAccountBtn from './AppNavAccountBtn.vue';
import AppNavActivityBtn from './AppNavActivityBtn/AppNavActivityBtn.vue';
import AppNavNetworkSelect from './AppNavNetworkSelect.vue';
import { Goals, trackGoal } from '@/composables/useFathom';

/**
 * COMPOSABLES
 */
const { isMobile } = useBreakpoints();
const { account, connector, startConnectWithInjectedProvider } = useWeb3();
const { setSidebarOpen } = useSidebar();

/**
 * COMPUTED
 */
const hideNetworkSelect = computed(() => connector.value?.id === 'gnosis');

/**
 * METHODS
 */
function connectWalletHandler() {
  trackGoal(Goals.ClickNavConnectWallet);
  startConnectWithInjectedProvider();
}
</script>

<template>
  <div
    class="grid grid-rows-1 grid-flow-col gap-2 p-1 py-1 pr-3 lg:pr-5 space-x-1 font-medium bg-gray-850 rounded-l-full border border-r-0 border-gray-800"
  >
    <!-- <DarkModeToggle v-if="isDesktop" /> -->
    <AppNavActivityBtn v-if="account" />
    <AppNavAccountBtn v-if="account" />
    <div
      v-else
      class="flex flex-row place-items-center cursor-pointer"
      @click="connectWalletHandler"
    >
      <BalBtn color="white" size="md" circle>
        <BalIcon name="sun" class="text-blue-500" />
      </BalBtn>
      <div class="pl-2">
        <span class="hidden lg:inline-block" v-text="$t('connectWallet')" />
        <span class="lg:hidden" v-text="$t('connect')" />
      </div>
    </div>
    <AppNavNetworkSelect v-if="!hideNetworkSelect" :size="40" />
    <BalBtn
      v-if="isMobile"
      color="white"
      flat
      size="base-noPad"
      circle
      @click="setSidebarOpen(true)"
    >
      <BalIcon name="menu" size="lg" />
    </BalBtn>
  </div>
</template>

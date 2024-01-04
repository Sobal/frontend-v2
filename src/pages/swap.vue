<script setup lang="ts">
import { computed, onMounted } from 'vue';
import MyWallet from '@/components/cards/MyWallet/MyWallet.vue';
import PairPriceGraph from '@/components/cards/PairPriceGraph/PairPriceGraph.vue';
import SwapCard from '@/components/cards/SwapCard/SwapCard.vue';
import usePoolFilters from '@/composables/pools/usePoolFilters';
import BridgeLink from '@/components/links/BridgeLink.vue';
import { hasBridge } from '@/composables/useNetwork';
import { provideUserTokens } from '@/providers/local/user-tokens.provider';
import useBreakpoints from '@/composables/useBreakpoints';
import Col2SwapLayout from '@/components/layouts/Col2SwapLayout.vue';
import { useSwapState } from '@/composables/swap/useSwapState';
import useNetwork from '@/composables/useNetwork';

/**
 * PROVIDERS
 */
provideUserTokens();

/**
 * COMPOSABLES
 */
const { setSelectedTokens } = usePoolFilters();
const { networkConfig } = useNetwork();
const { initialized } = useSwapState();
const { upToLargeBreakpoint } = useBreakpoints();

/**
 * VARIABLES
 */
const showSwapRoute = ref(false);

/**
 * COMPUTED
 */
const sections = computed(() => {
  const sections = [
    { title: 'Swap Route', id: 'swap-route' },
    { title: 'My wallet', id: 'my-wallet' },
    { title: 'Price chart', id: 'price-chart' },
  ];
  if (hasBridge.value) sections.push({ title: 'Bridge assets', id: 'bridge' });
  return sections;
});

/**
 * WATCHERS
 */

watch(useSwapState, swapStateChange => {
  showSwapRoute.value =
    initialized.value &&
    swapStateChange.tokenInAddress.value &&
    swapStateChange.tokenOutAddress.value &&
    swapStateChange.tokenInAmount.value &&
    swapStateChange.tokenInAmount.value !== 'NaN' &&
    swapStateChange.tokenOutAmount.value
      ? true
      : false;
});

/**
 * CALLBACKS
 */
onMounted(() => {
  // selectedPoolTokens are only persisted between the Home/Pool pages
  setSelectedTokens([]);
});
</script>

<template>
  <div>
    <div class="flex flex-col justify-between">
      <h1 class="mt-5 xl:mt-0 font-light text-center xl:text-left">
        {{ $t('swapOn') }}
        <span class="font-medium">{{ networkConfig.chainName }}</span>
      </h1>
    </div>
    <Col2SwapLayout class="mt-8">
      <template #left>
        <SwapCard />
      </template>

      <div class="p-4 sm:p-0 lg:p-0 mt-8">
        <BalAccordion
          v-if="upToLargeBreakpoint"
          class="w-full"
          :isOpenedByDefault="true"
          :sections="sections"
        >
          <template v-if="showSwapRoute" #swap-route>
            <TeleportTarget id="route-card" />
          </template>
          <template #my-wallet>
            <MyWallet />
          </template>
          <template #price-chart>
            <PairPriceGraph />
          </template>
          <template v-if="hasBridge" #bridge>
            <BridgeLink />
          </template>
        </BalAccordion>
      </div>

      <template v-if="!upToLargeBreakpoint" #right>
        <PairPriceGraph height="150" class="pb-5" />
        <TeleportTarget v-if="showSwapRoute" id="route-card" class="mb-4" />
        <BalCard v-else class="mb-4 text-center">{{
          $t('swapRouteOnInput')
        }}</BalCard>
        <MyWallet />
        <BridgeLink v-if="hasBridge" class="mt-4" />
      </template>
    </Col2SwapLayout>
  </div>
</template>

<style scoped>
.graph-modal {
  height: 450px;
}
</style>

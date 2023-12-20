<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { SubgraphPoolBase } from '@sobal/sdk';
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
import SwapRoute from '@/components/cards/SwapCard/SwapRoute.vue';
import useSwapping from '@/composables/swap/useSwapping';
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

const exactIn = ref(true);

const {
  tokenInAddress,
  tokenOutAddress,
  tokenInAmount,
  tokenOutAmount,
  initialized,
} = useSwapState();

const swapping = useSwapping(
  exactIn,
  tokenInAddress,
  tokenInAmount,
  tokenOutAddress,
  tokenOutAmount
);

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
const { upToLargeBreakpoint } = useBreakpoints();

const pools = computed<SubgraphPoolBase[]>(
  // @ts-ignore-next-line -- Fix types incompatibility error. Related to BigNumber?
  () => {
    return swapping.sor.pools.value;
  }
);

const showSwapRoute = computed(
  () =>
    initialized &&
    swapping.tokenInAmountInput.value &&
    swapping.tokenInAmountInput.value !== 'NaN' &&
    swapping.tokenOutAmountInput.value
);

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
            <SwapRoute
              v-if="showSwapRoute"
              :addressIn="swapping.tokenIn.value.address"
              :amountIn="swapping.tokenInAmountInput.value"
              :addressOut="swapping.tokenOut.value.address"
              :amountOut="swapping.tokenOutAmountInput.value"
              :pools="pools"
              :sorReturn="swapping.sor.sorReturn.value"
              class="mb-4"
              hideContainer
            />
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
        <SwapRoute
          v-if="showSwapRoute"
          :addressIn="swapping.tokenIn.value.address"
          :amountIn="swapping.tokenInAmountInput.value"
          :addressOut="swapping.tokenOut.value.address"
          :amountOut="swapping.tokenOutAmountInput.value"
          :pools="pools"
          :sorReturn="swapping.sor.sorReturn.value"
          class="mb-4"
          hideContainer
        />
        <BalCard v-if="!showSwapRoute" class="mb-4 text-center">{{
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

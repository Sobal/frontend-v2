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

/**
 * PROVIDERS
 */
provideUserTokens();

/**
 * COMPOSABLES
 */
const { setSelectedTokens } = usePoolFilters();
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
          <template #swap-route>
            <SwapRoute
              v-if="initialized"
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
        <PairPriceGraph />
        <SwapRoute
          v-if="initialized"
          :addressIn="swapping.tokenIn.value.address"
          :amountIn="swapping.tokenInAmountInput.value"
          :addressOut="swapping.tokenOut.value.address"
          :amountOut="swapping.tokenOutAmountInput.value"
          :pools="pools"
          :sorReturn="swapping.sor.sorReturn.value"
          class="mb-4"
          hideContainer
        />
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

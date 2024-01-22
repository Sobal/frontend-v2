<script setup lang="ts">
import { useRouter } from 'vue-router';

import TokenSearchInput from '@/components/inputs/TokenSearchInput.vue';
import FeaturedProtocols from '@/components/sections/FeaturedProtocols.vue';
import LatestArticles from '@/components/sections/LatestArticles.vue';

import PoolsTable from '@/components/tables/PoolsTable/PoolsTable.vue';
import usePoolFilters from '@/composables/pools/usePoolFilters';
import useBreakpoints from '@/composables/useBreakpoints';
import useNetwork from '@/composables/useNetwork';
import usePools from '@/composables/pools/usePools';
import { lsGet, lsSet } from '@/lib/utils';
import LS_KEYS from '@/constants/local-storage.keys';
import { useIntersectionObserver } from '@vueuse/core';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';

const featuredProtocolsSentinel = ref<HTMLDivElement | null>(null);
const isFeaturedVisible = ref(false);
useIntersectionObserver(featuredProtocolsSentinel, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    isFeaturedVisible.value = true;
  }
});

/**
 * STATE
 */
const route = useRoute();
const urlSortParam = route.query?.sort as string | undefined;
const initSortCol =
  urlSortParam || lsGet(LS_KEYS.App.PoolSorting) || 'totalLiquidity';

/**
 * COMPOSABLES
 */
const router = useRouter();
const { appNetworkConfig } = useNetwork();
const isElementSupported = appNetworkConfig.supportsElementPools;
const displayLatestArticles = appNetworkConfig.showLatestArticles;

const { selectedTokens, addSelectedToken, removeSelectedToken } =
  usePoolFilters();

const poolsSortField = ref('totalLiquidity');

const { pools, isLoading, poolsIsFetchingNextPage, loadMorePools } = usePools(
  selectedTokens,
  poolsSortField
);
const { upToMediumBreakpoint } = useBreakpoints();
const { networkSlug, networkConfig } = useNetwork();
const { fNum } = useNumbers();

const isPaginated = computed(() => pools.value.length > 10);

const totalLiquidity = computed(() => {
  return pools.value.reduce((total, pool) => {
    return total + Number(pool.totalLiquidity);
  }, 0);
});

const tvl = computed(() => {
  return fNum(totalLiquidity.value, FNumFormats.fiat);
});

const volumeSnapshot = computed(() => {
  return pools.value.reduce((total, pool) => {
    return total + Number(pool.volumeSnapshot);
  }, 0);
});

const feesSnapshot = computed(() => {
  return pools.value.reduce((total, pool) => {
    return total + Number(pool.feesSnapshot);
  }, 0);
});
/**
 * METHODS
 */
function navigateToCreatePool() {
  router.push({ name: 'create-pool', params: { networkSlug } });
}

function onColumnSort(columnId: string) {
  poolsSortField.value = columnId;
  lsSet(LS_KEYS.App.PoolSorting, columnId);
}
</script>

<template>
  <div>
    <div class="flex flex-col justify-between">
      <h1 class="mt-5 xl:mt-0 font-light text-center xl:text-left">
        {{ $t('liquidityPoolsOn') }}
        <span class="font-medium">{{ networkConfig.chainName }}</span>
      </h1>
    </div>
    <div class="xl:px-4 pt-10 md:pt-8 xl:mx-auto">
      <BalStack vertical>
        <div class="px-4 xl:px-0">
          <BalLoadingBlock
            v-if="isLoading"
            :class="['min-w-full', 'h-14']"
            square
          />
          <div
            v-else
            class="flex items-center place-content-center p-4 mt-4 mb-4 space-x-6 dark:bg-gray-850 rounded-lg border dark:border-0 text-md"
          >
            <div class="text-center">
              {{ $t('networkTvl') }}
              <span class="font-semibold text-blue-600">{{ tvl }}</span>
            </div>
            <div class="text-center">
              {{ $t('networkVol') }}
              <span class="font-semibold text-blue-600">{{
                fNum(volumeSnapshot, FNumFormats.fiat)
              }}</span>
            </div>
            <div class="text-center">
              {{ $t('networkFees') }}

              <span class="font-semibold text-blue-600">{{
                fNum(feesSnapshot, FNumFormats.fiat)
              }}</span>
            </div>
          </div>
          <div class="flex flex-col justify-between mb-2">
            <BalBtn
              v-if="upToMediumBreakpoint"
              color="blue"
              size="sm"
              outline
              :class="{ 'mt-4': upToMediumBreakpoint }"
              class="w-full"
              @click="navigateToCreatePool"
            >
              {{ $t('createAPool.title') }}
            </BalBtn>
          </div>

          <div
            class="flex flex-col md:flex-row justify-between items-end lg:items-center w-full"
          >
            <TokenSearchInput
              v-model="selectedTokens"
              class="w-full md:w-2/3"
              @add="addSelectedToken"
              @remove="removeSelectedToken"
            />
            <BalBtn
              v-if="!upToMediumBreakpoint"
              color="blue"
              size="sm"
              outline
              :class="{ 'mt-4': upToMediumBreakpoint }"
              :block="upToMediumBreakpoint"
              @click="navigateToCreatePool"
            >
              {{ $t('createAPool.title') }}
            </BalBtn>
          </div>
        </div>
        <PoolsTable
          :data="pools"
          :noPoolsLabel="$t('noPoolsFound')"
          :isLoading="isLoading"
          :selectedTokens="selectedTokens"
          class="mb-8"
          :sortColumn="initSortCol"
          :hiddenColumns="['migrate', 'actions', 'lockEndDate']"
          :isLoadingMore="poolsIsFetchingNextPage"
          :isPaginated="isPaginated"
          skeletonClass="pools-table-loading-height"
          @on-column-sort="onColumnSort"
          @load-more="loadMorePools"
        />
        <div ref="featuredProtocolsSentinel" />
        <div
          v-if="isElementSupported && isFeaturedVisible"
          class="p-4 xl:p-0 mt-12"
        >
          <FeaturedProtocols />
        </div>
        <div
          v-if="displayLatestArticles && isFeaturedVisible"
          class="p-4 xl:p-0 mt-12"
        >
          <LatestArticles :network="appNetworkConfig.network" />
        </div>
      </BalStack>
    </div>
  </div>
</template>

<style>
.pools-table-loading-height {
  height: 40rem;
}
</style>

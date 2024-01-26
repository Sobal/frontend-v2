<script lang="ts" setup>
import { computed } from 'vue';
import useNetwork from '@/composables/useNetwork';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import useWeb3 from '@/services/web3/useWeb3';

import HeroConnectWalletButton from './HeroConnectWalletButton.vue';
import { useUserPools } from '@/providers/local/user-pools.provider';
import ProceedToSyncModal from '../contextual/pages/vebal/cross-chain-boost/ProceedToSyncModal.vue';

/**
 * COMPOSABLES
 */
const showProceedModal = ref(false);
const { fNum } = useNumbers();
const { isWalletReady, isWalletConnecting } = useWeb3();
const { totalFiatValue, isLoading: isLoadingPools } = useUserPools();
const { networkConfig } = useNetwork();

/**
 * COMPUTED
 */

const totalInvestedLabel = computed((): string =>
  fNum(totalFiatValue.value, FNumFormats.fiat)
);

const isLoadingTotalValue = computed((): boolean => isLoadingPools.value);
</script>

<template>
  <div class="flex flex-col justify-between">
    <h1 class="mt-5 xl:mt-0 font-light text-center xl:text-left">
      {{ $t('mySobalBalance') }}
      <span class="font-medium">{{ networkConfig.chainName }}</span>
    </h1>

    <template v-if="isWalletReady || isWalletConnecting">
      <BalLoadingBlock
        v-if="isLoadingTotalValue"
        class="mx-auto xl:mx-0 w-40 h-10"
        white
      />
      <div
        v-else
        class="mb-1 text-3xl font-semibold text-center xl:text-left text-orange-400"
      >
        {{ totalInvestedLabel }}
      </div>
    </template>
    <template v-else>
      <HeroConnectWalletButton />
    </template>

    <ProceedToSyncModal
      :isVisible="showProceedModal"
      @close="showProceedModal = false"
    />
  </div>
</template>

<style>
.vebal-banner::before {
  @apply border border-yellow-500;

  content: '';
  width: 16px;
  height: 6px;
  left: 0;
  top: -5px;
  position: absolute;
  border-top-left-radius: 8px;
}

.vebal-banner::after {
  @apply border border-yellow-500;

  content: '';
  width: 16px;
  height: 6px;
  bottom: -5px;
  right: 0;
  position: absolute;
  border-bottom-right-radius: 8px;
}
</style>

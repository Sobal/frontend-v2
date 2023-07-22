<script lang="ts" setup>
import { incentivizedProtocolIconPaths } from '@/composables/useIncentivizedPool';
import { PoolMetadata } from '@/types/pools';

type Props = {
  metadata: PoolMetadata;
};

const props = defineProps<Props>();

const incentiveProtocols = props.metadata?.incentiveProtocols || [];

const iconURIs = incentiveProtocols.map(
  protocol => incentivizedProtocolIconPaths[protocol]
);

const hasIcons = incentiveProtocols.length > 0;

const width = 20 + (iconURIs.length - 1) * 16;
</script>

<template>
  <div
    data-testid="incentivised-chip"
    class="flex relative items-center py-1 pr-1.5 pl-2 mr-3 max-h-10 bg-gradient-to-tr from-green-500 to-pink-500 rounded"
  >
    <BalAssetSet
      v-if="hasIcons"
      :logoURIs="iconURIs"
      :width="width"
      :size="16"
      :ringSize="1"
    />
    <span class="text-xs font-semibold text-white">{{
      props.metadata?.incentivizedButtonText
        ? props.metadata?.incentivizedButtonText
        : $t('incentivized')
    }}</span>
  </div>
</template>

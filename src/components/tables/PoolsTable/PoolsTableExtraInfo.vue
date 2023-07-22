<script lang="ts" setup>
import {
  isLiquidityBootstrapping,
  isBoosted,
  isIncentivised,
} from '@/composables/usePoolHelpers';
import { poolMetadata } from '@/lib/config/metadata';
import { Pool } from '@/services/pool/types';
import { PoolMetadata } from '@/types/pools';
import BalChipNew from '@/components/chips/BalChipNew.vue';
import IncentivizedChip from '@/components/chips/IncentivizedChip.vue';
import BoostedChip from '@/components/chips/BoostedChip.vue';
import PoolWarningTooltip from '@/components/pool/PoolWarningTooltip.vue';

type Props = {
  pool: Pool;
};

defineProps<Props>();
</script>

<template>
  <div class="flex flex-wrap">
    <BalTooltip v-if="isBoosted(pool)" :text="$t('boostedTooltip')" width="56">
      <template #activator>
        <BoostedChip
          :metadata="poolMetadata(pool.id) as PoolMetadata"
          class="ml-1"
        />
      </template>
    </BalTooltip>

    <BalTooltip
      v-if="isIncentivised(pool)"
      :text="$t('incentivizedTooltip')"
      width="56"
    >
      <template #activator>
        <IncentivizedChip
          :metadata="poolMetadata(pool.id) as PoolMetadata"
          class="ml-1"
        />
      </template>
    </BalTooltip>

    <BalChip
      v-if="isLiquidityBootstrapping(pool.poolType)"
      label="LBP"
      color="amber"
      class="text-xs font-medium"
    />
    <BalChipNew v-else-if="pool?.isNew" class="my-2 text-lg font-medium" />

    <PoolWarningTooltip :pool="pool" />
  </div>
</template>

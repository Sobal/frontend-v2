<script setup lang="ts">
import useBreakpoints from '@/composables/useBreakpoints';
import { BalDetailsTableData } from '@/services/pool/types';

/**
 * TYPES
 */
type Props = {
  tableData: (BalDetailsTableData | null)[];
};

/**
 * PROPS
 */
defineProps<Props>();

/**
 * COMPOSABLES
 */
const { upToLargeBreakpoint } = useBreakpoints();
</script>

<template>
  <BalCard class="overflow-x-auto" :square="upToLargeBreakpoint" noPad>
    <template v-for="(row, i) in tableData" :key="i">
      <div v-if="row" class="table-row">
        <div class="table-row-title">
          {{ row.title }}
        </div>
        <div class="table-row-value">
          {{ row.value }}
          <BalTooltip
            v-if="row.tooltip"
            :text="row.tooltip"
            iconSize="sm"
            class="mt-1 ml-2"
          />
          <BalLink v-if="row.link" :href="row.link" external noStyle>
            <BalIcon
              name="arrow-up-right"
              size="sm"
              class="mt-2 ml-2 text-gray-500 hover:text-blue-500 transition-colors"
            />
          </BalLink>
        </div>
      </div>
    </template>
  </BalCard>
</template>

<style scoped>
.table-row {
  @apply flex border-l border-r border-gray-800;
}

.table-row:nth-child(even) {
  @apply dark:bg-gray-900;
}

.table-row:first-child {
  @apply font-semibold py-3 bg-gray-50 dark:bg-gray-850 border-t border-gray-800 rounded-md;
}

.table-row:last-child {
  @apply border-b border-gray-800 rounded-md;
}

.table-row-title {
  @apply flex items-center py-3 px-4 flex-1;
}

.table-row-value {
  @apply flex py-3 px-4 items-center;

  word-break: break-all;
  flex: 2;
}
</style>
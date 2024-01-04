<script lang="ts" setup>
import useNetwork from '@/composables/useNetwork';
import { buildNetworkIconURL } from '@/lib/utils/urls';
import { configService } from '@/services/config/config.service';
import { computed } from 'vue';

const { networkId, networkSlug } = useNetwork();

const label = computed((): string => {
  return `Bridge assets to ${configService.network.chainName}`;
});
</script>

<template>
  <router-link
    :to="{ name: 'bridge', params: { networkSlug } }"
    class="flex items-center p-4 text-sm dark:bg-gray-850 rounded-lg border dark:border-0"
  >
    <img
      :src="buildNetworkIconURL(networkId)"
      :alt="label"
      class="mr-4 w-6 h-6"
    />
    {{ label }}
    <BalIcon
      name="repeat"
      size="sm"
      class="ml-2 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
    />
  </router-link>
</template>

<script lang="ts" setup>
import ValueDetails from '@/components/info/ValueDetails.vue';
import { useRouter } from 'vue-router';

type Props = {
  tvl: number;
  fees: number;
  vol: number;
};

const router = useRouter();

defineProps<Props>();
</script>

<template>
  <div class="py-1 px-1 pl-4 bg-primary-600 rounded-2xl">
    <ValueDetails
      label="TVL"
      :value="tvl"
      addSeparator
      currencyFormatter="usd_m"
    />
    <ValueDetails
      label="Fees"
      :value="fees"
      addSeparator
      currencyFormatter="usd_lg"
    />
    <ValueDetails label="Vol(24h)" :value="vol" currencyFormatter="usd_m" />
    <BalBtn
      class="p-5 ml-4 !font-semibold"
      color="blue"
      rounded
      size="sm"
      @click="() => router.push('/portfolio')"
      >{{ $t('landing.enterApp') }}</BalBtn
    >
  </div>
</template>
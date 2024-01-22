<script lang="ts" setup>
import ValueDetails from '@/components/info/ValueDetails.vue';

type Props = {
  tvl: number;
  fees: number;
  vol: number;
  desktop: boolean;
};

defineProps<Props>();
</script>

<template>
  <div class="flex py-1 px-4 ml-auto bg-primary-600 rounded-2xl w-fit">
    <div class="flex flex-row">
      <ValueDetails
        :label="$t('landing.hero.tvl')"
        :value="tvl"
        addSeparator
        currencyFormatter="usd_m"
      />
      <ValueDetails
        :label="$t('landing.hero.fees')"
        :value="fees"
        addSeparator
        currencyFormatter="usd_lg"
      />
      <ValueDetails
        :label="$t('landing.hero.vol')"
        :value="vol"
        currencyFormatter="usd_m"
      />
    </div>
  </div>
</template>
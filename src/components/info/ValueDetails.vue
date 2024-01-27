<script lang="ts" setup>
import useNumbers, { Preset, PresetFormats } from '@/composables/useNumbers';
import numeral from 'numeral';

type Props = {
  label: string;
  value: number;
  currencyFormatter: Preset;
  addSeparator?: boolean;
};

const { fNum } = useNumbers();

defineProps<Props>();
</script>

<template>
  <div
    v-if="value > 10"
    class="flex flex-col xl:flex-row place-items-center px-2"
  >
    <span class="pr-1 font-semibold text-white h-fit">{{ label }}</span>
    <span class="font-semibold text-blue-700 text-md h-fit">{{
      numeral(fNum(value)).format(PresetFormats[currencyFormatter])
    }}</span>
  </div>
</template>
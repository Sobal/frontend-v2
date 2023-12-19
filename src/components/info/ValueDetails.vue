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
  <span class="pr-1 font-semibold text-white">{{ label }}&nbsp;</span>
  <span class="font-semibold text-blue-700 text-md">{{
    numeral(fNum(value)).format(PresetFormats[currencyFormatter])
  }}</span>
  <span v-if="addSeparator" class="m-2 text-sm text-primary-50">|</span>
</template>
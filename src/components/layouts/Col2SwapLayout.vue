<script lang="ts" setup>
import useBreakpoints from '@/composables/useBreakpoints';

type Gap = '4' | '8';
type MaxWidth = '3xl' | '7xl' | '1920px' | '2560px';
type ColSpan = '3' | '4' | '5' | '6' | '7' | '8' | '9';
type Cols = '12';
type Props = {
  cols?: Cols;
  gap?: Gap;
  leftSpan?: ColSpan;
  rightSpan?: ColSpan;
  maxWidth?: MaxWidth;
};
withDefaults(defineProps<Props>(), {
  cols: '12',
  gap: '8',
  leftSpan: '5',
  rightSpan: '7',
  maxWidth: '7xl',
});
const totalColsClasses = computed(
  (): Record<Cols, string> => ({
    '12': 'lg:grid-cols-12',
  })
);
const gapClasses = computed(
  (): Record<Gap, string> => ({
    '4': 'lg:gap-x-4 gap-y-4',
    '8': 'lg:gap-x-8 gap-y-8',
  })
);
const maxWidthClasses = computed(
  (): Record<MaxWidth, string> => ({
    '3xl': 'max-w-3xl',
    '7xl': 'max-w-7xl',
    '1920px': 'max-w-[1920px]',
    '2560px': 'max-w-[2560px]',
  })
);
const colSpanClasses = computed(
  (): Record<ColSpan, string> => ({
    '3': 'col-span-3',
    '4': 'col-span-4',
    '5': 'col-span-5',
    '6': 'col-span-6',
    '7': 'col-span-7',
    '8': 'col-span-8',
    '9': 'col-span-9',
  })
);

const { bp } = useBreakpoints();
</script>

<template>
  <div
    :class="`px-4 mx-auto ${
      maxWidthClasses[
        bp === '3xl' ? '1920px' : bp === '4xl' ? '2560px' : maxWidth
      ]
    }`"
  >
    <div
      :class="`grid grid-cols-1 ${totalColsClasses[cols]} gap-x-0 ${gapClasses[gap]}}`"
    >
      <div
        :class="
          colSpanClasses[bp === '3xl' ? '4' : bp === '4xl' ? '3' : leftSpan]
        "
      >
        <slot name="left" />
      </div>

      <div
        :class="
          colSpanClasses[bp === '3xl' ? '8' : bp === '4xl' ? '9' : rightSpan]
        "
      >
        <slot name="right" />
      </div>

      <slot />
    </div>
  </div>
</template>

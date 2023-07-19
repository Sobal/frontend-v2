<script lang="ts" setup>
import useDarkMode from '@/composables/useDarkMode';
import useTailwind from '@/composables/useTailwind';

/**
 * TYPES
 */
type Props = {
  forceDark?: boolean;
};

/**
 * PROPS & EMITS
 */
const props = withDefaults(defineProps<Props>(), {
  forceDark: false,
});

/**
 * COMPOSABLES
 */
const { darkMode } = useDarkMode();
const tailwind = useTailwind();

/**
 * COMPUTED
 */
const fillColor = computed(() => {
  if (props.forceDark) return tailwind.theme.colors.white;

  return darkMode.value
    ? tailwind.theme.colors.white
    : tailwind.theme.colors.gray['900'];
});
</script>

<template>
  <div class="flex items-center sm:mr-4 app-logo">
    <svg
      id="logo"
      width="69"
      height="20"
      viewBox="0 0 69 20"
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby="logoTitle logoDesc"
      role="img"
      class="logo-svg"
    >
      <title id="logoTitle">Sobal Home</title>
      <desc id="logoDesc">Sobal Home</desc>
      <g :fill="fillColor" fill-rule="nonzero" class="svg-path">
        <path
          d="M64.79 0V19.6176H68.8025V0H64.79ZM21.906 4.67085C17.6803 4.67085 14.2445 8.10031 14.2445 12.3323C14.2445 16.5643 17.674 19.9937 21.906 19.9937C26.1379 19.9937 29.5674 16.5643 29.5674 12.3323C29.5674 8.10031 26.1379 4.67085 21.906 4.67085ZM21.906 16.3762C19.6677 16.3762 17.8558 14.5643 17.8558 12.326C17.8558 10.0878 19.6677 8.27586 21.906 8.27586C24.1505 8.27586 25.9624 10.0878 25.9624 12.326C25.9624 14.5643 24.1505 16.3762 21.906 16.3762ZM59.3981 5.04075V5.83072C58.2257 5.09718 56.8338 4.67085 55.348 4.67085C53.2038 4.67085 51.2664 5.54859 49.8746 6.96552L41.8244 15.1661C41.0909 15.9185 40.0627 16.3762 38.9342 16.3762C36.6959 16.3762 34.884 14.5643 34.884 12.326C34.884 10.0878 36.7022 8.27586 38.9342 8.27586C40.069 8.27586 41.0909 8.73981 41.8244 9.48589L43.3103 11.0031L45.837 8.42633L44.4013 6.96552C43.0094 5.54859 41.0721 4.67085 38.9279 4.67085C37.442 4.67085 36.0564 5.09718 34.8777 5.83072V0.00626806H30.9028V19.6238H34.8777V18.8339C36.0564 19.5674 37.4483 20 38.9279 20C41.0721 20 43.0094 19.116 44.4013 17.7053L52.4514 9.48589C53.1849 8.73354 54.2132 8.27586 55.3417 8.27586C57.5799 8.27586 59.3918 10.0878 59.3918 12.326C59.3918 14.5643 57.5799 16.3824 55.3417 16.3824C54.2069 16.3824 53.1849 15.9122 52.4514 15.1661L50.9718 13.6552L48.4451 16.232L49.8746 17.6928C51.2664 19.1097 53.2038 19.9875 55.348 19.9875C56.8338 19.9875 58.2257 19.5611 59.3981 18.8213V19.6113H63.3793V5.04075H59.3981ZM4.29467 9.04702C4.29467 8.13793 5.24138 7.76176 6.38872 7.76176C8.16301 7.76176 8.59561 8.56426 8.65204 9.61755H12.627C12.4013 6.67711 10.0502 4.75235 6.32602 4.75235C2.60815 4.75235 0.257052 6.84012 0.257052 9.5047C0.257052 15.6865 8.93417 13.047 8.93417 15.6301C8.93417 16.326 8.24451 17.0094 6.75862 17.0094C4.63949 16.9781 4.03762 15.8934 4.03762 15.0031H0C0.0815047 17.8119 2.54545 19.8997 6.55172 19.8997C10.2508 19.8997 13.1724 18.4389 13.1724 14.9342C13.1724 9.3605 4.29467 11.6803 4.29467 9.04702Z"
        />
      </g>
      <defs>
        <clipPath id="clip0_1_2">
          <rect width="69" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  </div>
</template>

<style scoped>
.app-logo :deep(.logotype) {
  @apply origin-top-left relative;

  transform: scale(1.1);
}

.svg-path {
  transition: fill 0.2s ease-out;
}

.logo-svg:hover .svg-path {
  fill: theme('colors.purple.700');
}

.dark .logo-svg:hover .svg-path {
  fill: theme('colors.yellow.500');
}
</style>

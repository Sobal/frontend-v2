<script lang="ts" setup>
import { computed } from 'vue';
import useNetwork from '@/composables/useNetwork';

type Props = {
  active: boolean;
  to: string;
};

const props = withDefaults(defineProps<Props>(), {
  active: false,
});

const classes = computed(() => ({
  'border-white dark:border-gray-900': !props.active,
  'border-blue-600 dark:border-blue-400 text-blue-700 dark:text-blue-400':
    props.active,
}));

const { networkSlug } = useNetwork();
</script>
<template>
  <router-link
    :to="{ name: props.to, params: { networkSlug } }"
    :class="['desktop-landing-link-item', classes]"
  >
    <slot />
  </router-link>
</template>

<style scoped>
.desktop-landing-link-item {
  @apply h-full flex-col justify-center cursor-pointer hover:text-purple-600 dark:hover:text-blue-600 flex relative pt-1
  overflow-hidden p-0 transition-all
  ease-in-out duration-500 font-bold;
}

.desktop-landing-link-item::before {
  content: '';

  @apply top-0 left-0 w-full block absolute overflow-hidden transition-all;

  border-top: 4px solid theme('colors.purple.600');
  transform: translate3d(0%, -101%, 0);
}

.dark .desktop-landing-link-item::before {
  border-color: theme('colors.blue.600');
}

.desktop-landing-link-item.router-link-active::before {
  content: '';
  border-color: theme('colors.blue.600');

  @apply w-full block absolute top-0 left-0;

  transform: translate3d(0, 0, 0);
}

.dark .desktop-landing-link-item.router-link-active::before {
  content: '';
  border-color: theme('colors.blue.400');
}

.desktop-landing-link-item.router-link-active:hover::before {
  border-color: theme('colors.blue.700');
}

.dark .desktop-landing-link-item.router-link-active:hover::before {
  border-color: theme('colors.blue.300');
}

.desktop-landing-link-item.router-link-active {
  @apply text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors;
}

.desktop-landing-link-item:hover::before {
  transform: translate3d(0, 0, 0);
}
</style>

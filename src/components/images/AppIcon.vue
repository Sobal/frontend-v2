<script lang="ts" setup>
import { computed } from 'vue';

import useDarkMode from '@/composables/useDarkMode';

/**
 * TYPES
 */
type Props = {
  forceDark?: boolean;
  landing?: boolean;
};

/**
 * PROPS & EMITS
 */
const props = withDefaults(defineProps<Props>(), {
  forceDark: false,
  landing: false,
});

/**
 * COMPOSABLES
 */
const { darkMode } = useDarkMode();

/**
 * COMPUTED
 */
const useDarkLogo = computed(() => (props.forceDark ? true : darkMode.value));
</script>

<template>
  <img
    v-if="useDarkLogo"
    src="~@/assets/images/logo-dark.svg"
    width="30"
    :class="{ 'mr-2': !landing }"
  />
  <img v-else src="~@/assets/images/logo-light.svg" width="30" class="mr-2" />
</template>

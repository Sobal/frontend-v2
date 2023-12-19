<script lang="ts" setup>
import DesktopLandingLinkItem from './DesktopLandingLinkItem.vue';

/**
 * COMPOSABLES
 */
// const route = useRoute();

/**
 * METHODS
 */
// function isActive(page: string): boolean {
//   if (route.name === page) return true;
//   return false;
// }
</script>

<template>
  <div class="desktop-marketing-links">
    <DesktopLandingLinkItem to="/invest-marketing" :active="false">
      {{ $t('marketingNavBar.invest') }}
    </DesktopLandingLinkItem>
    <DesktopLandingLinkItem to="/trade-marketing" :active="false">
      {{ $t('marketingNavBar.trade') }}
    </DesktopLandingLinkItem>
    <DesktopLandingLinkItem to="/stake-marketing" :active="false">
      {{ $t('marketingNavBar.stake') }}
    </DesktopLandingLinkItem>
  </div>
</template>

<style scoped>
.desktop-marketing-links {
  @apply grid gap-6 grid-flow-col grid-rows-1 h-full content-center;
}
</style>

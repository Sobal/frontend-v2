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
  <div class="flex content-center w-full">
    <div class="desktop-marketing-links">
      <DesktopLandingLinkItem to="home" :active="false">
        {{ $t('landingNavBar.invest') }}
      </DesktopLandingLinkItem>
      <DesktopLandingLinkItem to="swap" :active="false">
        {{ $t('landingNavBar.trade') }}
      </DesktopLandingLinkItem>
      <DesktopLandingLinkItem to="portfolio" :active="false">
        {{ $t('landingNavBar.portfolio') }}
      </DesktopLandingLinkItem>
    </div>
  </div>
</template>

<style scoped>
.desktop-marketing-links {
  @apply grid grid-flow-col grid-cols-3 gap-6 mx-auto text-center;
}
</style>

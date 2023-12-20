<script lang="ts" setup>
import AppIcon from '@/components/images/AppIcon.vue';
import useBreakpoints from '@/composables/useBreakpoints';
import useFathom from '@/composables/useFathom';
import AppLogo from '@/components/images/AppLogo.vue';
import DesktopLandingLinks from '@/components/navs/AppNav/DesktopLinks/DesktopLandingLinks.vue';
import InfoBar from '@/components/info/InfoBar.vue';

// TODO: Add Defilamaa feed
const { tvl, fees, vol } = {
  tvl: 1200000,
  fees: 6942,
  vol: 260300000,
};

const { bp, isDesktop } = useBreakpoints();
const { trackGoal, Goals } = useFathom();
</script>

<template>
  <nav id="app-nav-landing" ref="appNavLanding" class="p-4 md:px-6 md:pt-4">
    <div
      class="grid grid-cols-10 grid-flow-col justify-between items-center h-full text-white"
    >
      <div class="col-span-1 sm:col-span-3 lg:col-span-3 2xl:col-span-4">
        <router-link
          :to="{ name: 'landing' }"
          @click="trackGoal(Goals.ClickNavLogo)"
        >
          <AppIcon v-if="['xs', 'sm'].includes(bp)" />
          <AppLogo v-else location="landing" />
        </router-link>
      </div>
      <div class="lg:col-span-4 2xl:col-span-2">
        <DesktopLandingLinks v-if="isDesktop" class="" />
      </div>

      <div class="col-span-9 sm:col-span-7 lg:col-span-3 2xl:col-span-4">
        <InfoBar :fees="fees" :vol="vol" :tvl="tvl" :desktop="isDesktop" />
      </div>
    </div>
  </nav>
</template>

<style scoped>
#app-nav-landing {
  @apply w-full z-30;
  @apply bg-transparent dark:bg-transparent;
  @apply border-b border-transparent;

  transition: all 0.2s ease-in-out;
}
</style>
<script lang="ts" setup>
import AppLogo from '@/components/images/AppLogo.vue';
import DesktopLandingLinks from '@/components/navs/AppNav/DesktopLinks/DesktopLandingLinks.vue';
import useBreakpoints from '@/composables/useBreakpoints';

import mediumLogo from '@/assets/images/landing/thirdPartyLogos/medium_logo_white.svg';
import discordLogo from '@/assets/images/landing/thirdPartyLogos/discord_logo_purple.svg';
import twitterLogo from '@/assets/images/landing/thirdPartyLogos/twitter_logo_blue.svg';

const { isDesktop } = useBreakpoints();
</script>

<template>
  <div class="h-36 background-image">
    <div class="flex flex-row justify-between items-center px-20 pt-16 w-full">
      <AppLogo />
      <DesktopLandingLinks v-if="isDesktop" class="mx-auto text-white" />
      <div class="flex flex-col">
        <h4 class="pb-2 font-bold text-center text-white">
          Join the community
        </h4>
        <div class="flex flex-row gap-x-2">
          <router-link to="">
            <img :src="mediumLogo" class="h-8" />
          </router-link>
          <router-link to="">
            <img :src="discordLogo" class="h-8" />
          </router-link>

          <router-link to="">
            <img :src="twitterLogo" class="h-8" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.background-image {
  background-image: url('/images/backgrounds/landing_footer_background.svg');
}
</style>
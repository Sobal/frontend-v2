<script lang="ts" setup>
import AppLogo from '@/components/images/AppLogo.vue';
import DesktopLandingLinks from '@/components/navs/AppNav/DesktopLinks/DesktopLandingLinks.vue';
import useBreakpoints from '@/composables/useBreakpoints';
import { EXTERNAL_LINKS } from '@/constants/links';

import mediumLogo from '@/assets/images/landing/thirdPartyLogos/medium_logo_white.svg';
import discordLogo from '@/assets/images/landing/thirdPartyLogos/discord_logo_purple.svg';
import twitterLogo from '@/assets/images/landing/thirdPartyLogos/twitter_logo_blue.svg';

const { isDesktop } = useBreakpoints();
</script>

<template>
  <div class="h-36 background-image">
    <div
      class="grid grid-cols-7 grid-flow-col justify-between items-center px-20 pt-16 w-full"
    >
      <div class="col-span-2 lg:col-span-2"><AppLogo /></div>
      <div class="lg:col-span-3">
        <DesktopLandingLinks v-if="isDesktop" class="mx-auto text-white" />
      </div>
      <div class="col-span-5 lg:col-span-2">
        <div class="flex flex-col ml-auto w-fit">
          <h4
            class="pb-2 text-sm sm:text-xl font-bold text-center text-white truncate"
          >
            {{ $t('landingNavBar.joinCommunity') }}
          </h4>
          <div class="flex flex-row gap-x-3 place-content-center">
            <BalLink external :href="EXTERNAL_LINKS.Sobal.Social.Medium">
              <img :src="mediumLogo" class="h-7" />
            </BalLink>

            <BalLink external :href="EXTERNAL_LINKS.Sobal.Social.Discord">
              <img :src="discordLogo" class="h-7" />
            </BalLink>

            <BalLink external :href="EXTERNAL_LINKS.Sobal.Social.Twitter">
              <img :src="twitterLogo" class="h-7" />
            </BalLink>
          </div>
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
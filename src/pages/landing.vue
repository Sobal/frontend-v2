<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import LandingPageHero from '@/components/heros/LandingPageHero.vue';
import LandingInfoCard from '@/components/cards/LandingInfoCard/LandingInfoCard.vue';
import PairPriceGraph from '@/components/cards/PairPriceGraph/PairPriceGraph.vue';

import { useSwapState } from '@/composables/swap/useSwapState';
import useNetwork from '@/composables/useNetwork';

import sobalDiagonal from '@/assets/images/landing/sobal_diagonal.svg';

import bridge2d from '@/assets/images/landing/flatSvgs/bridge_2d.svg';
import swap2d from '@/assets/images/landing/flatSvgs/swap_2d.svg';
import invest2d from '@/assets/images/landing/flatSvgs/invest_2d.svg';

import neonLogo from '@/assets/images/icons/networks/neon.svg';
import baseLogo from '@/assets/images/icons/networks/base.svg';
import gitbookLogo from '@/assets/images/landing/thirdPartyLogos/gitbook_blue.svg';
import balancerLogo from '@/assets/images/landing/thirdPartyLogos/balancer_logo.svg';

import launch3d from '@/assets/images/landing/threeDimensionalSvgs/launch_3d.svg';

import bridge3d from '@/assets/images/landing/threeDimensionalSvgs/bridge_3d.svg';
import pool3d from '@/assets/images/landing/threeDimensionalSvgs/pool_3d.svg';
import buildings3d from '@/assets/images/landing/threeDimensionalSvgs/buildings_3d.svg';

import solanaCoin from '@/assets/images/landing/threeDimensionalSvgs/solana_left_coin.svg';
import neonCoin from '@/assets/images/landing/threeDimensionalSvgs/neon_right_coin.svg';

import { EXTERNAL_LINKS } from '@/constants/links';

import { configService } from '@/services/config/config.service';

type Info = {
  title: string;
  description: string;
  buttonLabel: string;
  svgSrc: string;
  link: string;
};

const { t } = useI18n();
const router = useRouter();
const { networkSlug } = useNetwork();

const { setTokenInAddress, setTokenOutAddress, setInitialized } =
  useSwapState();

onMounted(() => {
  setTokenInAddress(
    configService.network.tokens.FeaturedSwapTokens.input.toLowerCase()
  );
  setTokenOutAddress(
    configService.network.tokens.FeaturedSwapTokens.output.toLowerCase()
  );
  setInitialized(true);

  // setSelectedTokens([]);
});

const infoCards: Info[] = [
  {
    title: t(`landing.pageCard.bridge.title`),
    description: t(`landing.pageCard.bridge.description`),
    buttonLabel: t(`landing.pageCard.bridge.button`),
    svgSrc: bridge2d,
    link: 'bridge',
  },
  {
    title: t(`landing.pageCard.swap.title`),
    description: t(`landing.pageCard.swap.description`),
    buttonLabel: t(`landing.pageCard.swap.button`),
    svgSrc: swap2d,
    link: 'swap',
  },
  {
    title: t(`landing.pageCard.invest.title`),
    description: t(`landing.pageCard.invest.description`),
    buttonLabel: t(`landing.pageCard.invest.button`),
    svgSrc: invest2d,
    link: 'home',
  },
];
</script>

<template>
  <div>
    <LandingPageHero />
    <div class="container flex flex-col content-padded">
      <div
        class="flex flex-row gap-2 items-center self-center place-content-center mt-14 mb-16 w-full"
      >
        <h3 class="mr-2 text-white">Built on</h3>
        <BalLink external :href="EXTERNAL_LINKS.Neon.Home">
          <img :src="neonLogo" class="md:h-[50px] h-[35px]" />
        </BalLink>
        <BalLink external :href="EXTERNAL_LINKS.Base.Home">
          <img :src="baseLogo" class="md:h-[50px] h-[35px]" />
        </BalLink>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-16 lg:gap-y-5">
        <div
          v-for="(
            { title, buttonLabel, description, link, svgSrc }, index
          ) in infoCards"
          :key="index"
        >
          <LandingInfoCard
            class="col-span-1 h-full"
            :title="title"
            :buttonLabel="buttonLabel"
            :description="description"
            :link="link"
            :networkSlug="networkSlug"
            :svgSrc="svgSrc"
          />
        </div>
      </div>
      <div
        class="hidden lg:flex overflow-hidden relative mt-10 bg-blue-600 rounded-2xl"
      >
        <BalImage
          class="z-50 mt-6 ml-7"
          width="760"
          src="/images/screenshots/bridge_screenshot.png"
        />
        <img class="absolute top-0 right-0" :src="sobalDiagonal" />
      </div>
    </div>

    <div class="container content-padded">
      <div
        class="flex flex-col col-span-1 lg:col-span-3 items-center lg:items-start mt-20 lg:mt-32"
      >
        <h1 class="text-center text-white">
          {{ $t('landing.info.discoverEco.title') }}
        </h1>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-8">
        <div
          class="relative col-span-1 lg:col-span-3 p-12 mt-12 bg-primary-600 rounded-2xl"
        >
          <img
            width="250"
            class="hidden lg:block absolute -top-20 right-20"
            :src="bridge3d"
          />
          <div>
            <h2 class="text-white">
              {{ $t('landing.infoCard.bridging.title') }}
            </h2>
            <p class="my-4 max-w-md xl:max-w-xl xl:text-lg text-gray-300">
              {{ $t('landing.infoCard.bridging.description') }}
            </p>

            <router-link
              :to="{ name: 'bridge', params: { networkSlug } }"
              class="self-center w-fit"
            >
              <BalBtn
                :label="$t('landing.infoCard.bridging.button')"
                class="!p-6 !border-purple-700 !border-2 !text-white !bg-gray-800"
                rounded
                size="sm"
                outline
              />
            </router-link>
          </div>
        </div>
        <img
          class="hidden lg:block col-span-1 justify-self-center self-center"
          :src="solanaCoin"
        />
        <BalCard class="col-span-1 !bg-blue-600" secondaryColor>
          <div class="flex flex-col p-8">
            <h2 class="text-center text-black">
              {{ $t('landing.infoCard.swapping.title') }}
            </h2>
            <p class="py-5 xl:text-lg text-center text-gray-900">
              {{ $t('landing.infoCard.swapping.description') }}
            </p>
            <router-link
              :to="{ name: 'swap', params: { networkSlug } }"
              class="self-center w-fit"
            >
              <BalBtn
                class="!text-white !p-6"
                rounded
                :label="$t('landing.infoCard.swapping.button')"
                size="sm"
                color="white"
              />
            </router-link>
          </div>
        </BalCard>
        <img
          class="hidden lg:block col-span-1 justify-self-center self-center"
          :src="neonCoin"
        />
        <BalCard class="overflow-hidden relative col-span-1 lg:col-span-2">
          <div class="flex-grow p-8">
            <h2 class="text-white">
              {{ $t('landing.infoCard.pools.title') }}
            </h2>
            <p
              class="my-3 max-w-sm lg:max-w-xs xl:max-w-sm xl:text-lg text-gray-300"
            >
              {{ $t('landing.infoCard.pools.description') }}
            </p>
            <BalStack horizontal class="pt-2">
              <BalBtn
                :label="$t('landing.infoCard.pools.viewButton')"
                size="sm"
                rounded
                outline
                class="!p-6 !border-purple-700 !border-2 !text-white !bg-gray-800"
                @click="() => router.push('/pools')"
              />
              <router-link
                :to="{ name: 'create-pool', params: { networkSlug } }"
              >
                <BalBtn
                  :label="$t('landing.infoCard.pools.createButton')"
                  size="sm"
                  rounded
                  outline
                  class="!font-bold !text-blue-500 !p-6 !pl-2"
                />
              </router-link>
            </BalStack>
          </div>
          <img
            class="hidden sm:block absolute right-0 bottom-0 xl:w-[298px] w-[230px]"
            :src="pool3d"
          />
        </BalCard>
        <BalCard class="col-span-1 p-0 pt-10" noPad>
          <PairPriceGraph chain="neon" landing height="100" hideTooltip />
        </BalCard>
      </div>
    </div>
    <div class="py-10 px-5 lg:px-0 mt-12 bg-black">
      <div class="container flex flex-col lg:flex-row content-padded">
        <div class="flex-grow">
          <img :src="gitbookLogo" class="mb-2 w-[80px] md:w-[100px]" />
          <h2 class="text-4xl text-white">
            {{ $t('landing.infoCard.learnMore.title') }}
          </h2>
          <p class="mt-4 mb-6 lg:mb-0 lg:max-w-2xl text-lg">
            {{ $t('landing.infoCard.learnMore.description') }}
          </p>
        </div>
        <BalLink
          external
          :href="EXTERNAL_LINKS.Sobal.Docs"
          class="self-center h-min"
          noStyle
        >
          <BalBtn
            :label="$t('landing.readDocs')"
            class="!p-6 !border-pink-700 !border-2 !text-white"
            rounded
            size="sm"
            outline
          />
        </BalLink>
      </div>
    </div>
    <div class="container content-padded">
      <div class="relative p-9 mt-20 xl:mt-56 bg-blue-600 rounded-2xl">
        <div class="flex flex-col my-4">
          <h2 class="text-center text-black">
            {{ $t('landing.infoCard.launchToken.title') }}
          </h2>
          <p
            class="self-center my-5 max-w-md md:max-w-lg text-center text-black"
          >
            {{ $t('landing.infoCard.launchToken.description') }}
          </p>
          <BalBtn
            class="self-center !font-bold !px-14 !p-5 !text-white"
            rounded
            :label="$t('landing.infoCard.launchToken.button')"
            disabled
            size="sm"
          />
        </div>
        <img
          class="hidden sm:block absolute bottom-0 left-0 w-full"
          :src="launch3d"
        />
      </div>
      <div
        class="flex relative flex-col py-14 px-12 mt-10 lg:mt-28 bg-black rounded-2xl"
      >
        <h2 class="text-white">{{ $t('landing.info.builders.title') }}</h2>
        <p class="mt-2 max-w-2xl text-lg text-gray-300">
          {{ $t('landing.info.builders.description') }}
        </p>
        <BalLink
          external
          :href="EXTERNAL_LINKS.Sobal.DevDocs"
          class="pt-5 w-fit"
          noStyle
        >
          <BalBtn
            :label="$t('landing.readDevDocs')"
            class="!p-6 !border-blue-700 !border-2 !text-white"
            rounded
            size="sm"
            outline
          />
        </BalLink>
        <div class="hidden lg:flex absolute right-20 bottom-0 flex-row">
          <div class="flex flex-row self-end mt-2 mb-5">
            <p class="mr-2 text-primary-50">powered by</p>
            <img :src="balancerLogo" />
          </div>
          <img :src="buildings3d" />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  @apply mx-auto;
}

.content-padded {
  @apply lg:px-12 2xl:px-32;
}
</style>
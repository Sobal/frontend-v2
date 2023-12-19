<script lang="ts" setup>
import LandingPageHero from '@/components/heros/LandingPageHero.vue';
import LandingInfoCard from '@/components/cards/LandingInfoCard/LandingInfoCard.vue';
import ThreeCoins from '@/components/images/ThreeCoins.vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import bridge2d from '@/assets/images/landing/flatSvgs/bridge_2d.svg';
import swap2d from '@/assets/images/landing/flatSvgs/swap_2d.svg';
import invest2d from '@/assets/images/landing/flatSvgs/invest_2d.svg';
// import neonLogo from '@/assets/images/icons/networks/neon.svg';
// import baseLogo from '@/assets/images/icons/networks/base.svg';
import sobalDiagonal from '@/assets/images/landing/sobal_diagonal.svg';
import gitbookLogo from '@/assets/images/landing/thirdPartyLogos/gitbook_blue.svg';
import bridge3d from '@/assets/images/landing/threeDimensionalSvgs/bridge_3d.svg';
import solanaCoin from '@/assets/images/landing/threeDimensionalSvgs/solana_left_coin.svg';
import neonCoin from '@/assets/images/landing/threeDimensionalSvgs/neon_right_coin.svg';
import balancerLogo from '@/assets/images/landing/thirdPartyLogos/balancer_logo.svg';
import buildings3d from '@/assets/images/landing/threeDimensionalSvgs/buildings_3d.svg';

type Info = {
  title: string;
  description: string;
  buttonLabel: string;
  svgSrc: string;
  onClick: () => void;
};

const { t } = useI18n();
const router = useRouter();

const infoCards: Info[] = [
  {
    title: 'Bridge',
    description:
      'Bridge your funds directly to Neon and experience all the benefits the Solana and Ethereum ecosystem have to offer in tandem.',
    buttonLabel: 'Bridge now',
    svgSrc: bridge2d,
    onClick: () => router.push('/bridge'),
  },
  {
    title: t(`landing.infoCard.swap.title`),
    description: t(`landing.infoCard.swap.description`),
    buttonLabel: t(`landing.infoCard.swap.button`),
    svgSrc: swap2d,
    onClick: () => router.push('/trade'),
  },
  {
    title: t(`landing.infoCard.invest.title`),
    description: t(`landing.infoCard.invest.description`),
    buttonLabel: t(`landing.infoCard.invest.button`),
    svgSrc: invest2d,
    onClick: () => router.push('/portfolio'),
  },
];
</script>

<template>
  <div>
    <LandingPageHero />
    <div class="container flex flex-col content-padded">
      <!-- <div class="flex flex-row gap-2 items-center self-center my-20">
        <img :src="neonLogo" width="50" />
        <img :src="baseLogo" width="50" />
        <h3 class="ml-4 text-white">Built on Neon</h3>
      </div> -->
      <div
        class="grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-16 lg:gap-y-5 mt-20 lg:mt-32"
      >
        <div
          v-for="(
            { title, buttonLabel, description, onClick, svgSrc }, index
          ) in infoCards"
          :key="index"
        >
          <LandingInfoCard
            class="col-span-1 h-full"
            :title="title"
            :buttonLabel="buttonLabel"
            :description="description"
            :onClick="onClick"
            :svgSrc="svgSrc"
          />
        </div>
      </div>
      <div class="hidden lg:flex relative mt-20 bg-blue-600 rounded-2xl">
        <BalImage
          class="z-50 mt-6 ml-7"
          width="760"
          src="images/screenshots/bridge_screenshot.png"
        />
        <img class="absolute top-0 right-0" :src="sobalDiagonal" />
      </div>
    </div>
    <div class="py-10 mt-36 bg-black">
      <div class="container flex flex-col lg:flex-row content-padded">
        <div class="flex-grow">
          <img class="mb-2" :src="gitbookLogo" />
          <h2 class="text-4xl text-white">
            {{ $t('landing.infoCard.learnMore.title') }}
          </h2>
          <p class="mt-4 mb-6 lg:mb-0 lg:max-w-2xl text-lg">
            {{ $t('landing.infoCard.learnMore.description') }}
          </p>
        </div>
        <BalBtn
          :label="$t('landing.readDocs')"
          class="self-center !p-6 !border-pink-700 !border-2 !text-white"
          rounded
          size="sm"
          outline
        />
      </div>
    </div>
    <div class="container content-padded">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-8">
        <div
          class="relative col-span-1 lg:col-span-3 p-12 mt-36 bg-primary-600 rounded-2xl"
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
            <BalBtn
              :label="$t('landing.infoCard.bridging.button')"
              class="!p-6 !border-purple-700 !border-2 !text-white !bg-gray-800"
              rounded
              size="sm"
              outline
              @click="() => router.push('/bridge')"
            />
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
            <BalBtn
              class="self-center !text-white !p-6"
              rounded
              :label="$t('landing.infoCard.swapping.button')"
              size="sm"
              color="white"
              @click="router.push('/trade')"
            />
          </div>
        </BalCard>
        <img
          class="hidden lg:block col-span-1 justify-self-center self-center"
          :src="neonCoin"
        />
        <BalCard class="col-span-1 lg:col-span-2">
          <div class="flex-grow p-8">
            <h2 class="text-white">
              {{ $t('landing.infoCard.pools.title') }}
            </h2>
            <p class="my-3 max-w-sm xl:text-lg text-gray-300">
              {{ $t('landing.infoCard.pools.description') }}
            </p>
            <BalStack horizontal class="pt-2">
              <BalBtn
                :label="$t('landing.infoCard.pools.viewButton')"
                size="sm"
                rounded
                outline
                class="!p-6 !border-purple-700 !border-2 !text-white !bg-gray-800"
                @click="() => router.push('/')"
              />
              <BalBtn
                :label="$t('landing.infoCard.pools.createButton')"
                size="sm"
                rounded
                outline
                class="!font-bold !text-blue-500 !p-6 !pl-2"
                @click="() => router.push('/')"
              />
            </BalStack>
          </div>
        </BalCard>
        <BalCard class="col-span-1 p-5">
          <h2 class="text-white">
            {{ $t('landing.infoCard.featured.title') }}
          </h2>
          <h2 class="text-white">
            {{ $t('landing.infoCard.featured.subtitle') }}
          </h2>
        </BalCard>
      </div>

      <div class="flex flex-col items-center my-14">
        <h1 class="text-center text-white">
          {{ $t('landing.info.improvingEco.title') }}
        </h1>
        <p class="my-2 max-w-lg text-lg text-center text-gray-300">
          {{ $t('landing.info.improvingEco.description') }}
        </p>
        <ThreeCoins />
      </div>

      <div class="flex relative flex-col py-14 px-12 bg-black rounded-2xl">
        <h2 class="text-white">{{ $t('landing.info.builders.title') }}</h2>
        <p class="mt-2 max-w-2xl text-lg text-gray-300">
          {{ $t('landing.info.builders.description') }}
        </p>
        <div class="hidden lg:flex absolute right-20 bottom-0 flex-row">
          <div class="flex flex-row self-end mt-2 mb-5">
            <p class="mr-2 text-primary-50">powered by</p>
            <img :src="balancerLogo" />
          </div>
          <img :src="buildings3d" />
        </div>
      </div>

      <div class="p-9 mt-20 bg-blue-600 rounded-2xl">
        <div class="flex flex-col my-4">
          <h2 class="text-center text-black">
            {{ $t('landing.infoCard.launchToken.title') }}
          </h2>
          <p class="self-center my-5 max-w-lg text-center text-black">
            {{ $t('landing.infoCard.launchToken.description') }}
          </p>
          <BalBtn
            class="self-center !font-bold !px-14 !p-5 !text-white"
            rounded
            :label="$t('landing.infoCard.launchToken.button')"
            disabled
            size="sm"
            @click="() => router.push('/portfolio')"
          />
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
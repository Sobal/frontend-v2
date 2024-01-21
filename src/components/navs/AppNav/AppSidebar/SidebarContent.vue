<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import AppLogo from '@/components/images/AppLogo.vue';
import { version } from '@/composables/useApp';
import useConfig from '@/composables/useConfig';
import { sleep } from '@/lib/utils';
import useWeb3 from '@/services/web3/useWeb3';
import useNetwork from '@/composables/useNetwork';
import { Goals, trackGoal } from '@/composables/useFathom';
import TwitterIcon from '@/components/_global/icons/brands/TwitterIcon.vue';
import DiscordIcon from '@/components/_global/icons/brands/DiscordIcon.vue';
import MediumIcon from '@/components/_global/icons/brands/MediumIcon.vue';
import GithubIcon from '@/components/_global/icons/brands/GithubIcon.vue';
// import YoutubeIcon from '@/components/_global/icons/brands/YoutubeIcon.vue';
import { configService } from '@/services/config/config.service';
import { EXTERNAL_LINKS } from '@/constants/links';
import { useThirdPartyServices } from '@/composables/useThirdPartyServices';

/**
 * PROPS & EMITS
 */
const emit = defineEmits(['close']);

/**
 * COMPOSABLES
 */
const { blockNumber } = useWeb3();
const { networkConfig } = useConfig();
const { networkSlug } = useNetwork();
const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const { handleThirdPartyModalToggle } = useThirdPartyServices();

const analyticsUrl = computed((): string => {
  return configService.network.analyticsUrl;
});

/**
 * STATE
 */
const blockIcon = ref<HTMLDivElement>();

const navLinks = [
  { label: t('pool'), path: '/pools', goal: Goals.ClickNavPools },
  { label: t('swap'), path: `/${networkSlug}/swap`, goal: Goals.ClickNavSwap },
  {
    label: t('portfolio'),
    path: `/${networkSlug}/portfolio`,
    goal: Goals.ClickNavPortfolio,
  },
  {
    label: t('bridge'),
    path: `/${networkSlug}/bridge`,
    goal: Goals.ClickNavPortfolio,
  },
  // {
  //   label: t('claim'),
  //   path: `/${networkSlug}/claim`,
  //   goal: Goals.ClickNavClaim,
  // },
  // { label: 'veBAL', path: `/${networkSlug}/vebal`, goal: Goals.ClickNavVebal },
];

const navLinksSecondary = [
  {
    label: t('analytics'),
    url: analyticsUrl.value,
  },
];

const ecosystemLinks = [
  { label: t('blog'), url: EXTERNAL_LINKS.Balancer.Social.Medium },
  { label: t('docs'), url: EXTERNAL_LINKS.Balancer.Docs },
  { label: t('governance'), url: EXTERNAL_LINKS.Balancer.Vote },
];

const privacyLinks = [
  { label: t('policies.termsOfUse'), name: 'terms-of-use' },
  { label: t('policies.privacyPolicy'), name: 'privacy-policy' },
  { label: t('policies.cookiesPolicy'), name: 'cookies-policy' },
  { label: t('policies.risks'), name: 'risks' },
  {
    label: t('policies.thirdPartyServices'),
    click: handleThirdPartyModalToggle,
  },
];

const socialLinks = {
  TwitterIcon: {
    component: TwitterIcon,
    url: EXTERNAL_LINKS.Balancer.Social.Twitter,
  },
  DiscordIcon: {
    component: DiscordIcon,
    url: EXTERNAL_LINKS.Balancer.Social.Discord,
  },
  MediumIcon: {
    component: MediumIcon,
    url: EXTERNAL_LINKS.Balancer.Social.Medium,
  },
  GithubIcon: {
    url: EXTERNAL_LINKS.Balancer.Social.Github,
    component: GithubIcon,
  },
  // YoutubeIcon: {
  //   component: YoutubeIcon,
  //   url: '',
  // },
};

/**
 * METHODS
 */
function getSocialComponent(componentName) {
  return socialLinks[componentName].component;
}

async function navTo(path: string, goal: string) {
  trackGoal(goal);
  router.push(path);
  emit('close');
}

function isActive(page: string): boolean {
  if (
    (route.name === 'home' && page.toLowerCase() === 'pool') ||
    route.name === page.toLowerCase()
  )
    return true;
  return false;
}

/**
 * WATCHERS
 */
watch(blockNumber, async () => {
  blockIcon.value?.classList.add('block-change');
  await sleep(300);
  blockIcon.value?.classList.remove('block-change');
});
</script>

<template>
  <div
    class="flex flex-col flex-grow pl-4 w-80 h-full opacity fade-in-delay background-image"
  >
    <div class="flex flex-col justify-center pl-8 my-8 mx-auto h-32">
      <router-link
        :to="{ name: 'landing', params: { networkSlug } }"
        @click="trackGoal(Goals.ClickNavLogo)"
      >
        <AppLogo location="sidebar" forceDark />
      </router-link>
    </div>

    <div class="grid flex-grow content-start text-lg grid-col-1">
      <div
        v-for="link in navLinks"
        :key="link.label"
        class="side-bar-link"
        :class="[
          'mx-3 my-2 rounded side-bar-link bg-gray-900 bg-opacity-70 border-2',
          isActive(link.label) ? 'border-blue-600' : 'border-transparent',
        ]"
        @click="navTo(link.path, link.goal)"
      >
        <div class="flex flex-row py-3">
          <img
            src="~@/assets/images/sidebar/button-icon.svg"
            width="30"
            class="mr-4 grayscale"
            :class="[
              isActive(link.label) ? 'transform: rotate-90 grayscale-0' : '',
            ]"
          /><span>{{ link.label }}</span>
        </div>
      </div>
      <BalLink
        v-for="link in navLinksSecondary"
        :key="link.label"
        class="side-bar-link"
        :class="[
          'mx-3 my-2 rounded side-bar-link bg-gray-900 bg-opacity-70 border-2 border-transparent',
        ]"
        :href="link.url"
        external
        noStyle
      >
        <div class="flex flex-row py-3">
          <img
            src="~@/assets/images/sidebar/button-icon.svg"
            width="30"
            class="mr-4 grayscale"
          /><span
            >{{ link.label
            }}<BalIcon name="arrow-up-right" size="xs" class="ml-1"
          /></span>
        </div>
      </BalLink>
    </div>

    <div class="grid mt-5 text-sm grid-col-1">
      <span class="px-4 pb-1 font-medium text-secondary">Ecosystem</span>
      <BalLink
        v-for="link in ecosystemLinks"
        :key="link.url"
        :href="link.url"
        class="flex items-center side-bar-link"
        external
        noStyle
      >
        {{ link.label }}
        <BalIcon name="arrow-up-right" size="sm" class="ml-1 text-secondary" />
      </BalLink>
    </div>
    <div class="grid mt-5 text-sm grid-col-1">
      <span class="px-4 pb-1 font-medium text-secondary">Privacy</span>
      <p>
        <router-link
          v-for="link in privacyLinks"
          :key="link.name"
          class="flex items-center policy side-bar-link"
          :to="{ name: link.name }"
          @click="link.click"
        >
          {{ link.label }}
          <BalIcon
            name="arrow-up-right"
            size="sm"
            class="ml-1 text-secondary"
          />
        </router-link>
      </p>
    </div>
    <div class="grid grid-rows-1 grid-flow-col auto-cols-min gap-2 px-4 mt-4">
      <BalLink
        v-for="(link, componentName) in socialLinks"
        :key="componentName"
        :href="link.url"
        class="social-link"
        noStyle
        external
      >
        <component :is="getSocialComponent(componentName)" />
      </BalLink>
      <BalLink
        :href="EXTERNAL_LINKS.Balancer.Social.Mail"
        class="social-link"
        noStyle
      >
        <EmailIcon />
      </BalLink>
    </div>

    <div class="px-4 my-6 text-xs">
      <div class="flex items-center">
        <div
          ref="blockIcon"
          class="w-2 h-2 rounded-full bg-lime-500 block-icon"
        />
        <span class="ml-2 text-gray-300">
          {{ networkConfig.name }}: Block {{ blockNumber }}
        </span>
      </div>
      <BalLink
        :href="`https://github.com/sobal/frontend-v2/releases/tag/${version}`"
        class="flex items-center mt-2 text-gray-300"
        external
        noStyle
      >
        App: v{{ version }}
        <BalIcon name="arrow-up-right" size="xs" class="ml-1" />
      </BalLink>
    </div>
  </div>
</template>

<style scoped>
.background-image {
  background-image: linear-gradient(
      to right,
      rgb(255 255 255 / 0%) 20%,
      theme('colors.gray.900')
    ),
    url('/images/backgrounds/side_panel_background.svg');
}

.side-bar-link {
  @apply transition duration-300 p-4 py-0.5 hover:bg-gray-850 hover:hover:border-gray-600 cursor-pointer;
}

.side-bar-btn {
  @apply flex items-center bg-gray-850 hover:bg-gray-800 rounded-lg p-2 cursor-pointer transition;
}

.social-link {
  @apply w-11 h-11 xs:w-12 xs:h-12  rounded-full bg-gray-850 hover:bg-gray-800 flex items-center justify-center
    text-white cursor-pointer;
}

.social-link > svg {
  @apply w-6 h-6;

  fill: white;
}

.block-icon {
  box-shadow: 0 0 3px 2px theme('colors.green.500');
  transition: box-shadow 0.3s ease-in-out;
}

.block-change {
  box-shadow: 0 0 6px 4px theme('colors.green.500');
}
</style>

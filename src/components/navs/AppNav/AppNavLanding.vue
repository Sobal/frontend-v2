<script lang="ts" setup>
import AppIcon from '@/components/images/AppIcon.vue';
import useBreakpoints from '@/composables/useBreakpoints';
import useFathom from '@/composables/useFathom';
import AppLogo from '@/components/images/AppLogo.vue';
import DesktopLandingLinks from '@/components/navs/AppNav/DesktopLinks/DesktopLandingLinks.vue';
import InfoBar from '@/components/info/InfoBar.vue';
import AppNavNetworkSelect from '@/components/navs/AppNav/AppNavNetworkSelect.vue';
import useWeb3 from '@/services/web3/useWeb3';
import { reactive } from 'vue';

const protocolData = reactive({
  initialized: false,
  vol: 0,
  tvl: 0,
  fees: 0,
});

interface tvldata {
  currentChainTvls: { [chain: string]: number };
}

interface volumefeedata {
  total24h: number;
  totalAllTime: number;
  total48hto24h: number;
  total14dto7d: number;
  change_1d: number;
}

const getProtocolFees = async () => {
  const feesApi = 'https://api.llama.fi/summary/fees/sobal?dataType=dailyFees';
  const tvlApi = 'https://api.llama.fi/protocol/sobal';
  const volumeApi =
    'https://api.llama.fi/summary/dexs/sobal?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true&dataType=dailyVolume';

  const responseFees = await fetch(feesApi);
  const responseTvl = await fetch(tvlApi);
  const responseVolume = await fetch(volumeApi);

  if (responseFees.status === 200) {
    const data: volumefeedata = await responseFees.json();
    protocolData.fees = data.total24h;
  }

  if (responseTvl.status === 200) {
    const data: tvldata = await responseTvl.json();
    const tvl = Object.values(data.currentChainTvls).reduce((a, b) => a + b, 0);
    protocolData.tvl = tvl;
  }

  if (responseVolume.status === 200) {
    const data: volumefeedata = await responseVolume.json();
    protocolData.vol = data.total24h;
  }

  protocolData.initialized = true;

  return protocolData;
};

onMounted(async () => {
  await getProtocolFees();
});

const { bp, isDesktop } = useBreakpoints();
const { trackGoal, Goals } = useFathom();
const { connector } = useWeb3();

const hideNetworkSelect = computed(() => connector.value?.id === 'gnosis');
</script>

<template>
  <nav id="app-nav-landing" ref="appNavLanding" class="p-4 md:px-6 md:pt-4">
    <div
      class="grid grid-cols-10 grid-flow-col justify-between items-center h-full text-white"
    >
      <div
        class="flex flex-col xs:flex-row col-span-1 xs:col-span-3 lg:col-span-3 2xl:col-span-4"
      >
        <router-link
          :to="{ name: 'landing' }"
          @click="trackGoal(Goals.ClickNavLogo)"
        >
          <AppIcon v-if="['xs', 'sm'].includes(bp)" landing />
          <AppLogo v-else location="landing" />
        </router-link>
        <AppNavNetworkSelect
          v-if="!hideNetworkSelect"
          hideLabel
          class="w-fit"
          alignMenu="left"
          noPadding
          noBg
        />
      </div>
      <div class="lg:col-span-4 2xl:col-span-2">
        <DesktopLandingLinks v-if="isDesktop" class="" />
      </div>

      <div class="col-span-9 xs:col-span-7 lg:col-span-3 2xl:col-span-4">
        <InfoBar
          v-if="protocolData.initialized"
          :fees="protocolData.fees"
          :vol="protocolData.vol"
          :tvl="protocolData.tvl"
          :desktop="isDesktop"
        />
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
<script setup lang="ts">
type Props = {
  network?: string;
};

/**
 * PROPS & EMITS
 */

const props = withDefaults(defineProps<Props>(), {
  network: '',
});

const featuredLatestArticles = [
  {
    title: 'Adding Liquidity to Sobal on Base',
    description:
      "You might be new to Sobal, so we've made a step by step guide to adding liquidity to Sobal, it's super simple!",
    linkText: 'Learn how in 2 steps',
    imgSrc: '/images/banners/articles/adding-liquidity.svg',
    link: 'https://blog.sobal.fi/guide-adding-liquidity-to-sobal-on-base-642590717ec1',
    forNetwork: 'base',
  },
  {
    title: 'Adding Liquidity to Sobal on Neon',
    description:
      "We wanted to make it easier for our new users, so we've put together a comprehensive guide to adding Liquidity to Sobal including bridging tokens from Solana and adding the Neon RPC to your wallet.",
    linkText: "Let's get started",
    imgSrc: '/images/banners/articles/adding-liquidity.svg',
    link: 'https://blog.sobal.fi/guide-adding-liquidity-to-sobal-d0a0e5b35d7d',
    forNetwork: 'neon-mainnet',
  },
  {
    title: 'Celebrating the launch of Sobal on Neon EVM 🎉',
    description:
      "In order to celebrate the launch of Sobal on Neon EVM, we've allocated 400,000 NEON tokens to incentivize our NEON/USDC and NEON/SOL pools!",
    linkText: 'Read more about the program',
    imgSrc: '/images/banners/articles/neon.svg',
    link: 'https://blog.sobal.fi/celebrating-the-launch-of-sobal-on-neon-evm-14f3be2b668',
    forNetwork: 'neon-mainnet',
  },
];
</script>

<template>
  <div v-once class="featured-protocols">
    <h3 class="mb-4">
      {{ $t('latestArticles') }}
    </h3>
    <div class="grid grid-cols-12 gap-4">
      <template
        v-for="{
          title,
          imgSrc,
          description,
          linkText,
          link,
          forNetwork,
        } in featuredLatestArticles"
        :key="title"
      >
        <div
          v-if="props.network == forNetwork"
          class="col-span-12 xs:col-span-6 lg:col-span-3"
        >
          <BalCard
            :title="title"
            :imgSrc="imgSrc"
            class="hover:shadow-xl transition-shadow"
            hFull
            growContent
          >
            <p class="text-sm leading-5">
              {{ description }}
            </p>
            <template #footer>
              <BalLink :href="link" external>
                <span class="text-sm font-medium">{{ linkText }}</span>
              </BalLink>
              <BalIcon
                name="arrow-up-right"
                size="sm"
                class="relative top-0.5 ml-0.5"
              />
            </template>
          </BalCard>
        </div>
      </template>
    </div>
  </div>
</template>
<style scoped>
:deep(.card-container) {
  justify-content: space-between;
  height: 100%;
}

.featured-protocols :deep(.feature) {
  height: 8rem;
}

.featured-protocols :deep(.content) {
  @apply pt-1;
}
</style>

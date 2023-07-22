<script setup lang="ts">
const featuredIncentivizedArticles = [
  // {
  //   title: 'Celebrating the launch of Sobal on Neon EVM 🎉',
  //   description:
  //     "In order to celebrate the launch of Sobal on Neon EVM, we've partnered up with Neon to incentivize our NEON/USDC and NEON/SOL pools!",
  //   linkText: 'Read more about the program',
  //   imgSrc: '/images/banners/incentivized/neon.svg',
  //   link: 'https://blog.sobal.fi/',
  // },
];
</script>

<template>
  <div v-once class="featured-protocols">
    <h3 class="mb-4">
      {{ $t('incentivizedPrograms') }}
    </h3>
    <div class="grid grid-cols-12 gap-4">
      <div
        v-for="{
          title,
          imgSrc,
          description,
          linkText,
          link,
        } in featuredIncentivizedArticles"
        :key="title"
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

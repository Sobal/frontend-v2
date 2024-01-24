<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { EXTERNAL_LINKS } from '@/constants/links';

const { t } = useI18n();

const featuredProtocols = [
  {
    title: 'Simpool',
    description: t('featuredProtocols.Simpool.description'),
    linkText: t('featuredProtocols.Simpool.linkText'),
    imgSrc: '/images/banners/simpool.png',
    link: EXTERNAL_LINKS.Simpool.Home,
  },
];
</script>

<template>
  <div v-once class="featured-protocols">
    <h3 class="mb-4">
      {{ $t('featuredProtocols.title') }}
    </h3>
    <div class="grid grid-cols-12 gap-4">
      <div
        v-for="{
          title,
          imgSrc,
          description,
          linkText,
          link,
        } in featuredProtocols"
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
              <BalIcon
                name="arrow-up-right"
                size="sm"
                class="relative top-0.5 ml-0.5"
              />
            </BalLink>
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

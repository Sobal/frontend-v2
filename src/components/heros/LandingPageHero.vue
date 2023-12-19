<script lang="ts" setup>
import { useRouter } from 'vue-router';
import hero3d from '@/assets/images/landing/threeDimensionalSvgs/hero_3d.svg';
import gitbook from '@/assets/images/landing/thirdPartyLogos/powered_by_gitbook_gray.svg';

const router = useRouter();
</script>


<template>
  <div class="container flex flex-row justify-between pt-24">
    <div class="hidden lg:flex place-content-center w-full">
      <BalImage class="mr-10 w-[600px] xl:w-[700px]" :src="hero3d" />
    </div>
    <div class="flex flex-col flex-grow">
      <h1
        class="px-2 my-16 text-4xl xl:text-5xl text-center lg:text-left text-white"
      >
        {{ $t('landing.hero.title') }}
      </h1>
      <div
        class="flex flex-row items-start place-content-center lg:place-content-start"
      >
        <BalBtn
          class="mr-6 h-12 xl:h-16 md:text-lg xl:text-2xl !font-semibold xl:!p-8"
          :label="$t('landing.enterApp')"
          tag="button"
          size="lg"
          color="blue"
          rounded
          @click="router.push('/')"
        />
        <div class="flex flex-col">
          <BalBtn
            class="h-12 xl:h-16 md:text-lg xl:text-2xl !text-white !font-semibold xl:!p-8"
            :label="$t('landing.documentation')"
            tag="button"
            size="lg"
            color="white"
            rounded
          />
          <div class="self-center">
            <BalLink external>
              <img class="mt-3" width="170" :src="gitbook" />
            </BalLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

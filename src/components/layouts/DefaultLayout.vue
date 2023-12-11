<script setup lang="ts">
import Footer from '@/components/footer/Footer.vue';
import AppNav from '@/components/navs/AppNav/AppNav.vue';
import SidebarContent from '@/components/navs/AppNav/AppSidebar/SidebarContent.vue';
import { useRouter } from 'vue-router';

const backgroundImageUrl = ref();

function setBackgroundPath(routeName: string): void {
  const backgroundImages = {
    home: 'pool',
    swap: 'swap',
    pool: 'pool',
    portfolio: 'portfolio',
  };

  backgroundImageUrl.value = backgroundImages[routeName]
    ? `background-image: url(/images/backgrounds/${backgroundImages[routeName]}-bg.svg);
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: bottom right;`
    : '';
}

const router = useRouter();

onMounted(async () => {
  await router.isReady();
  setBackgroundPath(router.currentRoute.value.name as string);
});

watch(router.currentRoute, () => {
  setBackgroundPath(router.currentRoute.value.name as string);
});
</script>

<template>
  <div class="app-wrapper">
    <div class="hidden xl:block">
      <SidebarContent />
    </div>
    <div class="app-body-wrapper" :style="backgroundImageUrl">
      <div class="m-2 lg:mx-5 app-body">
        <AppNav />
        <div class="pb-16 m-auto">
          <slot />
        </div>
      </div>
      <div class="footer-body">
        <Footer />
      </div>
    </div>
  </div>
</template>

<style>
.VueQueryDevtoolsPanel + button {
  @apply text-black bg-gray-100 p-2 rounded text-sm;
}

.app-body {
  @apply mb-8;
}

.app-wrapper {
  @apply flex xl:flex-row flex-col place-content-between;

  min-height: calc(100vh);
}

.app-body-wrapper {
  @apply flex flex-col place-content-between flex-grow;
}

.footer-body {
  @apply xl:hidden;
}
</style>

<script setup lang="ts">
import Footer from '@/components/footer/Footer.vue';
import AppNav from '@/components/navs/AppNav/AppNav.vue';
</script>

<template>
  <div class="app-wrapper">
    <div class="app-body">
      <AppNav />
      <div class="pb-16">
        <slot />
      </div>
    </div>
    <Footer />
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
  @apply flex flex-col place-content-between;

  min-height: calc(100vh);
}
</style>

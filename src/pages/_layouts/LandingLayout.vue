<script setup lang="ts">
import AppNavLanding from '@/components/navs/AppNav/AppNavLanding.vue';
import LandingFooter from '@/components/footer/LandingFooter.vue';
</script>

<template>
  <div class="header-background">
    <AppNavLanding />
    <div class="relative landing-app-body">
      <!--      <GradientRadial />-->
      <div class="pb-16">
        <router-view :key="$route.path" />
      </div>
    </div>
    <LandingFooter />
  </div>
</template>

<style>
.VueQueryDevtoolsPanel + button {
  @apply text-black bg-gray-100 p-2 rounded text-sm;
}

.landing-app-body {
  @apply mb-8;

  min-height: calc(100vh - 2rem);
}

.header-background {
  background-image: url('/images/backgrounds/landing_header_background.svg');
  background-repeat: no-repeat;
  background-position: top;
  background-size: 100%;
}
@media (max-width: 1200px) {
  .header-background {
    background-size: 1200px;
  }
}
@media (min-width: 1900px) {
  .header-background {
    background-repeat: repeat-x;
    background-size: 1900px;
  }
}
</style>

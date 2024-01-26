<template>
  <div class="bg-gradient-to-r from-transparent via-gray-800 app-hero">
    <div class="mx-auto w-full max-w-2xl">
      <slot />
    </div>
  </div>
</template>

<style>
.app-hero {
  @apply flex items-center justify-center text-center px-4 rounded-md;

  transition: all 0.3s ease-in-out;
}
</style>
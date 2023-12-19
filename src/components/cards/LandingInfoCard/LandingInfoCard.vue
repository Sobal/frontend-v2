<script lang="ts" setup>
import infoIcon from '@/assets/images/landing/icons/info_icon.svg';

type Props = {
  title: string;
  description: string;
  buttonLabel: string;
  svgSrc: string;
  onClick: () => void;
};

defineProps<Props>();
</script>

<template>
  <div
    class="flex relative flex-col flex-grow p-8 h-full bg-gray-800 rounded-2xl"
  >
    <img
      alt="icon"
      class="absolute -top-6 lg:-top-10 h-[80px] lg:h-[100px]"
      :src="svgSrc"
    />
    <BalImage
      class="self-end mb-2 graphic"
      width="48"
      height="48"
      :src="infoIcon"
      alt="Information Icon"
    />
    <h2 class="pl-2 mb-4 text-white">{{ title }}</h2>
    <p class="flex-grow px-2 mb-6 xl:text-lg text-gray-300">
      {{ description }}
    </p>
    <BalBtn
      class="justify-self-end"
      :label="buttonLabel"
      size="md"
      color="blue"
      rounded
      @click="onClick"
    />
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue';
import { TokenInfo } from '@/types/TokenList';
import useNumbers from '@/composables/useNumbers';
import SelectBridgeTokenModal from '@/components/bridge/SelectBridgeTokenModal.vue';
import { useTokens } from '@/providers/tokens.provider';

type Props = {
  modelValue: string;
  fixed?: boolean;
  weight?: number | string;
  excludedTokens?: string[];
  options?: string[];
  disableInjection?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  fixed: false,
  weight: 0,
  excludedTokens: () => [],
  options: () => [],
  disableInjection: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

/**
 * STATE
 */
const openTokenModal = ref(false);

/**
 * COMPOSABLEs
 */
const { fNum } = useNumbers();
const { getToken } = useTokens();

/**
 * COMPUTED
 */
const hasToken = computed(() => !!props.modelValue);

const token = computed((): TokenInfo | null => {
  if (!hasToken.value) return null;
  return getToken(props.modelValue);
});

/**
 * METHODS
 */
function toggleModal(): void {
  if (!props.fixed) openTokenModal.value = !openTokenModal.value;
}

watchEffect(() => {
  // console.log('TOKENS: ', tokens.value);
});
</script>

<template>
  <div>
    <div
      v-if="hasToken && options.length === 0"
      :class="[
        'token-select-input selected group flex flex-row justify-items-center content-center items-center',
        { selectable: !fixed },
      ]"
      @click="toggleModal"
    >
      <div class="mt-0.5 mr-2">
        <BalAsset :address="token?.address" class="shadow" :isBridge="true" />
      </div>
      <span class="text-base font-medium">
        {{ token?.symbol }}
      </span>
      <span v-if="Number(weight) > 0" class="ml-2 text-secondary">
        {{
          fNum(weight, {
            style: 'percent',
            maximumFractionDigits: 0,
          })
        }}
      </span>
      <BalIcon
        v-if="!fixed"
        name="chevron-down"
        size="sm"
        class="ml-2 text-green-600 group-hover:text-purple-500 dark:text-green-600 dark:group-hover:text-pink-400 transition-colors"
      />
    </div>
    <div
      v-else
      :class="['token-select-input unselected', { selectable: !fixed }]"
      @click="toggleModal"
    >
      <div v-if="!fixed">
        {{ $t('selectToken') }}
      </div>
      <div v-else>{{ $t('selectTokenAbove') }}</div>
      <BalIcon v-if="!fixed" name="chevron-down" size="sm" class="ml-2" />
    </div>
    <teleport to="#modal">
      <SelectBridgeTokenModal
        v-if="openTokenModal"
        :disableInjection="disableInjection"
        @close="openTokenModal = false"
        @select="emit('update:modelValue', $event)"
      />
    </teleport>
  </div>
</template>


<style scoped>
.token-select-input {
  @apply shadow rounded-lg flex items-center h-10 px-2 whitespace-nowrap;
  @apply text-sm;

  font-variation-settings: 'wght' 700;
}

.selectable {
  @apply cursor-pointer hover:shadow-none transition-shadow;
}

.unselected {
  @apply bg-blue-500 dark:bg-gray-700 text-white rounded-lg;
}

.selected {
  @apply bg-gray-50 dark:bg-gray-700 text-black dark:text-white rounded-lg;
}
</style>
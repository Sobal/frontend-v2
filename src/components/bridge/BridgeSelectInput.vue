<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue';
import { TokenInfo } from '@/types/TokenList';
import useNumbers from '@/composables/useNumbers';
import { isSameAddress } from '@/lib/utils';
import SelectBridgeTokenModal from '@/components/bridge/SelectBridgeTokenModal.vue';
import { useBridgeTokens } from '@/composables/useBridgeTokens';

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
const optionTokens = ref<Record<string, TokenInfo>>({});

/**
 * COMPOSABLEs
 */
const { fNum } = useNumbers();
const { getToken, tokens } = useBridgeTokens();

/**
 * COMPUTED
 */
const hasToken = computed(() => !!props.modelValue);

const computedOptions = computed(() => tokens.value);

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
    <BalDropdown
      v-else-if="hasToken && fixed && options.length > 0"
      :options="options"
      minWidth="40"
      @selected="emit('update:modelValue', $event)"
    >
      <template #activator>
        <div class="group token-select-input selected selectable">
          <div class="w-8">
            <BalAsset :address="token?.address" class="shadow" />
          </div>
          <span class="text-base font-medium">
            {{ token?.symbol }}
          </span>
          <!--          <span v-if="Number(weight) > 0" class="ml-2 text-secondary">-->
          <!--            {{-->
          <!--              fNum(weight, {-->
          <!--                style: 'percent',-->
          <!--                maximumFractionDigits: 0,-->
          <!--              })-->
          <!--            }}-->
          <!--          </span>-->
          test
          <BalIcon
            name="chevron-down"
            size="sm"
            class="ml-2 text-blue-500 group-hover:text-purple-500 dark:text-blue-400 dark:group-hover:text-purple-400 transition-colors"
          />
        </div>
      </template>
      <template #option="{ option: address }">
        <div :set="computedOptions" class="flex justify-between items-center">
          <div class="flex items-center">
            <BalAsset
              :address="optionTokens[address]?.address"
              class="shadow"
            />
            <span class="ml-1 font-medium">
              {{ optionTokens[address]?.symbol }}
            </span>
          </div>
          <BalIcon
            v-if="isSameAddress(optionTokens[address].address, modelValue)"
            name="check"
            class="ml-4 text-blue-500 dark:text-blue-400"
          />
        </div>
      </template>
    </BalDropdown>

    <div
      v-else
      :class="['token-select-input unselected', { selectable: !fixed }]"
      @click="toggleModal"
    >
      <div v-if="!fixed">
        {{ $t('selectToken') }}
      </div>
      <div v-else>Select token above</div>
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
  @apply bg-blue-500 dark:bg-gray-600 text-white rounded-xl;
}

.selected {
  @apply bg-gray-50 dark:bg-gray-600 text-black dark:text-white rounded-xl;
}
</style>
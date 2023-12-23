<script lang="ts" setup>
/**
 * TYPES
 */
import { WalletType } from '@/types/wallet';
import WalletInfo from '@/components/bridge/WalletInfo.vue';
import { InputValue } from '@/components/_global/BalTextInput/types';
import { computed, ref, watchEffect } from 'vue';
import { isPositive } from '@/lib/utils/validations';
import useWeb3 from '@/services/web3/useWeb3';
import BridgeSelectInput from '@/components/bridge/BridgeSelectInput.vue';

type Props = {
  name: string;
  bridgeType: 'From' | 'To';
  walletType: WalletType;
  isWalletConnected: boolean;
  amount: InputValue;
  address?: string;
  walletAddress?: string;
  disableToken?: boolean;
};

/**
 * PROPS & EMITS
 */
const props = withDefaults(defineProps<Props>(), {
  fixedToken: false,
  amount: '',
  address: '',
  walletAddress: '',
});

const emit = defineEmits<{
  (e: 'blur', value: string): void;
  (e: 'input', value: string): void;
  (e: 'update:amount', value: string): void;
  (e: 'update:address', value: string): void;
  (e: 'update:isValid', value: boolean): void;
  (e: 'keydown', value: KeyboardEvent);
  (e: 'action:connectWallet'): void;
  (e: 'action:disconnectWallet'): void;
}>();

/**
 * STATE
 */
const _amount = ref<InputValue>('');
const _address = ref<string>('');

const { isWalletReady } = useWeb3();

const hasToken = computed(() => !!_address.value);

const inputRules = computed(() => {
  if (!hasToken.value || !isWalletReady.value) {
    return [isPositive()];
  }

  const rules = [isPositive()];
  // if (!props.ignoreWalletBalance) {
  //   rules.push(isLessThanOrEqualTo(tokenBalance.value, t('exceedsBalance')));
  // }
  return rules;
});

/**
 * CALLBACKS
 */
watchEffect(() => {
  _amount.value = props.amount;
  //TODO: TokenInput doesn't support solana
  _address.value = props.address;
});
</script>

<template>
  <div
    :class="[
      'flex flex-col p-3 bg-gray-500 rounded-2xl',
      isWalletConnected ? 'border-0' : 'border-2 border-red-600',
    ]"
  >
    <div class="flex flex-row mb-3">
      <p class="pr-3 font-bold">{{ bridgeType }}</p>
      <WalletInfo
        :walletType="walletType"
        :isWalletConnected="isWalletConnected"
        :walletAddress="walletAddress"
        @action:connect-wallet="emit('action:connectWallet')"
        @action:disconnect-wallet="emit('action:disconnectWallet')"
      />
    </div>

    <BalTextInput
      v-model="_amount"
      name="bridgeInput"
      placeholder="0.0"
      type="number"
      :decimalLimit="18"
      :rules="inputRules"
      validateOn="input"
      autocomplete="off"
      autocorrect="off"
      :disabled="disableToken"
      step="any"
      v-bind="$attrs"
      bgColor="dark:bg-gray-900"
      @blur="emit('blur', $event)"
      @input="emit('input', $event)"
      @update:model-value="emit('update:amount', $event)"
      @keydown="emit('keydown', $event)"
    >
      <template #append>
        <slot name="tokenSelect">
          <BridgeSelectInput
            v-model="_address"
            :fixed="disableToken"
            class="mr-2"
            @update:model-value="emit('update:address', $event)"
          />
        </slot>
      </template>
    </BalTextInput>
  </div>
</template>
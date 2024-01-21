<script lang="ts" setup>
/**
 * TYPES
 */
import { WalletType, WalletTypes } from '@/types/wallet';
import WalletInfo from '@/components/bridge/WalletInfo.vue';
import { InputValue } from '@/components/_global/BalTextInput/types';
import { computed, ref, watchEffect } from 'vue';
import { isLessThanOrEqualTo, isPositive } from '@/lib/utils/validations';
import useWeb3 from '@/services/web3/useWeb3';
import BridgeSelectInput from '@/components/bridge/BridgeSelectInput.vue';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { useI18n } from 'vue-i18n';
import { useTokens } from '@/providers/tokens.provider';
import { useBridgeTokens } from '@/providers/bridge-tokens.provider';

type Props = {
  name: string;
  bridgeType: 'From' | 'To';
  walletType: WalletType;
  isWalletConnected: boolean;
  amount: InputValue;
  address?: string;
  walletAddress?: string;
  disableToken?: boolean;
  decimalLimit?: number;
  balance?: string;
  symbol?: string;
};

/**
 * PROPS & EMITS
 */
const props = withDefaults(defineProps<Props>(), {
  fixedToken: false,
  amount: '',
  address: '',
  balance: '',
  symbol: '',
  walletAddress: '',
  decimalLimit: 18,
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
const _balance = ref<string>('');
const _balanceFormatted = ref<string>('');
const _symbol = ref<string>('');
const _isMaxed = ref<boolean>(false);

const { isWalletReady } = useWeb3();
const { fNum } = useNumbers();
const { t } = useI18n();
const { dynamicDataLoading, refetchBalances } = useTokens();
const { dynamicDataLoading: solanaDynamicDataLoading, refetchBridgeBalances } =
  useBridgeTokens();

const hasToken = computed(() => !!_address.value);

const maxPercentage = computed(() => {
  if (!_balance.value || !_amount.value) return '0';

  return ((Number(_amount.value) / Number(_balance.value)) * 100).toFixed(2);
});

const barColor = computed(() =>
  _amount.value > _balance.value ? 'red' : 'blue'
);

const inputRules = computed(() => {
  if (!hasToken.value || !isWalletReady.value) {
    return [isPositive()];
  }

  const rules = [isPositive()];

  if (props.bridgeType === 'From') {
    rules.push(isLessThanOrEqualTo(_balance.value, t('exceedsBalance')));
  }

  return rules;
});

const isLoadingBalances = computed(() => {
  if (props.walletType === WalletTypes.Solana) return solanaDynamicDataLoading;

  return dynamicDataLoading;
});

function fetchUpdatedBalance() {
  if (props.walletType === WalletTypes.Solana) return refetchBridgeBalances();

  return refetchBalances();
}

/**
 * CALLBACKS
 */
watchEffect(() => {
  _amount.value = props.amount;
  _address.value = props.address;
  _balance.value = props.balance;
  _symbol.value = props.symbol;
  _isMaxed.value = props.balance === props.amount;
  _balanceFormatted.value = fNum(props.balance, FNumFormats.token);
});
</script>
<template>
  <div
    :class="[
      'flex flex-col p-4 bg-gray-900 rounded-xl relative',
      isWalletConnected ? 'border-0' : 'border-2 border-red-600',
    ]"
  >
    <div class="flex flex-row place-items-center mb-3">
      <p class="pr-5 pl-2 text-xl">{{ bridgeType }}</p>
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
      :decimalLimit="decimalLimit"
      :rules="inputRules"
      validateOn="input"
      autocomplete="off"
      autocorrect="off"
      :disabled="disableToken"
      step="any"
      inputAlignRight
      v-bind="$attrs"
      autoFocus
      @blur="emit('blur', $event)"
      @input="emit('input', $event)"
      @update:model-value="emit('update:amount', $event)"
      @keydown="emit('keydown', $event)"
    >
      <template #prepend>
        <slot name="tokenSelect">
          <BridgeSelectInput
            v-model="_address"
            :fixed="disableToken"
            class="mr-2"
            @update:model-value="emit('update:address', $event)"
          />
        </slot>
      </template>
      <template v-if="isWalletConnected && _address" #footer>
        <div class="text-sm">
          {{ _balanceFormatted }} {{ symbol }}
          <template v-if="Number(balance) > 0 && !disableToken">
            <span
              v-if="!_isMaxed"
              class="text-blue-600 hover:text-purple-600 focus:text-purple-600 dark:text-blue-400 dark:hover:text-yellow-500 dark:focus:text-yellow-500 transition-colors"
              @click="emit('update:amount', _balance)"
            >
              {{ $t('max') }}
            </span>
            <span
              v-else
              class="text-gray-400 dark:text-gray-600 cursor-not-allowed"
            >
              {{ $t('maxed') }}
            </span>
          </template>
          <span
            class="pl-2"
            :class="[
              {
                'cursor-pointer': !isLoadingBalances.value,
                'cursor-not-allowed': isLoadingBalances.value,
                'text-blue-600': !isLoadingBalances.value,
              },
            ]"
            @click="isLoadingBalances.value ? null : fetchUpdatedBalance()"
            ><BalIcon
              name="refresh-cw"
              size="xs"
              :animate="isLoadingBalances.value"
            />
            {{ isLoadingBalances.value ? t('refreshing') : t('refresh') }}</span
          >
        </div>
        <BalProgressBar
          v-if="_balance && !disableToken"
          bufferWidth="0"
          :width="maxPercentage"
          :color="barColor"
          class="mt-2"
        />
      </template>
    </BalTextInput>
  </div>
</template>

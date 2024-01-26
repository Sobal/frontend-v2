<script lang="ts" setup>
import BridgeInput from '@/components/bridge/BridgeInput.vue';
import BridgePairToggle from '@/components/bridge/BridgePairToggle.vue';

import { ref, watchEffect } from 'vue';
import { WalletType, WalletTypes } from '@/types/wallet';

import { useBridgeTokens } from '@/providers/bridge-tokens.provider';
import { overflowProtected } from '@/components/_global/BalTextInput/helpers';
import useBreakpoints from '@/composables/useBreakpoints';
import { networkConfig } from '@/composables/useNetwork';
import { useI18n } from 'vue-i18n';

const { getToken } = useBridgeTokens();
const { bp } = useBreakpoints();
const { t } = useI18n();

/**
 * TYPES
 */
type Props = {
  tokenInAmount: string;
  evmTokenAddress: string;
  solanaTokenAddress: string;
  walletInType: WalletType;
  walletInConnected: boolean;
  walletInAddress: string;
  walletOutType: WalletType;
  walletOutConnected: boolean;
  walletOutAddress: string;
  walletOutSymbol: string;
  walletInSymbol: string;
  walletInBalance: string;
  walletOutBalance: string;
};

/**
 * PROPS & EMITS
 */
const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:tokenInAmount', value: string): void;
  (e: 'update:evmTokenAddress', value: string): void;
  (e: 'update:solanaTokenAddress', value: string): void;
  (e: 'update:walletInType', value: WalletType): void;
  (e: 'update:walletOutType', value: WalletType): void;
  (e: 'update:walletInAddress', value: string): void;
  (e: 'update:walletOutAddress', value: string): void;
  (e: 'update:walletInConnected', value: boolean): void;
  (e: 'update:walletOutConnected', value: boolean): void;
  (e: 'action:connectWallet', value: WalletType): void;
  (e: 'action:disconnectWallet', value: WalletType): void;
  (e: 'update:exactIn', value: boolean): void;
  (e: 'amountChange'): void;
}>();

const _tokenInAmount = ref<string>('');
const _evmTokenAddress = ref<string>('');
const _solanaTokenAddress = ref<string>('');
const _walletInType = ref<WalletType>(WalletTypes.Solana);
const _walletInConnected = ref<boolean>(false);
const _walletOutType = ref<WalletType>(WalletTypes.EVM);
const _walletOutConnected = ref<boolean>(false);
const _walletInAddress = ref<string>('');
const _walletOutAddress = ref<string>('');
const _walletInBalance = ref<string>('');
const _walletOutBalance = ref<string>('');
const _walletInSymbol = ref<string>('');
const _walletOutSymbol = ref<string>('');

/**
 * METHODS
 */
function handleInAmountChange(value: string): void {
  emit('update:exactIn', true);
  emit('update:tokenInAmount', value);
  emit('amountChange');
}

function handleTokenSwitch(): void {
  emit('update:walletInType', _walletOutType.value as WalletType);
  emit('update:walletOutType', _walletInType.value as WalletType);
  emit('update:walletInAddress', _walletOutAddress.value);
  emit('update:walletOutAddress', _walletInAddress.value);
  emit('update:walletInConnected', _walletOutConnected.value);
  emit('update:walletOutConnected', _walletInConnected.value);
  emit('amountChange');
}

async function handleInputTokenChange(newTokenIn: string) {
  emit('update:evmTokenAddress', newTokenIn);

  const tokenInfo = getToken(newTokenIn);
  emit('update:solanaTokenAddress', tokenInfo.address_spl ?? '');

  const updatedInputAmount = overflowProtected(
    _tokenInAmount.value,
    tokenInfo.decimals
  );

  emit('update:tokenInAmount', updatedInputAmount);

  // emit('update:solanaTokenAddress', newTokenIn);
}

async function handleInWalletConnection() {
  emit('action:connectWallet', _walletInType.value);
}

async function handleOutWalletConnection() {
  emit('action:connectWallet', _walletOutType.value);
}

async function handleInWalletDisconnection() {
  emit('action:disconnectWallet', _walletInType.value);
}

async function handleOutWalletDisconnection() {
  emit('action:disconnectWallet', _walletOutType.value);
}

/**
 * CALLBACKS
 */
watchEffect(() => {
  _tokenInAmount.value = props.tokenInAmount;
  _solanaTokenAddress.value = props.solanaTokenAddress;
  _evmTokenAddress.value = props.evmTokenAddress;
  _walletInType.value = props.walletInType;
  _walletOutType.value = props.walletOutType;
  _walletInConnected.value = props.walletInConnected;
  _walletOutConnected.value = props.walletOutConnected;
  _walletInAddress.value = props.walletInAddress;
  _walletOutAddress.value = props.walletOutAddress;
  _walletInBalance.value = props.walletInBalance;
  _walletOutBalance.value = props.walletOutBalance;
  _walletInSymbol.value = props.walletInSymbol;
  _walletOutSymbol.value = props.walletOutSymbol;
});

const tokenDecimals = computed(() =>
  props.evmTokenAddress ? getToken(props.evmTokenAddress).decimals : 18
); // Set default decimals to 18 when no token selected

const swapCardShadow = computed(() => {
  switch (bp.value) {
    case 'xs':
      return 'none';
    case 'sm':
      return 'lg';
    default:
      return 'xl';
  }
});

const title = computed(() => {
  return `${t('bridgeCard.title')} ${
    props.walletInType === WalletTypes.EVM
      ? WalletTypes.Solana
      : networkConfig.chainName
  }`;
});
</script>

<template>
  <BalCard class="relative card-container" :shadow="swapCardShadow" noBorder>
    <template #header>
      <h4>{{ title }}</h4>
    </template>

    <BridgeInput
      name="bridgeIn"
      bridgeType="From"
      :walletType="_walletInType"
      :isWalletConnected="_walletInConnected"
      :amount="_tokenInAmount"
      :decimalLimit="tokenDecimals"
      :address="_evmTokenAddress"
      :walletAddress="_walletInAddress"
      :balance="_walletInBalance"
      :symbol="_walletInSymbol"
      @update:amount="handleInAmountChange"
      @update:address="handleInputTokenChange"
      @action:connect-wallet="handleInWalletConnection"
      @action:disconnect-wallet="handleInWalletDisconnection"
    />
    <div class="flex items-center my-2">
      <div class="mx-2 h-px bg-gray-100 dark:bg-gray-700 grow" />
      <BridgePairToggle gle turnFully @toggle="handleTokenSwitch" />
      <div class="mx-2 h-px bg-gray-100 dark:bg-gray-700 grow" />
    </div>
    <BridgeInput
      name="bridgeOut"
      bridgeType="To"
      :disableToken="true"
      :walletType="_walletOutType"
      :isWalletConnected="_walletOutConnected"
      :amount="_tokenInAmount"
      :decimalLimit="tokenDecimals"
      :address="_evmTokenAddress"
      :walletAddress="_walletOutAddress"
      :balance="_walletOutBalance"
      :symbol="_walletOutSymbol"
      @update:amount="handleInAmountChange"
      @action:connect-wallet="handleOutWalletConnection"
      @action:disconnect-wallet="handleOutWalletDisconnection"
    />
  </BalCard>
</template>
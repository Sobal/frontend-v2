<script lang="ts" setup>
import BridgeInput from '@/components/bridge/BridgeInput.vue';
import BridgePairToggle from '@/components/bridge/BridgePairToggle.vue';

import { ref, watchEffect } from 'vue';
import { WalletType, WalletTypes } from '@/types/wallet';

/**
 * TYPES
 */
type Props = {
  tokenInAmount: string;
  tokenInAddress: string;
  walletInType: WalletType;
  walletInConnected: boolean;
  walletInAddress: string;
  tokenOutAmount: string;
  tokenOutAddress: string;
  walletOutType: WalletType;
  walletOutConnected: boolean;
  walletOutAddress: string;
};

/**
 * PROPS & EMITS
 */
const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:tokenInAmount', value: string): void;
  (e: 'update:tokenInAddress', value: string): void;
  (e: 'update:tokenOutAmount', value: string): void;
  (e: 'update:tokenOutAddress', value: string): void;
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
const _tokenInAddress = ref<string>('');
const _walletInType = ref<WalletType>(WalletTypes.EVM);
const _walletInConnected = ref<boolean>(false);
const _tokenOutAmount = ref<string>('');
const _tokenOutAddress = ref<string>('');
const _walletOutType = ref<WalletType>(WalletTypes.Solana);
const _walletOutConnected = ref<boolean>(false);
const _walletInAddress = ref<string>('');
const _walletOutAddress = ref<string>('');

/**
 * METHODS
 */
function handleInAmountChange(value: string): void {
  emit('update:exactIn', true);
  emit('update:tokenInAmount', value);
  emit('amountChange');
}

function handleOutAmountChange(value: string): void {
  emit('update:exactIn', false);
  emit('update:tokenOutAmount', value);
  emit('amountChange');
}

function handleTokenSwitch(): void {
  emit('update:tokenInAmount', _tokenOutAmount.value);
  emit('update:tokenInAddress', _tokenOutAddress.value);
  emit('update:tokenOutAmount', _tokenInAmount.value);
  emit('update:tokenOutAddress', _tokenInAddress.value);
  emit('update:walletInType', _walletOutType.value as WalletType);
  emit('update:walletOutType', _walletInType.value as WalletType);
  emit('update:walletInAddress', _walletOutAddress.value);
  emit('update:walletOutAddress', _walletInAddress.value);
  emit('update:walletInConnected', _walletOutConnected.value);
  emit('update:walletOutConnected', _walletInConnected.value);
  emit('amountChange');
}

async function handleInputTokenChange(newTokenIn: string) {
  emit('update:tokenInAddress', newTokenIn);
  emit('update:tokenOutAddress', newTokenIn);
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

// async function handleOutputTokenChange(newTokenOut: string) {
//   if (newTokenOut === _tokenInAddress.value) {
//     handleTokenSwitch();
//     return;
//   }
//   emit('update:tokenOutAddress', newTokenOut);
// }
/**
 * CALLBACKS
 */
watchEffect(() => {
  _tokenInAmount.value = props.tokenInAmount;
  _tokenInAddress.value = props.tokenInAddress;
  _tokenOutAmount.value = props.tokenOutAmount;
  _tokenOutAddress.value = props.tokenOutAddress;
  _walletInType.value = props.walletInType;
  _walletOutType.value = props.walletOutType;
  _walletInConnected.value = props.walletInConnected;
  _walletOutConnected.value = props.walletOutConnected;
  _walletInAddress.value = props.walletInAddress;
  _walletOutAddress.value = props.walletOutAddress;
});
</script>

<template>
  <div class="flex flex-col">
    <BridgeInput
      name="bridgeIn"
      bridgeType="From"
      :walletType="_walletInType"
      :isWalletConnected="_walletInConnected"
      :amount="_tokenInAmount"
      :address="_tokenInAddress"
      :walletAddress="_walletInAddress"
      @update:amount="handleInAmountChange"
      @update:address="handleInputTokenChange"
      @action:connect-wallet="handleInWalletConnection"
      @action:disconnect-wallet="handleInWalletDisconnection"
    />
    <div class="flex items-center my-4">
      <BridgePairToggle gle turnFully @toggle="handleTokenSwitch" />
      <div class="flex-grow mx-2 h-px bg-gray-900 dark:bg-gray-900" />
    </div>
    <BridgeInput
      name="bridgeOut"
      bridgeType="To"
      :disableToken="true"
      :walletType="_walletOutType"
      :isWalletConnected="_walletOutConnected"
      :amount="_tokenOutAmount"
      :address="_tokenOutAddress"
      :walletAddress="_walletOutAddress"
      @update:amount="handleOutAmountChange"
      @action:connect-wallet="handleOutWalletConnection"
      @action:disconnect-wallet="handleOutWalletDisconnection"
    />
  </div>
</template>
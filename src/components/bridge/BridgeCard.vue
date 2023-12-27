<script lang="ts" setup>
import BridgePair from '@/components/bridge/BridgePair.vue';
import useWeb3 from '@/services/web3/useWeb3';
import { onBeforeMount, watchEffect } from 'vue';
import useWeb3Solana from '@/services/web3/useWeb3Solana';
import { WalletType, WalletTypes } from '@/types/wallet';
import { useBridgeState } from '@/composables/bridge/useBridgeState';
import TransferPreviewModal from '@/components/bridge/modal/TransferPreviewModal.vue';
import { useBridgeTokens } from '@/providers/bridge-tokens.provider';
import { useTokens } from '@/providers/tokens.provider';

/**
 * STATE
 */
const showPreview = ref(false);

const {
  tokenInAddress,
  tokenOutAddress,
  tokenInAmount,
  tokenOutAmount,
  walletInType,
  walletOutType,
  walletOutConnected,
  walletInConnected,
  walletInAddress,
  walletOutAddress,
  walletInSymbol,
  walletOutSymbol,
  walletInBalance,
  walletOutBalance,
  // setTokenInAddress,
  // setTokenOutAddress,
  // setInitialized,
  setWalletInType,
  setWalletOutType,
  setWalletOutConnected,
  setWalletInConnected,
  setWalletInAddress,
  setWalletOutAddress,
  setWalletInSymbol,
  setWalletOutSymbol,
  setWalletInBalance,
  setWalletOutBalance,
} = useBridgeState();

const {
  isWalletReady,
  startConnectWithInjectedProvider,
  account,
  disconnectWallet,
} = useWeb3();

const {
  toggleSolanaWalletSelectModal,
  isConnected,
  content,
  chosenWallet,
  connect,
  disconnect,
  publicKeyTrimmed,
} = useWeb3Solana();

const { bridgeBalanceFor, getToken } = useBridgeTokens();
const { balanceFor } = useTokens();

const showConnectWalletModal = () => {
  if (chosenWallet.value) connect();
  else if (!isConnected.value) toggleSolanaWalletSelectModal(true);
};

const handleConnectWallet = (walletType: WalletType) => {
  switch (walletType) {
    case WalletTypes.EVM:
      startConnectWithInjectedProvider();
      return;
    case WalletTypes.Solana:
      showConnectWalletModal();
      return;
  }
};

const handleDisconnectWallet = (walletType: WalletType) => {
  switch (walletType) {
    case WalletTypes.EVM:
      disconnectWallet();
      return;
    case WalletTypes.Solana:
      disconnect();
      return;
  }
};

const setConnected = (walletType: WalletType): boolean => {
  return walletType === WalletTypes.EVM
    ? isWalletReady.value
    : isConnected.value;
};

const setAddress = (walletType: WalletType): string => {
  return walletType === WalletTypes.EVM
    ? account.value
    : publicKeyTrimmed.value;
};

const balanceCheck = (): boolean => {
  if (!tokenInAddress.value) return true;
  const tokenBalance =
    walletInType.value === WalletTypes.Solana
      ? bridgeBalanceFor(tokenOutAddress.value, true)
      : balanceFor(tokenInAddress.value);
  return Number(tokenBalance) < Number(tokenInAmount.value);
};

const balance = (walletType: WalletType): string => {
  if (!tokenInAddress.value) return '';
  return walletType === WalletTypes.Solana
    ? bridgeBalanceFor(tokenOutAddress.value, true)
    : balanceFor(tokenInAddress.value);
};

const getSymbol = (): string => {
  if (!tokenInAddress.value) return '';
  return getToken(tokenInAddress.value).symbol;
};

const swapDisabled = computed(() => {
  const walletNotConnected = !isWalletReady && !isConnected;
  const hasAmountsError =
    !tokenInAmount.value || Number(tokenInAmount.value) <= 0;
  const tokenNotSelected = !tokenInAddress.value;
  return (
    walletNotConnected || hasAmountsError || tokenNotSelected || balanceCheck()
  );
});

watchEffect(() => {
  setWalletInAddress(setAddress(walletInType.value));
  setWalletInConnected(setConnected(walletInType.value));
  setWalletOutAddress(setAddress(walletOutType.value));
  setWalletOutConnected(setConnected(walletOutType.value));
  setWalletInSymbol(getSymbol());
  setWalletOutSymbol(getSymbol());
  setWalletInBalance(balance(walletInType.value));
  setWalletOutBalance(balance(walletOutType.value));
});

onBeforeMount(() => {
  setWalletInType(WalletTypes.EVM);
  setWalletOutType(WalletTypes.Solana);
});
</script>



<template>
  <div>
    <div class="flex flex-col">
      <BridgePair
        v-model:tokenInAmount="tokenInAmount"
        v-model:evmTokenAddress="tokenInAddress"
        v-model:tokenOutAmount="tokenOutAmount"
        v-model:solanaTokenAddress="tokenOutAddress"
        v-model:walletInType="walletInType"
        v-model:walletInBalance="walletInBalance"
        v-model:walletOutBalance="walletOutBalance"
        v-model:walletInSymbol="walletInSymbol"
        v-model:walletOutSymbol="walletOutSymbol"
        v-model:walletOutType="walletOutType"
        v-model:walletInConnected="walletInConnected"
        v-model:walletOutConnected="walletOutConnected"
        v-model:walletInAddress="walletInAddress"
        v-model:walletOutAddress="walletOutAddress"
        @action:connect-wallet="handleConnectWallet"
        @action:disconnect-wallet="handleDisconnectWallet"
      />
      <BalBtn
        v-if="!isWalletReady && !isConnected"
        class="mt-5"
        label="Connect Wallets"
        block
        color="gradient"
        @click="startConnectWithInjectedProvider"
      />
      <BalBtn
        v-else-if="!isWalletReady"
        class="mt-5"
        label="Connect Wallet"
        block
        color="gradient"
        @click="startConnectWithInjectedProvider"
      />
      <BalBtn
        v-else-if="!isConnected"
        class="mt-5"
        :label="content"
        block
        color="gradient"
        @click="showConnectWalletModal"
      />
      <BalBtn
        v-else
        :label="$t('preview')"
        :disabled="swapDisabled"
        class="mt-5"
        color="gradient"
        block
        @click="showPreview = true"
      />
    </div>
    <teleport to="#modal">
      <TransferPreviewModal v-if="showPreview" @close="showPreview = false" />
    </teleport>
  </div>
</template>
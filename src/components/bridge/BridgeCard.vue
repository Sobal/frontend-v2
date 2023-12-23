<script lang="ts" setup>
import BridgePair from '@/components/bridge/BridgePair.vue';
import useWeb3 from '@/services/web3/useWeb3';
import { onBeforeMount, watchEffect } from 'vue';
import useWeb3Solana from '@/services/web3/useWeb3Solana';
import { WalletType, WalletTypes } from '@/types/wallet';
import { useBridgeState } from '@/composables/bridge/useBridgeState';

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
  // setTokenInAddress,
  // setTokenOutAddress,
  // setInitialized,
  setWalletInType,
  setWalletOutType,
  setWalletOutConnected,
  setWalletInConnected,
  setWalletInAddress,
  setWalletOutAddress,
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
    : publicKeyTrimmed.value ?? '';
};

watchEffect(() => {
  setWalletInAddress(setAddress(walletInType.value));
  setWalletInConnected(setConnected(walletInType.value));
  setWalletOutAddress(setAddress(walletOutType.value));
  setWalletOutConnected(setConnected(walletOutType.value));
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
        v-model:tokenInAddress="tokenInAddress"
        v-model:tokenOutAmount="tokenOutAmount"
        v-model:tokenOutAddress="tokenOutAddress"
        v-model:walletInType="walletInType"
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
        rounded
        color="green"
        @click="startConnectWithInjectedProvider"
      />
      <BalBtn
        v-else-if="!isWalletReady"
        class="mt-5"
        label="Connect Neon Wallet"
        rounded
        color="green"
        @click="startConnectWithInjectedProvider"
      />
      <BalBtn
        v-else-if="!isConnected"
        class="mt-5"
        :label="content"
        rounded
        color="green"
        @click="showConnectWalletModal"
      />
    </div>
  </div>
</template>
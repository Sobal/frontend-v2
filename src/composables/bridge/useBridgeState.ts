import { reactive, toRefs } from 'vue';
import { WalletType, WalletTypes } from '@/types/wallet';

// globals
const bridgeState = reactive({
  initialized: false,
  tokenInAddress: '',
  tokenOutAddress: '',
  tokenInAmount: '',
  tokenOutAmount: '',
  walletInAddress: '',
  walletOutAddress: '',
  walletInType: WalletTypes.EVM as WalletType,
  walletOutType: WalletTypes.Solana as WalletType,
  walletInConnected: false,
  walletOutConnected: false,
});

function setInitialized(val: boolean) {
  bridgeState.initialized = val;
}

function setTokenInAddress(address: string) {
  bridgeState.tokenInAddress = address;
}
function setTokenOutAddress(address: string) {
  bridgeState.tokenOutAddress = address;
}

function setTokenInAmount(amount: string) {
  bridgeState.tokenInAmount = amount;
}
function setTokenOutAmount(amount: string) {
  bridgeState.tokenOutAmount = amount;
}

function setWalletInType(walletType: WalletType) {
  bridgeState.walletInType = walletType;
}
function setWalletOutType(walletType: WalletType) {
  bridgeState.walletOutType = walletType;
}

function setWalletInConnected(isWalletConnected: boolean) {
  bridgeState.walletInConnected = isWalletConnected;
}

function setWalletOutConnected(isWalletConnected: boolean) {
  bridgeState.walletOutConnected = isWalletConnected;
}

function setWalletInAddress(address: string) {
  bridgeState.walletInAddress = address;
}

function setWalletOutAddress(address: string) {
  bridgeState.walletOutAddress = address;
}
export function useBridgeState() {
  return {
    // can't set to read only refs as these vars are used as
    // model values
    ...toRefs(bridgeState),
    setTokenInAddress,
    setTokenOutAddress,
    setTokenInAmount,
    setTokenOutAmount,
    setWalletInType,
    setWalletOutType,
    setInitialized,
    setWalletInConnected,
    setWalletOutConnected,
    setWalletInAddress,
    setWalletOutAddress,
  };
}

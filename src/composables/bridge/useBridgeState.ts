import { reactive, toRefs } from 'vue';
import { WalletType, WalletTypes } from '@/types/wallet';
import { NeonProgramStatus } from './interfaces/api';
import { NeonProxyRpcApi } from './classes/api';
// globals
const bridgeState = reactive({
  initialized: false,
  tokenInAddress: '',
  tokenOutAddress: '',
  tokenInAmount: '',
  tokenOutAmount: '',
  walletInAddress: '',
  walletOutAddress: '',
  walletInBalance: '',
  walletOutBalance: '',
  walletInSymbol: '',
  walletOutSymbol: '',
  walletInType: WalletTypes.EVM as WalletType,
  walletOutType: WalletTypes.Solana as WalletType,
  walletInConnected: false,
  walletOutConnected: false,
  bridgeApiData: undefined as NeonProgramStatus | undefined,
  bridgeApiLoading: true,
  bridgeApi: undefined as NeonProxyRpcApi | undefined,
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

function setWalletInSymbol(symbol: string) {
  bridgeState.walletInSymbol = symbol;
}

function setWalletOutSymbol(symbol: string) {
  bridgeState.walletOutSymbol = symbol;
}

function setWalletInBalance(balance: string) {
  bridgeState.walletInBalance = balance;
}

function setWalletOutBalance(balance: string) {
  bridgeState.walletOutBalance = balance;
}

function setBridgeApiData(data: NeonProgramStatus | undefined) {
  bridgeState.bridgeApiData = data;
}

function setBridgeApiLoading(val: boolean) {
  bridgeState.bridgeApiLoading = val;
}

function setBridgeApi(api: NeonProxyRpcApi | undefined) {
  bridgeState.bridgeApi = api;
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
    setWalletInSymbol,
    setWalletOutSymbol,
    setWalletInBalance,
    setWalletOutBalance,
    setBridgeApiData,
    setBridgeApiLoading,
    setBridgeApi,
  };
}

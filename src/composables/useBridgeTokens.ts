import { BridgeTokensProviderResponse } from '@/providers/bridge-tokens.provider';
import { BridgeTokensProviderSymbol } from '@/providers/bridge-tokens.provider';
import { inject } from 'vue';

const defaultProviderResponse = {} as BridgeTokensProviderResponse;

export const useBridgeTokens = (): BridgeTokensProviderResponse => {
  return inject(BridgeTokensProviderSymbol, defaultProviderResponse);
};

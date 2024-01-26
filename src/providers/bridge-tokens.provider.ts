import { getAddress, isAddress } from '@ethersproject/address';
import { compact, pick } from 'lodash';
import {
  computed,
  InjectionKey,
  onBeforeMount,
  provide,
  reactive,
  toRefs,
} from 'vue';
import useBridgeBalancesQuery from '@/composables/queries/useBridgeBalancesQuery';
import { TokenPrices } from '@/composables/queries/useTokenPricesQuery';
import useConfig from '@/composables/useConfig';
import symbolKeys from '@/constants/symbol.keys';
import { TOKENS } from '@/constants/tokens';
import {
  bnum,
  getAddressFromPoolId,
  includesAddress,
  isSameAddress,
  selectByAddressFast,
} from '@/lib/utils';
import { safeInject } from '@/providers/inject';
import { UserSettingsResponse } from '@/providers/user-settings.provider';
import { TokenListsResponse } from '@/providers/token-lists.provider';
import { configService } from '@/services/config/config.service';
import { BalanceMap } from '@/services/token/concerns/balances.concern';
import {
  NativeAsset,
  TokenInfo,
  TokenInfoMap,
  TokenListMap,
} from '@/types/TokenList';
import useWeb3 from '@/services/web3/useWeb3';

/**
 * TYPES
 */
export interface TokensProviderState {
  loading: boolean;
  injectedTokens: TokenInfoMap;
  spenders: string[];
  injectedPrices: TokenPrices;
}

/**
 * Provides an interface to all token static and dynamic metadata.
 */
export const tokensProvider = (
  userSettings: UserSettingsResponse,
  tokenLists: TokenListsResponse
) => {
  /**
   * COMPOSABLES
   */
  const { networkConfig } = useConfig();
  const { isWalletReady } = useWeb3();
  const { bridgeTokenListMap } = tokenLists;

  /**
   * STATE
   */
  const queriesEnabled = ref(false);

  const nativeAsset: NativeAsset = {
    ...networkConfig.nativeAsset,
    chainId: networkConfig.chainId,
  };

  const state: TokensProviderState = reactive({
    loading: true,
    injectedTokens: {},
    spenders: compact([
      networkConfig.addresses.vault,
      networkConfig.tokens.Addresses.wstETH,
      configService.network.addresses.veBAL,
    ]),
    injectedPrices: {},
  });

  /**
   * COMPUTED
   */

  /**
   * All tokens from all token lists.
   */
  const allTokenListTokens = computed(
    (): TokenInfoMap => mapTokenListTokens(bridgeTokenListMap.value)
  );

  /**
   * The main tokens map
   * A combination of activated token list tokens
   * and any injected tokens. Static and dynamic
   * meta data should be available for these tokens.
   */
  const tokens = computed(
    (): TokenInfoMap => ({
      [networkConfig.nativeAsset.address]: nativeAsset,
      ...allTokenListTokens.value,
      ...state.injectedTokens,
    })
  );

  const wrappedNativeAsset = computed(
    (): TokenInfo => getToken(TOKENS.Addresses.wNativeAsset)
  );

  /****************************************************************
   * Dynamic metadata
   *
   * The prices, balances and allowances maps provide dynamic
   * metadata for each token in the tokens state array.
   ****************************************************************/

  const {
    data: bridgeBalanceData,
    isSuccess: bridgeBalanceQuerySuccess,
    isInitialLoading: bridgeBalanceQueryLoading,
    isRefetching: bridgeBalanceQueryRefetching,
    isError: bridgeBalancesQueryError,
    refetch: refetchBridgeBalances,
  } = useBridgeBalancesQuery({ tokens, isEnabled: queriesEnabled });

  const balances = computed(
    (): BalanceMap => (bridgeBalanceData.value ? bridgeBalanceData.value : {})
  );

  const onchainDataLoading = computed(
    (): boolean =>
      isWalletReady.value &&
      (bridgeBalanceQueryRefetching.value || bridgeBalanceQueryLoading.value)
  );

  const dynamicDataLoaded = computed(
    (): boolean => bridgeBalanceQuerySuccess.value
  );

  const dynamicDataLoading = computed((): boolean => onchainDataLoading.value);

  /**
   * METHODS
   */
  /**
   * Create token map from a token list tokens array.const isEmpty = Object.keys(person).length === 0;
   */
  function mapTokenListTokens(tokenListMap: TokenListMap): TokenInfoMap {
    const isEmpty = Object.keys(tokenListMap).length === 0;
    if (isEmpty) return {};

    const tokens = [...Object.values(tokenListMap)]
      .map(list => list.tokens)
      .flat();

    const tokensMap = tokens.reduce<TokenInfoMap>((acc, token) => {
      const address: string = getAddress(token.address);

      // Don't include if already included
      if (acc[address]) return acc;

      // Don't include if not on app network
      if (token.chainId !== networkConfig.chainId) return acc;

      acc[address] = token;
      return acc;
    }, {});

    return tokensMap;
  }

  /**
   * Given query, filters tokens map by name, symbol or address.
   * If address is provided, search for address in tokens or injectToken
   */
  async function searchTokens(
    query: string,
    { excluded = [], subset = [] }: { excluded?: string[]; subset?: string[] }
  ): Promise<TokenInfoMap> {
    let tokensToSearch = subset.length > 0 ? getTokens(subset) : tokens.value;
    if (!query) return removeExcluded(tokensToSearch, excluded);

    tokensToSearch =
      subset.length > 0 ? tokensToSearch : allTokenListTokens.value;

    const potentialAddress = getAddressFromPoolId(query);

    if (isAddress(potentialAddress)) {
      const address = getAddress(potentialAddress);
      const token = tokensToSearch[address];
      return { [address]: token };
    } else {
      const tokensArray = Object.entries(tokensToSearch);
      const results = tokensArray.filter(
        ([, token]) =>
          token.name?.toLowerCase().includes(query.toLowerCase()) ||
          token.symbol?.toLowerCase().includes(query.toLowerCase()) ||
          token.address_spl?.toLowerCase().includes(query.toLowerCase())
      );
      return removeExcluded(Object.fromEntries(results), excluded);
    }
  }

  /**
   * Remove excluded tokens from given token map.
   */
  function removeExcluded(
    tokens: TokenInfoMap,
    excluded: string[]
  ): TokenInfoMap {
    return Object.keys(tokens)
      .filter(address => !includesAddress(excluded, address))
      .reduce((result, address) => {
        result[address] = tokens[address];
        return result;
      }, {});
  }

  /**
   * Fetch balance for a token
   */
  function bridgeBalanceFor(address: string, solana?: boolean): string {
    try {
      if (solana) return selectByAddressFast(balances.value, address) || '0';
      return selectByAddressFast(balances.value, getAddress(address)) || '0';
    } catch {
      return '0';
    }
  }

  /**
   * Checks if token has a balance
   */
  function hasBalance(address: string): boolean {
    return (
      Number(selectByAddressFast(balances.value, getAddress(address)) || '0') >
      0
    );
  }

  /**
   * Get subset of tokens from state
   */
  function getTokens(addresses: string[]): TokenInfoMap {
    return pick(tokens.value, addresses.map(getAddress));
  }

  /**
   * Get single token from state
   */
  function getToken(address: string): TokenInfo {
    address = getAddressFromPoolId(address); // In case pool ID has been passed
    return selectByAddressFast(tokens.value, getAddress(address)) as TokenInfo;
  }

  /**
   * Get max balance of token
   * @param tokenAddress
   * @param disableNativeAssetBuffer Optionally disable native asset buffer
   */
  function getMaxBridgeBalanceFor(
    tokenAddress,
    disableNativeAssetBuffer = false
  ): string {
    let maxAmount;
    const tokenBalance = bridgeBalanceFor(tokenAddress) || '0';
    const tokenBalanceBN = bnum(tokenBalance);

    if (tokenAddress === nativeAsset.address && !disableNativeAssetBuffer) {
      // Subtract buffer for gas
      maxAmount = tokenBalanceBN.gt(nativeAsset.minTransactionBuffer)
        ? tokenBalanceBN.minus(nativeAsset.minTransactionBuffer).toString()
        : tokenBalance.toString();
    } else {
      maxAmount = tokenBalance;
    }
    return maxAmount;
  }

  /**
   * Returns true if the token is the native asset or wrapped native asset
   */
  function isWethOrEth(tokenAddress: string): boolean {
    return (
      isSameAddress(tokenAddress, nativeAsset.address) ||
      isSameAddress(tokenAddress, wrappedNativeAsset.value.address)
    );
  }

  /**
   * LIFECYCLE
   */
  onBeforeMount(async () => {
    queriesEnabled.value = true;
    state.loading = false;
  });

  return {
    // state
    ...toRefs(state),
    nativeAsset,
    // computed
    tokens,
    wrappedNativeAsset,
    balances,
    dynamicDataLoaded,
    dynamicDataLoading,
    bridgeBalancesQueryError,
    // methods
    refetchBridgeBalances,
    searchTokens,
    hasBalance,
    bridgeBalanceFor,
    getTokens,
    getToken,
    getMaxBridgeBalanceFor,
    isWethOrEth,
  };
};

export type TokensResponse = ReturnType<typeof tokensProvider>;
export const TokensProviderSymbol: InjectionKey<TokensResponse> = Symbol(
  symbolKeys.Providers.BridgeTokens
);

export function bridgeProvideTokens(
  userSettings: UserSettingsResponse,
  tokenLists: TokenListsResponse
) {
  const tokensResponse = tokensProvider(userSettings, tokenLists);
  provide(TokensProviderSymbol, tokensResponse);
  return tokensResponse;
}

export const useBridgeTokens = (): TokensResponse => {
  return safeInject(TokensProviderSymbol);
};

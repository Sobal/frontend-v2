import {
  computed,
  ComputedRef,
  InjectionKey,
  onBeforeMount,
  provide,
  reactive,
  toRefs,
} from 'vue';
import { TokenInfo, TokenInfoMap, TokenList } from '@/types/TokenList';
import symbolKeys from '@/constants/symbol.keys';
import { useTokenLists } from '@/providers/token-lists.provider';
import useConfig from '@/composables/useConfig';

/**
 * TYPES
 */
export interface BridgeTokensProviderState {
  loading: boolean;
  // injectedTokens: TokenInfoMap;
  // allowanceContracts: string[];
  // injectedPrices: TokenPrices;
}

export interface BridgeTokensProviderResponse {
  // loading: Ref<boolean>;
  tokens: ComputedRef<TokenInfoMap>;
  // injectedTokens: Ref<TokenInfoMap>;
  // injectedPrices: Ref<TokenPrices>;
  // allowanceContracts: Ref<string[]>;
  // nativeAsset: NativeAsset;
  // wrappedNativeAsset: ComputedRef<TokenInfo>;
  // activeTokenListTokens: ComputedRef<TokenInfoMap>;
  // balancerTokenListTokens: ComputedRef<TokenInfoMap>;
  // prices: ComputedRef<TokenPrices>;
  // balances: ComputedRef<BalanceMap>;
  // allowances: ComputedRef<ContractAllowancesMap>;
  // dynamicDataLoaded: ComputedRef<boolean>;
  // dynamicDataLoading: ComputedRef<boolean>;
  // priceQueryError: Ref<boolean>;
  // priceQueryLoading: Ref<boolean>;
  // balancesQueryError: Ref<boolean>;
  // allowancesQueryError: Ref<boolean>;
  // refetchPrices: Ref<() => void>;
  // refetchBalances: Ref<() => void>;
  // refetchAllowances: Ref<() => void>;
  // injectTokens: (addresses: string[]) => Promise<void>;
  // searchTokens: (
  //   query: string,
  //   excluded: string[],
  //   disableInjection?: boolean
  // ) => Promise<TokenInfoMap>;
  // hasBalance: (address: string) => boolean;
  // approvalRequired: (
  //   tokenAddress: string,
  //   amount: string,
  //   contractAddress?: string
  // ) => boolean;
  // approvalsRequired: (
  //   tokenAddresses: string[],
  //   amounts: string[],
  //   contractAddress?: string
  // ) => string[];
  // priceFor: (address: string) => number;
  // balanceFor: (address: string) => string;
  // getTokens: (addresses: string[]) => TokenInfoMap;
  getToken: (address: string) => TokenInfo;
  // injectPrices: (pricesToInject: TokenPrices) => void;
}

/**
 * SETUP
 */
export const BridgeTokensProviderSymbol: InjectionKey<BridgeTokensProviderResponse> =
  Symbol(symbolKeys.Providers.BridgeTokens);

/**
 * BridgeTokensProvider
 * Provides an interface to all token static and dynamic metatdata.
 */

export default {
  name: 'BridgeTokensProvider',

  setup(props, { slots }) {
    /**
     * COMPOSABLES
     */
    const { networkConfig } = useConfig();
    const { bridgeTokenListMap } = useTokenLists();
    // const { currency } = useUserSettings();

    const state: BridgeTokensProviderState = reactive({
      loading: true,
    });

    const bridgeTokenListTokens = computed(
      (): TokenInfoMap =>
        mapTokenListTokens(Object.values(bridgeTokenListMap.value))
    );

    // /**
    //  * All tokens from token lists that are toggled on.
    //  */
    // const activeTokenListTokens = computed(
    //   (): TokenInfoMap =>
    //     mapTokenListTokens(Object.values(activeTokenLists.value))
    // );

    const tokens = computed(
      (): TokenInfoMap => ({
        ...bridgeTokenListTokens.value,
      })
    );

    /**
     * Get single token from state
     */
    function getToken(address: string): TokenInfo {
      return tokens.value[address];
    }

    /**
     * Create token map from a token list tokens array. TODO: Move to util
     */
    function mapTokenListTokens(tokenLists: TokenList[]): TokenInfoMap {
      const tokens = [...tokenLists].map(list => list.tokens).flat();

      const tokensMap = tokens.reduce<TokenInfoMap>((acc, token) => {
        const address: string = token.address;

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
     * LIFECYCLE
     */
    onBeforeMount(async () => {
      state.loading = false;
    });

    provide(BridgeTokensProviderSymbol, {
      // state
      ...toRefs(state),
      // computed
      tokens,
      getToken,
    });

    return () => slots.default();
  },
};

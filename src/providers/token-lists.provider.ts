import { safeInject } from '@/providers/inject';
import { pick } from 'lodash';
import {
  ref,
  computed,
  InjectionKey,
  provide,
  reactive,
  toRefs,
  onBeforeMount,
} from 'vue';

import useNetwork from '@/composables/useNetwork';
import localStorageKeys from '@/constants/local-storage.keys';
import symbolKeys from '@/constants/symbol.keys';
import { lsSet } from '@/lib/utils';
import TokenListService, {
  tokenListService,
} from '@/services/token-list/token-list.service';
import { TokenList, TokenListMap } from '@/types/TokenList';
import testTokenList from '@tests/tokenlists/tokens-5.json';

/** TYPES */
export interface TokenListsState {
  activeListKeys: string[];
}

const { uris } = tokenListService;
const { networkId } = useNetwork();

/**
 * STATE
 */
const state: TokenListsState = reactive({
  activeListKeys: [uris.Balancer.Allowlisted],
});

const allTokenLists = ref({});

const isTestMode = import.meta.env.MODE === 'test';
const tokensListPromise = isTestMode // Return empty promise only in tests (vitest)
  ? Promise.resolve()
  : import(`@/assets/data/tokenlists/tokens-${networkId.value}.json`);

/**
 * All active (toggled) tokenlists
 */
const activeTokenLists = computed(
  (): TokenListMap => pick(allTokenLists.value, state.activeListKeys)
);

/**
 * All allowlisted tokens from tokenlists repo
 */
const balancerTokenList = computed(
  (): TokenList => allTokenLists.value[uris.Balancer.Allowlisted]
);

/**
 * All Balancer token lists mapped by URI.
 */
const balancerTokenLists = computed(
  (): TokenListMap => pick(allTokenLists.value, uris.Balancer.All)
);

/**
 * All NeonPass token lists mapped by URI.
 */

const bridgeTokenListMap = computed(
  (): TokenListMap => pick(allTokenLists.value, uris.Bridge)
);

/**
 * Approved token lists mapped by URI.
 * Approved means tokens are compliant and can be presented in the UI.
 * This excludes lists like the Balancer vetted list.
 */
const approvedTokenLists = computed(
  (): TokenListMap => pick(allTokenLists.value, uris.Approved)
);

/**
 * Adds a token list to the active lists which
 * makes additonal tokens available in the token search modal.
 */
function toggleTokenList(uri: string): void {
  if (!uris.Approved.includes(uri)) return;

  if (state.activeListKeys.includes(uri)) {
    // Deactivate token list
    state.activeListKeys.splice(state.activeListKeys.indexOf(uri), 1);
  } else {
    // Activate token list
    state.activeListKeys.push(uri);
  }

  lsSet(localStorageKeys.TokenLists.Toggled, state.activeListKeys);
}

/**
 * Given a token list URI checks if the related token
 * list has been toggled via the token search modal.
 */
function isActiveList(uri: string): boolean {
  return state.activeListKeys.includes(uri);
}

export const tokenListsProvider = () => {
  if (!isTestMode) {
    onBeforeMount(async () => {
      const module = await tokensListPromise;
      const tokenLists = module.default as TokenListMap;

      // filter token lists by network id
      allTokenLists.value = TokenListService.filterTokensList(
        tokenLists,
        networkId.value
      );
    });
  } else {
    allTokenLists.value = testTokenList;
  }

  return {
    // state
    ...toRefs(state),
    tokensListPromise,
    // computed
    allTokenLists,
    activeTokenLists,
    balancerTokenLists,
    approvedTokenLists,
    balancerTokenList,
    bridgeTokenListMap,
    // methods
    toggleTokenList,
    isActiveList,
  };
};

export type TokenListsResponse = ReturnType<typeof tokenListsProvider>;
export const TokenListsProviderSymbol: InjectionKey<TokenListsResponse> =
  Symbol(symbolKeys.Providers.TokenLists);

export function provideTokenLists(): TokenListsResponse {
  const tokenLists = tokenListsProvider();
  provide(TokenListsProviderSymbol, tokenLists);
  return tokenLists;
}

export const useTokenLists = (): TokenListsResponse => {
  return safeInject(TokenListsProviderSymbol);
};

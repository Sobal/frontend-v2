import { computed, reactive, Ref, ref } from 'vue';
import { useQuery, UseQueryOptions } from '@tanstack/vue-query';

import QUERY_KEYS from '@/constants/queryKeys';
import { BalanceMap } from '@/services/token/concerns/balances.concern';
import BridgeTokenService from '@/services/token/bridge-token.service';
import useWeb3Solana from '@/services/web3/useWeb3Solana';
import { TokenInfoMap } from '@/types/TokenList';

import useNetwork from '../useNetwork';

/**
 * TYPES
 */
type QueryResponse = BalanceMap;
type QueryOptions = UseQueryOptions<QueryResponse>;
interface QueryInputs {
  tokens: Ref<TokenInfoMap>;
  isEnabled?: Ref<boolean>;
}

/**
 * Fetches all balances for provided tokens.
 */
export default function useBalancesQuery({
  tokens,
  isEnabled = ref(true),
}: QueryInputs) {
  /**
   * COMPOSABLES
   */
  const { isConnected, publicKeyTrimmed } = useWeb3Solana();
  const { networkId } = useNetwork();

  /**
   * COMPUTED
   */
  const enabled = computed(() => isConnected.value && isEnabled.value);
  const tokenAddresses = computed(() =>
    Object.keys(tokens.value)
      .filter(token => !!tokens.value[token].address_spl)
      .map(token => tokens.value[token].address_spl)
  );
  const tokenAddressesKey = computed(() => Object.keys(tokens.value));

  /**
   * QUERY INPUTS
   */

  const queryKey = reactive(
    QUERY_KEYS.Account.Balances(networkId, publicKeyTrimmed, tokenAddressesKey)
  );

  const queryFn = async () => {
    console.log('Fetching', tokenAddresses.value.length, 'Bridge balances');
    console.log(tokens.value);
    console.log(tokenAddresses.value);
    return await new BridgeTokenService().balances.get(
      publicKeyTrimmed.value,
      tokenAddresses.value
    );
  };

  const queryOptions = reactive({
    enabled,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  return useQuery<QueryResponse>(
    queryKey,
    queryFn,
    queryOptions as QueryOptions
  );
}

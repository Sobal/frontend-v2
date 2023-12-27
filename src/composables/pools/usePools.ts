import { flatten } from 'lodash';
import { computed, Ref, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import usePoolsQuery from '@/composables/queries/usePoolsQuery';
import { isQueryLoading } from '@/composables/queries/useQueryHelpers';
import { useTokens } from '@/providers/tokens.provider';
import { Pool } from '@/services/pool/types';
import { tokenTreeLeafs } from '../usePoolHelpers';
import useAlerts, { AlertPriority, AlertType } from '@/composables/useAlerts';

export default function usePools(
  filterTokens: Ref<string[]> = ref([]),
  poolsSortField: Ref<string>
) {
  /**
   * COMPOSABLES
   */
  const poolsQuery = usePoolsQuery(
    filterTokens,
    undefined,
    undefined,
    poolsSortField
  );

  const { injectTokens } = useTokens();
  const { t } = useI18n();

  const { addAlert } = useAlerts();

  /**
   * COMPUTED
   */
  const pools = computed<Pool[]>(() => {
    const paginatedPools = poolsQuery.data.value;

    return paginatedPools
      ? flatten(paginatedPools.pages.map(page => page.pools))
      : [];
  });

  const isLoading = computed(() => isQueryLoading(poolsQuery));

  const poolQueryError = computed(() => poolsQuery.isError);

  const poolsHasNextPage = computed(() => poolsQuery.hasNextPage?.value);
  const poolsIsFetchingNextPage = computed(
    () => poolsQuery.isFetchingNextPage?.value
  );

  /**
   * METHODS
   */
  function loadMorePools() {
    poolsQuery.fetchNextPage();
  }

  function refetchPools() {
    poolsQuery.refetch();
  }

  /**
   * WATCHERS
   */
  watch(pools, async newPools => {
    const tokens = flatten(
      newPools.map(pool => [
        ...pool.tokensList,
        ...tokenTreeLeafs(pool.tokens),
        pool.address,
      ])
    );
    await injectTokens(tokens);
  });

  watch(poolQueryError, () => {
    console.log('error?', poolQueryError.value);
    if (poolQueryError.value) {
      addAlert({
        id: 'pools-fetch-error',
        label: t('alerts.pools-fetch-error'),
        type: AlertType.ERROR,
        persistent: true,
        action: refetchPools,
        actionLabel: t('alerts.retry-label'),
        priority: AlertPriority.MEDIUM,
      });
    }
  });

  return {
    pools,
    isLoading,
    poolsHasNextPage,
    poolsIsFetchingNextPage,
    // methods
    loadMorePools,
    refetchPools,
    poolQueryError,
  };
}

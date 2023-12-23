<script setup lang="ts">
import { orderBy } from 'lodash';
import { computed, reactive, toRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import TokenListItem from '@/components/lists/TokenListItem.vue';
import { TokenInfoMap } from '@/types/TokenList';
import { useBridgeTokens } from '@/composables/useBridgeTokens';

interface Props {
  open?: boolean;
}

withDefaults(defineProps<Props>(), {
  open: false,
});

const emit = defineEmits(['close', 'select']);

interface ComponentState {
  loading: boolean;
  query: string;
  results: TokenInfoMap;
}

/**
 * STATE
 */
const state: ComponentState = reactive({
  loading: false,
  query: '',
  results: {},
});

/**
 * COMPOSABLES
 */
const { tokens: neonTokenList } = useBridgeTokens();
const { t } = useI18n();

/**
 * COMPUTED
 */
const title = computed(() => {
  return t('tokenSearch');
});

const tokenLists = computed(() => {
  const query = state.query.toLowerCase();
  const neonTokenListArray = Object.entries(neonTokenList.value);
  const results = neonTokenListArray.filter(([, tokenList]) =>
    tokenList.name.toLowerCase().includes(query)
  );
  return Object.fromEntries(results);
});

const tokens = computed(() => {
  const tokensWithValues = Object.values(state.results).map(token => {
    // const balance = balanceFor(token.address);
    // const price = priceFor(token.address);
    // const value = Number(balance) * price;
    return {
      ...token,
      // price,
      // balance,
      // value,
    };
  });

  return orderBy(tokensWithValues, ['value', 'balance'], ['desc', 'desc']);
});

/**
 * METHODS
 */
async function onSelectToken(token: string): Promise<void> {
  console.log('Select Token: ', token);
  emit('select', token);
  emit('close');
}

function searchTokens(query: string): TokenInfoMap {
  if (!query) return tokenLists.value;

  return tokenLists.value;
  // if (isAddress(query)) {
  //   const address = getAddress(query);
  //   const token = neonTokenList.value[address];
  //   if (token) {
  //     return { [address]: token };
  //   } else {
  //     return { [address]: token };
  //   }
  // } else {
  //   const tokensArray = Object.entries(neonTokenList.value);
  //   const resulsts = tokensArray.filter(
  //     ([, token]) =>
  //       token.name.toLowerCase().includes(query.toLowerCase()) ||
  //       token.symbol.toLowerCase().includes(query.toLowerCase())
  //   );
  // }
}

/**
 * WATCHERS
 */
watch(
  toRef(state, 'query'),
  async newQuery => {
    state.loading = true;
    const searchedTokens = searchTokens(newQuery);
    state.loading = false;
    state.results = searchedTokens;
  },
  { immediate: true }
);
</script>

<template>
  <BalModal show noContentPad @close="$emit('close')">
    <template #header>
      <div class="flex justify-between items-center w-full">
        <div class="flex items-center">
          <h5>{{ title }}</h5>
        </div>
      </div>
    </template>

    <div class="flex border-b dark:border-gray-700">
      <BalTextInput
        v-model="state.query"
        :placeholder="$t('searchBy')"
        class="flex-auto py-3 px-4"
        name="tokenSearchInput"
      />
    </div>
    <div class="overflow-hidden rounded-lg">
      <RecycleScroller
        v-if="tokens.length > 0"
        v-slot="{ item: token }"
        class="overflow-y-scroll h-96"
        :items="tokens"
        :itemSize="64"
        keyField="address"
        :buffer="100"
      >
        <a @click="onSelectToken(token.address)">
          <TokenListItem :token="token" :balanceLoading="false" />
        </a>
      </RecycleScroller>
      <div
        v-else-if="state.loading"
        class="flex justify-center items-center h-96"
      >
        <BalLoadingIcon />
      </div>
      <div
        v-else
        class="p-12 h-96 text-center text-secondary"
        v-text="$t('errorNoTokens')"
      />
    </div>
  </BalModal>
</template>



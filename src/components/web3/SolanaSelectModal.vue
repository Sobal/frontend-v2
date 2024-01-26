<script lang="ts" setup>
import useWeb3Solana from '@/services/web3/useWeb3Solana';
import SolanaWalletButton from '@/components/web3/SolanaWalletButton.vue';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import LS_KEYS from '@/constants/local-storage.keys';

interface Props {
  isVisible?: boolean;
  onShowThirdParty: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  isVisible: false,
});

type AcceptedLocalStorageItemType = '0' | '1' | null;

const emit = defineEmits(['close']);

const { allowedWallets } = useWeb3Solana();

const acceptedlocalStorageItem = localStorage.getItem(
  LS_KEYS.App.TermsAccepted
) as AcceptedLocalStorageItemType;

const accepted = ref<'0' | '1'>(acceptedlocalStorageItem || '0');

const isRulesAccepted = computed(() => accepted.value === '1');

function onRulesAccepted() {
  accepted.value = isRulesAccepted.value ? '0' : '1';
  localStorage.setItem(LS_KEYS.App.TermsAccepted, accepted.value);
}

const stateOrder = {
  [WalletReadyState.Installed]: 0,
  [WalletReadyState.Loadable]: 1,
  [WalletReadyState.NotDetected]: 2,
  [WalletReadyState.Unsupported]: 3,
};

const sortedWallets = allowedWallets.value
  .sort((a, b) => a.adapter.name.localeCompare(b.adapter.name))
  .sort((a, b) => stateOrder[a.readyState] - stateOrder[b.readyState]);
</script>

<template>
  <BalModal
    :title="$t('connectWalletSolana')"
    :show="props.isVisible"
    @close="emit('close')"
  >
    <BalRadio
      :checked="isRulesAccepted"
      value="rules"
      name="rules"
      size="lg"
      @update:model-value="onRulesAccepted"
    >
      <template #label>
        <p class="pb-3 pl-1 -mt-1 mb-2 text-base">
          {{ $t('byConnectingWallet') }}
          <router-link
            :to="{ name: 'terms-of-use' }"
            target="_blank"
            @click.stop=""
          >
            <span className="link">{{ $t('policies.termsOfUse') }} </span>,
          </router-link>
          <router-link :to="{ name: 'risks' }" target="_blank" @click.stop="">
            <span className="link">{{ $t('policies.risks') }} </span>,
          </router-link>
          <router-link
            :to="{ name: 'cookies-policy' }"
            target="_blank"
            @click.stop=""
          >
            <span className="link">
              {{ $t('policies.cookiesPolicy') }}
            </span> </router-link
          >,
          <span>{{ $t('useOf') }}&nbsp;</span>
          <button @click.stop="onShowThirdParty">
            <BalLink>
              <span>{{ $t('policies.thirdPartyServices') }}</span>
            </BalLink>
          </button>
          {{ $t('and') }}
          <router-link
            :to="{ name: 'privacy-policy' }"
            target="_blank"
            @click.stop=""
          >
            <span className="link">{{ $t('policies.privacyPolicy') }} </span>.
          </router-link>
        </p>
      </template>
    </BalRadio>
    <SolanaWalletButton
      v-for="wallet in sortedWallets"
      :key="wallet.adapter.name"
      :wallet="wallet.adapter"
      :walletState="wallet.readyState"
      :class="[
        !isRulesAccepted && 'grayscale pointer-events-none opacity-20',
        'transition-opacity duration-200',
      ]"
    />
  </BalModal>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useBridgeState } from '@/composables/bridge/useBridgeState';
import { configService } from '@/services/config/config.service';
import { buildNetworkIconURL } from '@/lib/utils/urls';
import { WalletType, WalletTypes } from '@/types/wallet';
import { useBridgeTokens } from '@/providers/bridge-tokens.provider';
import solanaLogo from '@/assets/images/landing/thirdPartyLogos/solana_wallet_logo.svg';
import { shorten } from '@/lib/utils';

const {
  tokenInAddress,
  // tokenOutAddress,
  tokenInAmount,
  // tokenOutAmount,
  walletInType,
  // walletOutType,
  // walletOutConnected,
  // walletInConnected,
  walletInAddress,
  walletOutAddress,
  // setTokenInAddress,
  // setTokenOutAddress,
  // // setInitialized,
  // setWalletInType,
  // setWalletOutType,
  // setWalletOutConnected,
  // setWalletInConnected,
  // setWalletInAddress,
  // setWalletOutAddress,
} = useBridgeState();

const { network } = configService;

const { getToken } = useBridgeTokens();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

/**
 * STATE
 */
const withdrawalConfirmed = ref(false);

/**
 * COMPOSABLES
 */
const { t } = useI18n();
const token = getToken(tokenInAddress.value);

/**
 * COMPUTED
 */
const title = computed((): string => t('bridgeModal.title'));

/**
 * METHODS
 */
function handleClose(): void {
  emit('close');
}

const networkIcon = (walletType: WalletType): string => {
  if (walletType === WalletTypes.EVM)
    return buildNetworkIconURL(network.chainId);
  else return solanaLogo;
};
</script>

<template>
  <BalModal show :fireworks="withdrawalConfirmed" @close="handleClose">
    <template #header>
      <div class="flex items-center">
        <BalCircle
          v-if="withdrawalConfirmed"
          size="8"
          color="green"
          class="mr-2 text-white"
        >
          <BalIcon name="check" />
        </BalCircle>
        <h4>
          {{ title }}
        </h4>
      </div>
    </template>
    <BalCard>
      <div class="relative mt-2">
        <div
          class="absolute mx-9 h-1/2 border-b border-gray-500 border-dashed pair-line"
        />
        <div class="flex relative z-10 justify-between">
          <div class="flex flex-row">
            <img
              class="mr-2"
              width="36"
              height="36"
              :src="networkIcon(walletInType)"
            />
            <BalAsset :address="token.address" :size="36" />
          </div>
          <BalIcon
            name="triangle"
            size="xs"
            :filled="true"
            class="rotate-90 text-secondary"
          />
          <img
            class="mr-2"
            width="36"
            height="36"
            :src="networkIcon(walletOutType)"
          />
        </div>
      </div>
      <div class="flex relative z-10 justify-between pt-2 text-sm">
        <div>
          {{ tokenInAmount }}
          <span class="font-semibold">{{ token.symbol }}</span>
        </div>
        <div>
          {{ tokenInAmount }}
          <span class="font-semibold">{{ token.symbol }}</span>
        </div>
      </div>
    </BalCard>
    <BalCard>
      <div>
        {{
          $t('bridgeModal.transferringDetail', [
            tokenInAmount,
            token.symbol,
            walletInType === WalletTypes.EVM ? network.chainName : walletInType,
            walletOutType === WalletTypes.EVM
              ? network.chainName
              : walletOutType,
          ])
        }}
      </div>
    </BalCard>
    <BalCard>
      <div class="flex flex-row justify-between">
        <span class="font-semibold">Source Address:</span>
        <div>
          <img
            class="inline mx-1"
            width="20"
            height="20"
            :src="networkIcon(walletInType)"
          />{{ shorten(walletInAddress)
          }}<BalTooltip width="auto" iconSize="sm" :text="walletInAddress" />
        </div>
      </div>
      <div class="flex flex-row justify-between">
        <span class="font-semibold">Destination Address:</span>
        <div>
          <img
            class="inline mx-1"
            width="20"
            height="20"
            :src="networkIcon(walletOutType)"
          />{{ shorten(walletOutAddress)
          }}<BalTooltip width="auto" iconSize="sm" :text="walletOutAddress" />
        </div>
      </div>
    </BalCard>
  </BalModal>
</template>


<style scoped>
.pair-line {
  width: calc(100% - 72px);
}
</style>
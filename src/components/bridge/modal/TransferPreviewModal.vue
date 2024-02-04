<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useBridgeState } from '@/composables/bridge/useBridgeState';
import { configService } from '@/services/config/config.service';
import { buildNetworkIconURL } from '@/lib/utils/urls';
import { WalletType, WalletTypes } from '@/types/wallet';
import { useTokens } from '@/providers/tokens.provider';
import { useBridgeTokens } from '@/providers/bridge-tokens.provider';
import solanaLogo from '@/assets/images/icons/networks/solana.svg';
import { shorten, sleep } from '@/lib/utils';
import { bridgeToken } from '@/composables/bridge/useBridge';
import useWeb3 from '@/services/web3/useWeb3';
import useWeb3Solana from '@/services/web3/useWeb3Solana';
import BridgeTokenService from '@/services/token/bridge-token.service';
import { captureBalancerException, useErrorMsg } from '@/lib/utils/errors';
import { TransactionActionState } from '@/types/transactions';
import useTransactions, {
  TransactionAction,
} from '@/composables/useTransactions';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';

type Props = {
  walletConnected: boolean;
};

defineProps<Props>();

const {
  tokenInAddress,
  tokenInAmount,
  walletInType,
  walletOutType,
  walletInAddress,
  walletOutAddress,
  bridgeApi,
  bridgeApiData,
  bridgeApiLoading,
  buttonState,
  setButtonState,
} = useBridgeState();

const { network } = configService;
const { getToken, refetchBridgeBalances } = useBridgeTokens();
const { refetchBalances } = useTokens();
const { fNum } = useNumbers();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const defaultActionState: TransactionActionState = {
  init: false,
  confirming: false,
  confirmed: false,
  confirmedAt: '',
};

const actions = ['abc', 'def', 'ghi'];

/**
 * STATE
 */
const withdrawalConfirmed = ref(false);
const currentActionIndex = ref(0);
const primaryActionType: Ref<TransactionAction> = ref('bridgeTokens');

/**
 * COMPOSABLES
 */

const { publicKeyTrimmed, sendTransaction } = useWeb3Solana();
const { account, getProvider, chainId, getSigner } = useWeb3();
const { addTransaction, addNotificationForSolanaTransaction } =
  useTransactions();
const { formatErrorMsg } = useErrorMsg();
const provider = getProvider();
const signer = getSigner();
const { t } = useI18n();
const token = getToken(tokenInAddress.value);
const actionStates = ref<TransactionActionState[]>([]);

const connection = new BridgeTokenService().connection;

/**
 * COMPUTED
 */
const title = computed((): string => t('bridgeModal.title'));
const currentActionState = computed(
  (): TransactionActionState => actionStates.value[currentActionIndex.value]
);

/**
 * METHODS
 */
function handleClose(): void {
  emit('close');
}

/**
 * LIFECYCLE
 */
onBeforeMount(() => {
  actionStates.value = actions.map(() => ({
    ...defaultActionState,
  }));
});

async function handleSubmit(state: TransactionActionState) {
  try {
    state.init = true;
    state.error = null;

    await bridgeToken(
      walletInType.value,
      token,
      Number(tokenInAmount.value),
      account.value,
      provider,
      connection,
      publicKeyTrimmed.value,
      signer,
      Number(chainId.value),
      sendTransaction,
      bridgeApi.value,
      bridgeApiData.value,
      addTransaction,
      addNotificationForSolanaTransaction,
      setButtonState,
      t
    );

    state.init = false;
    state.confirming = false;
    state.confirmed = true;
    state.confirmedAt = new Date().toString();
    setButtonState('');
    handleClose();
    await sleep(3000);
    await refetchBridgeBalances();
    await refetchBalances();
  } catch (error) {
    console.log(error);
    setButtonState('');
    state.init = false;
    state.confirming = false;
    state.error = formatErrorMsg(error);
    captureBalancerException({
      error: (error as Error)?.cause || error,
      action: primaryActionType.value,
      context: { level: 'fatal' },
    });
    await sleep(3000);
    await refetchBridgeBalances();
    await refetchBalances();
  }
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
          {{ fNum(tokenInAmount, FNumFormats.token) }}
          <span class="font-semibold">{{ token.symbol }}</span>
        </div>
        <div>
          {{ fNum(tokenInAmount, FNumFormats.token) }}
          <span class="font-semibold">{{ token.symbol }}</span>
        </div>
      </div>
    </BalCard>
    <BalCard>
      <div>
        {{
          $t('bridgeModal.transferringDetail', [
            fNum(tokenInAmount, FNumFormats.token),
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
      </div> </BalCard
    ><BalAlert
      v-if="currentActionState.error"
      type="error"
      :title="currentActionState?.error?.title"
      :description="currentActionState?.error?.description"
      block
      class="mb-4"
    />
    <BalBtn
      :multiLine="currentActionState.init"
      class="w-full"
      :class="[{ 'h-16': currentActionState.init }]"
      :color="currentActionState.init ? 'blue' : 'gradient'"
      :loading="
        currentActionState.init ||
        currentActionState.confirming ||
        bridgeApiLoading
      "
      :disabled="currentActionState.confirmed || !walletConnected"
      :loadingLabel="
        bridgeApiLoading
          ? 'Loading API...'
          : buttonState
          ? buttonState
          : 'Please wait...'
      "
      @click="handleSubmit(currentActionState)"
      >{{
        !walletConnected
          ? t('walletDisconnected')
          : currentActionState.confirmed
          ? 'Bridging completed'
          : 'Bridge Tokens'
      }}</BalBtn
    >
  </BalModal>
</template>


<style scoped>
.pair-line {
  width: calc(100% - 72px);
}
</style>
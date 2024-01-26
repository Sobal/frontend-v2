<script lang="ts" setup>
import { WalletType, WalletTypes } from '@/types/wallet';
import { shorten } from '@/lib/utils';
import { configService } from '@/services/config/config.service';
import { buildNetworkIconURL } from '@/lib/utils/urls';

import solanaLogo from '@/assets/images/icons/networks/solana.svg';

const { network } = configService;

type Props = {
  walletType: WalletType;
  isWalletConnected: boolean;
  walletAddress: string;
};

/**
 * PROPS & EMITS
 */
defineProps<Props>();

const emit = defineEmits<{
  (e: 'action:connectWallet'): void;
  (e: 'action:disconnectWallet'): void;
}>();
</script>

<template>
  <div>
    <div class="flex flex-row place-items-start w-full">
      <img
        v-if="walletType === WalletTypes.EVM"
        class="mr-2"
        width="25"
        height="25"
        :src="buildNetworkIconURL(network.chainId)"
      />
      <img
        v-else-if="walletType === WalletTypes.Solana"
        class="mr-2"
        width="25"
        height="25"
        :src="solanaLogo"
      />
      <a
        v-if="!isWalletConnected"
        class="font-bold text-green-600 hover:underline"
        @click="emit('action:connectWallet')"
      >
        Connect wallet
      </a>
      <template v-else>
        <div class="leading-tight">
          <div>
            {{
              walletType === WalletTypes.EVM ? network.chainName : walletType
            }}
            ({{ shorten(walletAddress) }})
          </div>
          <a
            class="text-sm font-semibold text-green-600 align-middle"
            @click="emit('action:disconnectWallet')"
            ><span class="hover:underline">{{ $t('disconnect') }}</span>
          </a>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { WalletType, WalletTypes } from '@/types/wallet';
import { shorten } from '@/lib/utils';

import neonLogo from '@/assets/images/landing/thirdPartyLogos/neon_wallet_logo.svg';

import solanaLogo from '@/assets/images/landing/thirdPartyLogos/solana_wallet_logo.svg';

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
    <div class="flex flex-row">
      <img
        v-if="walletType === WalletTypes.EVM"
        class="mr-2"
        width="23"
        height="23"
        :src="neonLogo"
      />
      <img
        v-else-if="walletType === WalletTypes.Solana"
        class="mr-2"
        width="23"
        height="23"
        :src="solanaLogo"
      />
      <a
        v-if="!isWalletConnected"
        class="font-bold text-green-600 hover:underline"
        @click="emit('action:connectWallet')"
      >
        Connect wallet
      </a>
      <p v-else>
        {{ walletType }} ({{ shorten(walletAddress, 6, 6)
        }}<BalTooltip width="auto" iconSize="sm" :text="walletAddress" />)
        <a
          class="font-bold text-green-600 hover:underline"
          @click="emit('action:disconnectWallet')"
          >Disconnect</a
        >
      </p>
    </div>
  </div>
</template>

import { App } from 'vue';
import i18n from '@/plugins/i18n';
import router from '@/plugins/router';
import blocknative from '@/plugins/blocknative';
import VueVirtualScroller from 'vue3-virtual-scroller';
import { VueQueryPlugin } from '@tanstack/vue-query';
import VueSafeTeleport from 'vue-safe-teleport';
import SolanaWallets from 'solana-wallets-vue';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';

const walletOptions = {
  wallets: [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
  ],
  autoConnect: true,
};

export function registerPlugins(app: App) {
  app
    .use(i18n)
    .use(router)
    .use(VueQueryPlugin)
    .use(blocknative)
    .use(VueVirtualScroller)
    .use(VueSafeTeleport)
    .use(SolanaWallets, walletOptions);
  return app;
}

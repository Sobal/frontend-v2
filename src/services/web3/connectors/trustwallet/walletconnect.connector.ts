import { EthereumProvider } from '@walletconnect/ethereum-provider';

import { configService } from '@/services/config/config.service';
import { WalletError } from '@/types';
import { Connector, ConnectorId } from '../connector';
import { Network } from '@/lib/config';
import useDarkMode from '@/composables/useDarkMode';

const { MAINNET, NEON_MAINNET, NEON_DEVNET, BASE, BASE_GOERLI } = Network;

export class WalletConnectConnector extends Connector {
  id = ConnectorId.WalletConnect;
  async connect() {
    const provider = await EthereumProvider.init({
      projectId: '96ec07ab805a6abb425fb22135bd41a1',
      chains: [MAINNET],
      optionalChains: [NEON_MAINNET, NEON_DEVNET, BASE, BASE_GOERLI],
      rpcMap: {
        [MAINNET]: configService.getNetworkRpc(NEON_MAINNET),
        [NEON_MAINNET]: configService.getNetworkRpc(NEON_MAINNET),
        [NEON_DEVNET]: configService.getNetworkRpc(NEON_DEVNET),
        [BASE]: configService.getNetworkRpc(BASE),
        [BASE_GOERLI]: configService.getNetworkRpc(BASE_GOERLI),
      },
      showQrModal: true,
      qrModalOptions: { themeMode: useDarkMode().darkMode ? 'dark' : 'light' },
    });
    this.provider = provider;

    try {
      const accounts = await provider.enable();
      const chainId = await provider.request({ method: 'eth_chainId' });
      this.handleChainChanged(chainId);
      this.handleAccountsChanged(accounts);
    } catch (err) {
      if ((err as WalletError).code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        console.log('Please connect to WalletConnect.');
      } else {
        console.error(err);
      }
    }
    return {
      provider,
      account: this.account,
      chainId: this.chainId,
    };
  }
}

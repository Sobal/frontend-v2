import { Config } from '../types';
import contracts from './contracts';
import keys from './keys';
import pools from './pools';
import tokenlists from './tokenlists';
import tokens from './tokens';
import rateProviders from './rateProviders';

const config: Config = {
  key: '245022934',
  chainId: 245022934,
  chainName: 'Neon Mainnet',
  name: 'Neon Mainnet',
  shortName: 'neon-mainnet',
  monorepoName: 'neon-mainnet',
  slug: 'neon',
  network: 'neon-mainnet',
  trustWalletNetwork: 'neon',
  unknown: false,
  visibleInUI: true,
  testNetwork: true,
  rpc: `https://neon-proxy-mainnet.solana.p2p.org`,
  ws: ``,
  explorer: 'https://neonscan.org',
  explorerName: 'Neonscan',
  subgraph: 'https://neon-subgraph.sobal.fi/sobal-pools',
  balancerApi: 'https://api.sobal.fi',
  poolsUrlV2: '',
  subgraphs: {
    main: ['https://neon-subgraph.sobal.fi/sobal-pools'],
    aave: '',
    gauge: '',
    blocks: '',
  },
  bridgeUrl: 'https://neonpass.live',
  supportsEIP1559: false,
  supportsElementPools: false,
  blockTime: 2,
  nativeAsset: {
    name: 'Neon',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'NEON',
    decimals: 18,
    deeplinkId: 'neon',
    logoURI: 'tokens/neon.png',
    minTransactionBuffer: '0.05',
  },
  thirdParty: {
    coingecko: {
      nativeAssetId: 'neon',
      platformId: 'neon-evm',
    },
  },
  addresses: {
    ...contracts,
  },
  pools,
  tokens,
  keys,
  gauges: {
    type: 3,
    weight: 0,
  },
  tokenlists,
  rateProviders,
};

export default config;

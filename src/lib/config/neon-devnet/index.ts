import { Config } from '../types';
import contracts from './contracts';
import keys from './keys';
import pools from './pools';
import tokenlists from './tokenlists';
import tokens from './tokens';
import rateProviders from './rateProviders';

//TODO: Main Subgraph, Gauge Subgraph, Balancer API, Element Pools, Gauge Type & Weight

const config: Config = {
  key: '245022926',
  chainId: 245022926,
  chainName: 'Neon Devnet',
  name: 'Neon Devnet',
  shortName: 'neon-devnet',
  monorepoName: 'neon-devnet',
  slug: 'neon-devnet',
  network: 'neon-devnet',
  trustWalletNetwork: 'neondevnet',
  unknown: true,
  visibleInUI: true,
  testNetwork: true,
  showLatestArticles: false,
  rpc: `https://devnet.neonevm.org`,
  ws: `wss://devnet.neonevm.org`,
  explorer: 'https://devnet.neonscan.org',
  explorerName: 'Neonscan',
  analyticsUrl: '',
  subgraph: 'https://ch2-graph.neontest.xyz/subgraphs/name/sobal/sobal-pools',
  balancerApi: 'https://api.sobal.fi',
  poolsUrlV2: '',
  subgraphs: {
    main: ['https://ch2-graph.neontest.xyz/subgraphs/name/sobal/sobal-pools'],
    aave: '',
    gauge: '',
    blocks: '',
  },
  bridgeUrl: 'https://devnet.neonpass.live',
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
    minTransactionBuffer: '1',
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

import { Config } from '../types';
import contracts from './contracts';
import keys from './keys';
import pools from './pools';
import tokenlists from './tokenlists';
import tokens from './tokens';
import rateProviders from './rateProviders';

const config: Config = {
  key: '8453',
  chainId: 8453,
  chainName: 'Base',
  name: 'Base',
  shortName: 'base',
  monorepoName: 'base',
  slug: 'base',
  network: 'base',
  trustWalletNetwork: 'base',
  unknown: true,
  visibleInUI: true,
  testNetwork: false,
  rpc: `https://mainnet.base.org`,
  ws: ``,
  explorer: 'https://basescan.org',
  explorerName: 'BaseScan',
  subgraph:
    'https://api.studio.thegraph.com/query/50526/sobal-base/version/latest',
  balancerApi: 'https://api.sobal.fi',
  poolsUrlV2: '',
  subgraphs: {
    main: [
      'https://api.studio.thegraph.com/query/50526/sobal-base/version/latest',
    ],
    aave: '',
    gauge: '',
    blocks:
      'https://api.studio.thegraph.com/query/48427/bleu-base-blocks/version/latest',
  },
  bridgeUrl: 'https://bridge.base.org/',
  supportsEIP1559: false,
  supportsElementPools: false,
  showLatestArticles: true,
  blockTime: 2,
  nativeAsset: {
    name: 'Ethereum',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'ETH',
    decimals: 18,
    deeplinkId: 'eth',
    logoURI: 'tokens/eth.png',
    minTransactionBuffer: '0.01',
  },
  thirdParty: {
    coingecko: {
      nativeAssetId: 'ethereum',
      platformId: 'base',
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

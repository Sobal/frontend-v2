import { Config } from '../types';
import contracts from './contracts';
import keys from './keys';
import pools from './pools';
import tokenlists from './tokenlists';
import tokens from './tokens';
import rateProviders from './rateProviders';

const config: Config = {
  key: '84531',
  chainId: 84531,
  chainName: 'Base Goerli',
  name: 'Base Goerli',
  shortName: 'base-goerli',
  monorepoName: 'base-goerli',
  slug: 'base-goerli',
  network: 'base-goerli',
  trustWalletNetwork: 'base-goerli',
  unknown: false,
  visibleInUI: true,
  testNetwork: false,
  rpc: `https://goerli.base.org`,
  ws: ``,
  explorer: 'https://goerli.basescan.org',
  explorerName: 'BaseScan',
  subgraph:
    'https://api.studio.thegraph.com/query/50526/sobal-base-goerli/version/latest',
  balancerApi: 'https://api.sobal.fi',
  poolsUrlV2: '',
  subgraphs: {
    main: [
      'https://api.studio.thegraph.com/query/50526/sobal-base-goerli/version/latest',
    ],
    aave: '',
    gauge: '',
    blocks: '',
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
    minTransactionBuffer: '0.05',
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

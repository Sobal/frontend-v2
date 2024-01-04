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
  unknown: true,
  visibleInUI: true,
  testNetwork: true,
  rpc: `https://goerli.base.org`,
  ws: ``,
  explorer: 'https://goerli.basescan.org',
  explorerName: 'BaseScan',
  analyticsUrl: '',
  subgraph:
    'https://api.studio.thegraph.com/query/50526/sobal-base-goerli/version/latest',
  balancerApi: 'https://api.sobal.fi',
  poolsUrlV2: '',
  solanaRpc: '',
  subgraphs: {
    main: [
      'https://api.studio.thegraph.com/query/50526/sobal-base-goerli/version/latest',
    ],
    aave: '',
    gauge: '',
    blocks: '',
  },
  bridgeUrl: 'https://goerli-bridge.base.org/deposit',
  supportsEIP1559: false,
  supportsElementPools: false,
  showLatestArticles: false,
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

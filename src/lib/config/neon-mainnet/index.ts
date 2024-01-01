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
  chainName: 'Neon',
  name: 'Neon',
  shortName: 'neon',
  monorepoName: 'neon-mainnet',
  slug: 'neon',
  network: 'neon-mainnet',
  trustWalletNetwork: 'neon',
  unknown: true,
  visibleInUI: true,
  testNetwork: false,
  rpc: `https://neon-proxy-mainnet.solana.p2p.org`,
  ws: ``,
  explorer: 'https://neonscan.org',
  explorerName: 'Neonscan',
  subgraph: 'https://neon-subgraph.sobal.fi/sobal-pools',
  balancerApi: 'https://api.sobal.fi',
  analyticsUrl: 'https://www.geckoterminal.com/neon-evm/sobal/pools',
  poolsUrlV2: '',
  subgraphs: {
    main: ['https://neon-subgraph.sobal.fi/sobal-pools'],
    aave: '',
    gauge: '',
    blocks: 'https://neon-subgraph.sobal.fi/sobal-neon-blocks',
  },
  blockTime: 4,
  bridgeUrl: 'https://neonpass.live',
  solanaRpc:
    'https://mainnet.helius-rpc.com/?api-key=804a681b-735c-4970-bbcc-b64e84575d24',
  solanaRpcName: 'mainnet-beta',
  bridgeUi: true,
  supportsEIP1559: false,
  supportsElementPools: false,
  showLatestArticles: true,
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

import { Config } from '../types';
import contracts from './contracts';
import keys from './keys';
import tokenlists from './tokenlists';
import tokens from './tokens';
import pools from './pools';
import rateProviders from './rateProviders';

const config: Config = {
  key: '5',
  chainId: 5,
  chainName: 'Goerli',
  name: 'Ethereum Testnet Goerli',
  shortName: 'Goerli',
  monorepoName: 'goerli',
  slug: 'goerli',
  network: 'goerli',
  trustWalletNetwork: 'goerli',
  unknown: true,
  visibleInUI: false,
  testNetwork: true,
  showLatestArticles: false,
  rpc: `https://goerli.infura.io/v3/${keys.infura}`,
  ws: `wss://goerli.infura.io/ws/v3/${keys.infura}`,
  explorer: 'https://goerli.etherscan.io',
  explorerName: 'Etherscan',
  analyticsUrl: '',
  subgraph: 'https://api.thegraph.com/subgraphs/name/sobal/sobal-goerli',
  poolsUrlV2: '',
  solanaRpc: '',
  subgraphs: {
    main: ['https://api.thegraph.com/subgraphs/name/sobal/sobal-goerli'],
    aave: '',
    gauge: '',
    blocks: 'https://api.thegraph.com/subgraphs/name/blocklytics/goerli-blocks',
  },
  bridgeUrl: '',
  supportsEIP1559: true,
  supportsElementPools: false,
  blockTime: 12,
  nativeAsset: {
    name: 'Ether',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'ETH',
    decimals: 18,
    deeplinkId: 'ether',
    logoURI: 'tokens/eth.png',
    minTransactionBuffer: '0.05',
  },
  thirdParty: {
    coingecko: {
      nativeAssetId: 'ethereum',
      platformId: 'ethereum',
    },
  },
  addresses: {
    ...contracts,
  },
  pools,
  tokens,
  keys,
  gauges: {
    type: 2,
    weight: 100,
  },
  tokenlists,
  rateProviders,
};

export default config;

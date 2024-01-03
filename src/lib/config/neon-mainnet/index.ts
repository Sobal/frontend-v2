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
  solanaExplorer: 'https://solscan.io',
  solanaExplorerSuffix: '',
  bridgeUi: true,
  supportsEIP1559: false,
  supportsElementPools: false,
  showLatestArticles: true,
  // Lowercase BELOW --
  bridgeUnwrapOut: ['so11111111111111111111111111111111111111112'],
  // Lowercase ABOVE --
  nativeAsset: {
    name: 'Neon',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    address_spl: 'NeonTjSjsuo3rexg9o6vHuMXw62f9V7zvmu8M8Zut44',
    symbol: 'NEON',
    decimals: 18,
    deeplinkId: 'neon',
    logoURI: 'tokens/neon.png',
    minTransactionBuffer: '1',
  },
  solanaNativeAsset: {
    name: 'SOL',
    address: '0x5f38248f339Bf4e84A2caf4e4c0552862dC9F82a',
    address_spl: 'So11111111111111111111111111111111111111112',
    symbol: 'SOL',
    decimals: 9,
    deeplinkId: 'sol',
    logoURI:
      'https://github.com/Sobal/tokenlists/blob/main/src/assets/images/tokens/0x5f38248f339bf4e84a2caf4e4c0552862dc9f82a.png?raw=true',
    minTransactionBuffer: '0.1',
  },
  bridgeNativeTransferContract: '0xaC6FEaF379B01e3B0888597c53bb37e2B0b513ab',
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

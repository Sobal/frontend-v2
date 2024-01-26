import { Config } from '../types';
import contracts from './contracts';
import keys from './keys';
import pools from './pools';
import tokenlists from './tokenlists';
import tokens from './tokens';
import rateProviders from './rateProviders';

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
  solanaRpc:
    'https://devnet.helius-rpc.com/?api-key=804a681b-735c-4970-bbcc-b64e84575d24',
  solanaRpcName: 'Devnet',
  bridgeUi: true,
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
  // Lowercase BELOW --
  bridgeUnwrapOut: ['so11111111111111111111111111111111111111112'],
  // Lowercase ABOVE --
  nativeAsset: {
    name: 'Neon',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    address_spl: '89dre8rZjLNft7HoupGiyxu3MNftR577ZYu8bHe2kK7g',
    symbol: 'NEON',
    decimals: 18,
    deeplinkId: 'neon',
    logoURI: 'tokens/neon.png',
    minTransactionBuffer: '1',
  },
  solanaNativeAsset: {
    name: 'SOL',
    address: '0xc7Fc9b46e479c5Cb42f6C458D1881e55E6B7986c',
    address_spl: 'So11111111111111111111111111111111111111112',
    symbol: 'SOL',
    decimals: 9,
    deeplinkId: 'sol',
    logoURI:
      'https://github.com/Sobal/tokenlists/blob/main/src/assets/images/tokens/0x5f38248f339bf4e84a2caf4e4c0552862dc9f82a.png?raw=true',
    minTransactionBuffer: '0.1',
  },
  solanaExplorer: 'https://solscan.io',
  solanaExplorerSuffix: '?cluster=devnet',
  bridgeNativeTransferContract: '0x5238c694a8db837fff8c4068859e765b978a7607',
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

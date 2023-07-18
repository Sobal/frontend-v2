import { BoostedProtocol } from '@/composables/useBoostedPool';
import { Pools } from '@/types/pools';

const pools: Pools = {
  IdsMap: {},
  Pagination: {
    PerPage: 10,
    PerPool: 10,
    PerPoolInitial: 5,
  },
  BoostsEnabled: true,
  DelegateOwner: '0xba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1b',
  ZeroAddress: '0x0000000000000000000000000000000000000000',
  DynamicFees: {
    Gauntlet: [],
  },
  BlockList: [''],
  IncludedPoolTypes: [
    'Weighted',
    'Stable',
    'MetaStable',
    'LiquidityBootstrapping',
    'Investment',
    'StablePhantom',
    'ComposableStable',
    'FX',
    'EulerLinear',
    'Gyro2',
    'Gyro3',
    'GyroE',
  ],
  Stable: {
    AllowList: [],
  },
  Investment: {
    AllowList: [],
  },
  Weighted: {
    // Only effective after given timestamp here: usePool.ts#createdAfterTimestamp
    // see useDisabledJoinPool.ts#nonAllowedWeightedPoolAfterTimestamp for logic.
    AllowList: [
      '0xe3f7cb8e66dc46a6479b780df45d608726d831b4000100000000000000000001',
      '0xf327836747d49ae0ab12c75c2b474f5c63257fe4000200000000000000000002',
    ],
  },
  Factories: {
    '0x2a48D000Ff815C3AE571c5121993150B600a6AF2': 'weightedPool', // weighted pool v4
    '0x0a0f3a5b6Ff6e00eCBC04178DF03E769A1BD17Cc': 'managedPool', // managed pool v2
    '0x314fF5B1e0A0F3cB7048819517aFf9B9d608b5A9': 'composableStablePool', // composable stable v5
    '0xE1e342e62FA8c657834B285f33BDca1D0299Eedc': 'erc4626Linear', // erc4626 linear pool v4
  },
  Stakable: {
    VotingGaugePools: [],
    AllowList: [],
  },
  Metadata: {
    '0xf327836747d49ae0ab12c75c2b474f5c63257fe4000200000000000000000002': {
      // name: 'USDT-WNEON-USDC',
      hasIcon: true,
      boosted: true,
      boostedProtocols: [BoostedProtocol.NeonIncentivised],
    },
  },
  Deep: [],
  BoostedApr: [],
  DisabledJoins: [],
  NewVersionAvailable: {},
  Deprecated: {},
  GaugeMigration: {},
  BrandedRedirect: {},
  ExitViaInternalBalance: [],
  Issues: {},
};

export default pools;

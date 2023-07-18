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
    ],
  },
  Factories: {
    '0x2a48D000Ff815C3AE571c5121993150B600a6AF2': 'weightedPool', // weighted pool v4
    '0x04EF81349F5A2049D2D8261f33b7dC5bc0B33889': 'managedPool', // managed pool v2
    '0x2297E369aa665f1cE2eCB9eBe4Ec0E6D9f02f72D': 'composableStablePool', // composable stable v5
    '0x2818b8F2752F0AAE3938c64943aEA2a1a9258246': 'erc4626Linear', // erc4626 linear pool v4
  },
  Stakable: {
    VotingGaugePools: [],
    AllowList: [],
  },
  Metadata: {},
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

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
      '0xafb45a2c365749ddc9166e6ddf845af2e9217345000200000000000000000003', // WETH/axlUSD
      '0x074094aac7a5e2fe9e16b5d0be9ed288c5ea6c8e000200000000000000000004', // WETH/BOLD
      '0x6e6ba6490fa58e8b8c4a45c6d02220f48ace8732000200000000000000000005', // BOLD/axlUSD
      '0xf746c5856773feb08d043055422367e123e27254000200000000000000000006', // TOSHI/WETH
      '0xa405b5750ce237012e0dce6dca3a6bf70051c10c000200000000000000000007', // TOSHI/USDbC
    ],
  },
  Factories: {
    // lowercase!!!!
    '0x8d88057b8cc9235d4c69db3c14fd8d4229a6ae35': 'weightedPool', // weighted pool v4
    '0x08e3814ad06be2a555a4c0d330a20078e5344dfd': 'managedPool', // managed pool v2
    '0x60ef61c5c0f4213c7b2c02f64a575dc4bfdbf302': 'composableStablePool', // composable stable v5
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

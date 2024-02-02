// import { IncentiveProtocol } from '@/composables/useIncentivizedPool';

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
    AllowList: [
      '0x985b565665fb07133f2af74ee1c9b0adb29bd3d3000000000000000000000006', // USDT-USDC
    ],
  },
  Investment: {
    AllowList: [],
  },
  Weighted: {
    // Only effective after given timestamp here: usePool.ts#createdAfterTimestamp
    // see useDisabledJoinPool.ts#nonAllowedWeightedPoolAfterTimestamp for logic.
    AllowList: [
      '0x4e14f4933c8fbda3d4f24da8e4343d1918d2902f000200000000000000000003', // WNEON / USDC
      '0xb04aba41dc9ed9b1c534b8239c4ffdfc526c5409000200000000000000000004', // WNEON / WSOL
      '0x705e262b5ca06b78e7688227c17c287376a54071000200000000000000000007', // SBT-stable / WNEON,
      '0x71c9c1dbd9fa6378e9ce7a67bb6cf1db32e066e0000200000000000000000009', // LST / WSOL
      '0xf34145a71d76f3dc3568556e80eefdfccc49110100020000000000000000000a', // MNGO / USDC
      '0x378867ecf4f61ff27de6c80853c453c34c76bffd00020000000000000000000b', // USDT / 2080
      '0x5f121979c7063cc068f94433e4a13f552d721ae800020000000000000000000c', // WNEON / JUP
      '0x6d60242d95c5e4a42bebdb2560238aca1b2c1a2400020000000000000000000d', // WNEON / WEN
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
  Metadata: {
    '0x985b565665fb07133f2af74ee1c9b0adb29bd3d3000000000000000000000006': {
      name: 'Sobal Stable USD',
    },
    '0x705e262b5ca06b78e7688227c17c287376a54071000200000000000000000007': {
      name: 'WNEON/Sobal Stable USD',
      // incentivised: true,
      // incentiveProtocols: [IncentiveProtocol.Neon],
      // incentivizedButtonText: 'SPECIAL INCENTIVE',
      // incentivizedHoverText:
      //   'Deposit into this pool rewarded NEON tokens distributed every 14 days. Promotion ends at 5pm GMT on 17th September.',
    },
  },
  Deep: ['0x705e262b5ca06b78e7688227c17c287376a54071000200000000000000000007'],
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

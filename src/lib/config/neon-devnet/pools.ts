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
      '0xa370750a870e2219fb26630bfc64ed83675de5ab000200000000000000000003',
    ],
  },
  Factories: {
    // lowercase!!!!
    '0x2a48d000ff815c3ae571c5121993150b600a6af2': 'weightedPool', // weighted pool v4
    '0x0aef3105c4f84d2c3cb4789c13c7f63680fa6366': 'weightedPool', // weighted pool v4 !! no pause
    '0x0a0f3a5b6ff6e00ecbc04178df03e769a1bd17cc': 'managedPool', // managed pool v2
    '0x3dbd0bfd1405529208b3d13589de43db86777f05': 'managedPool', // managed pool v2 !! no pause
    '0x314ff5b1e0a0f3cb7048819517aff9b9d608b5a9': 'composableStablePool', // composable stable v5
    '0x000be463fcafef5a20b20e9aa0b07e0b3b51875a': 'composableStablePool', // composable stable v5 !! no pause
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

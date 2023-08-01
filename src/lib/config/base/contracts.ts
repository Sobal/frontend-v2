import { Contracts } from '../types';
import * as base from '@/assets/data/contracts/base.json';

const contracts: Contracts = {
  multicall: base.MultiCall,
  authorizer: base.Authorizer,
  vault: base.Vault,
  weightedPoolFactory: base.WeightedPoolFactory,
  stablePoolFactory: base.ComposableStablePoolFactory,
  balancerHelpers: base.BalancerHelpers,
  batchRelayer: base.BalancerRelayer,
  merkleRedeem: '',
  merkleOrchard: '',
  merkleOrchardV2: '',
  lidoRelayer: '',
  veBAL: '',
  gaugeController: '',
  gaugeFactory: '',
  balancerMinter: '',
  tokenAdmin: '',
  veDelegationProxy: '',
  veBALHelpers: '',
  feeDistributor: '',
  feeDistributorDeprecated: '',
  faucet: '',
  omniVotingEscrow: '',
};

export default contracts;

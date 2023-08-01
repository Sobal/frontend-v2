import { Contracts } from '../types';
import * as base_goerli from '@/assets/data/contracts/base_goerli.json';

const contracts: Contracts = {
  multicall: base_goerli.MultiCall,
  authorizer: base_goerli.Authorizer,
  vault: base_goerli.Vault,
  weightedPoolFactory: base_goerli.WeightedPoolFactory,
  stablePoolFactory: base_goerli.ComposableStablePoolFactory,
  balancerHelpers: base_goerli.BalancerHelpers,
  batchRelayer: base_goerli.BalancerRelayer,
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

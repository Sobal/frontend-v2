import { Contracts } from '../types';
import * as goerli from '@/assets/data/contracts/goerli.json';

const contracts: Contracts = {
  multicall: goerli.MultiCall,
  authorizer: goerli.Authorizer,
  vault: goerli.Vault,
  weightedPoolFactory: goerli.WeightedPoolFactory,
  stablePoolFactory: goerli.ComposableStablePoolFactory,
  balancerHelpers: goerli.BalancerHelpers,
  batchRelayer: goerli.BalancerRelayer,
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
  faucet: '0xccb0F4Cf5D3F97f4a55bb5f5cA321C3ED033f244',
  omniVotingEscrow: '',
};

export default contracts;

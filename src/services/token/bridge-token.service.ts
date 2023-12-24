import { Connection, clusterApiUrl } from '@solana/web3.js';

import { configService as _configService } from '../config/config.service';
import BalancesConcern from './bridge-concerns/balances.concern';

export default class BridgeTokenService {
  provider: Connection;
  balances: BalancesConcern;

  constructor(
    readonly balancesConcernClass = BalancesConcern,
    readonly rpcProviderService = new Connection(clusterApiUrl('mainnet-beta')),
    readonly configService = _configService
  ) {
    this.provider = this.rpcProviderService;
    this.balances = new balancesConcernClass(this);
  }
}

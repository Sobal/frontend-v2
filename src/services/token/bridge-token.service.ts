import { Connection } from '@solana/web3.js';

import { configService as _configService } from '../config/config.service';
import BalancesConcern from './bridge-concerns/balances.concern';

export default class BridgeTokenService {
  provider: Connection;
  balances: BalancesConcern;

  constructor(
    readonly balancesConcernClass = BalancesConcern,
    readonly rpcProviderService = new Connection(
      'https://go.getblock.io/a0b3db7b68e948cbb1c05192a6ab77ee',
      'finalized'
    ),
    readonly configService = _configService
  ) {
    this.provider = this.rpcProviderService;
    this.balances = new balancesConcernClass(this);
  }
}

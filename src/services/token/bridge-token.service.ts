import { Connection } from '@solana/web3.js';

import { configService as _configService } from '@/services/config/config.service';
import BalancesConcern from './bridge-concerns/balances.concern';

const solanaRpc = _configService.network.solanaRpc;

export default class BridgeTokenService {
  connection: Connection;
  balances: BalancesConcern;

  constructor(
    readonly balancesConcernClass = BalancesConcern,
    readonly rpcProviderService = new Connection(solanaRpc, {
      commitment: 'confirmed',
    }),
    readonly configService = _configService
  ) {
    this.connection = this.rpcProviderService;
    this.balances = new balancesConcernClass(this);
  }
}

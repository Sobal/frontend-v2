import { Connection } from '@solana/web3.js';

import { configService as _configService } from '@/services/config/config.service';
import BalancesConcern from './bridge-concerns/balances.concern';

const bridgeRpc = _configService.network.bridgeRpc;

export default class BridgeTokenService {
  connection: Connection;
  balances: BalancesConcern;

  constructor(
    readonly balancesConcernClass = BalancesConcern,
    readonly rpcProviderService = new Connection(bridgeRpc, {
      commitment: 'confirmed',
    }),
    readonly configService = _configService
  ) {
    this.connection = this.rpcProviderService;
    this.balances = new balancesConcernClass(this);
  }
}

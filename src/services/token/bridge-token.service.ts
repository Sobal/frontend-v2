import { Connection } from '@solana/web3.js';

import { configService as _configService } from '../config/config.service';
import BalancesConcern from './bridge-concerns/balances.concern';

export default class BridgeTokenService {
  provider: Connection;
  balances: BalancesConcern;

  constructor(
    readonly balancesConcernClass = BalancesConcern,
    readonly rpcProviderService = new Connection(
      'https://mainnet.helius-rpc.com/?api-key=804a681b-735c-4970-bbcc-b64e84575d24',
      {
        commitment: 'confirmed',
      }
    ),
    readonly configService = _configService
  ) {
    this.provider = this.rpcProviderService;
    this.balances = new balancesConcernClass(this);
  }
}

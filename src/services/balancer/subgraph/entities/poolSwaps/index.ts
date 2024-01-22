import { getAddress } from '@ethersproject/address';

import { toJsTimestamp } from '@/composables/useTime';
import { PoolSwap } from '@/services/pool/types';
import { walletService } from '@/services/web3/wallet.service';
import { QueryBuilder } from '@/types/subgraph';

import Service from '../../balancer-subgraph.service';
import queryBuilder from './query';

export default class PoolSwaps {
  service: Service;
  query: QueryBuilder;

  constructor(service: Service, query: QueryBuilder = queryBuilder) {
    this.service = service;
    this.query = query;
  }

  public async get(args = {}, attrs = {}): Promise<PoolSwap[]> {
    const query = this.query(args, attrs);
    const { swaps } = await this.service.client.get(query);

    return await this.serialize(swaps);
  }

  public async swaprDecoration(swaps: PoolSwap[]): Promise<PoolSwap[]> {
    const addressList: string[] = swaps.map(swap => swap.userAddress.id);
    const ensData = (await walletService.getEnsName(addressList)) ?? [];
    const compiledData = await Promise.all(
      ensData.map(async (record: string) => {
        let ensAvatar: null | string = null;
        if (record) {
          ensAvatar = await walletService.getEnsAvatar(record);
        }

        return {
          ensName: record,
          ensAvatar,
        };
      })
    );

    return swaps.map((swap: PoolSwap, index: number) => ({
      ...swap,
      ensName: compiledData[index].ensName,
      ensAvatar: compiledData[index].ensAvatar,
    }));
  }

  async serialize(swaps: PoolSwap[]) {
    const processedSwaps = await this.swaprDecoration(swaps);

    return processedSwaps.map(swap => ({
      ...swap,
      tokenIn: getAddress(swap.tokenIn),
      tokenOut: getAddress(swap.tokenOut),
      timestamp: toJsTimestamp(swap.timestamp),
    }));
  }
}

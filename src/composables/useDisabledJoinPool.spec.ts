import { initDependenciesWithDefaultMocks } from '@/dependencies/default-mocks';
import { Pool, PoolType } from '@/services/pool/types';
import { BoostedPoolMock } from '@/__mocks__/boosted-pool';
import { aPoolToken } from '@/__mocks__/weighted-pool';
import { mountComposableWithFakeTokensProvider as mountComposable } from '@tests/mount-helpers';
import {
  balAddress,
  daiAddress,
  randomAddress,
} from '@tests/unit/builders/address';
import { aPool } from '@tests/unit/builders/pool.builders';
import { useDisabledJoinPool } from './useDisabledJoinPool';
import useNetwork from './useNetwork';
import { dateToUnixTimestamp } from './useTime';

initDependenciesWithDefaultMocks();

async function mountVettedTokensInPool(pool: Pool) {
  const { result } = await mountComposable(() => useDisabledJoinPool(pool));
  return result;
}

it('disables joins for pools with no initial liquidity', async () => {
  const pool = BoostedPoolMock;
  pool.totalShares = '0';
  const { disableJoinsReason, shouldDisableJoins } =
    await mountVettedTokensInPool(pool);

  expect(shouldDisableJoins.value).toBeTrue();
  expect(disableJoinsReason.value.notInitialLiquidity).toBeTrue();
});

it('disables joins for pools created after timestamp (2023-03-29) with non vetted tokens', async () => {
  const pool = BoostedPoolMock;
  pool.createTime = dateToUnixTimestamp('2023-03-30'); //Created after 29 March
  const { disableJoinsReason, shouldDisableJoins, nonAllowedSymbols } =
    await mountVettedTokensInPool(pool);

  pool.tokens[0].address = randomAddress();

  expect(shouldDisableJoins.value).toBeTrue();
  expect(disableJoinsReason.value.nonVettedTokensAfterTimestamp).toBeTrue();
  expect(nonAllowedSymbols.value).toMatchInlineSnapshot(
    '"bb-a-USDT,USDT,bb-a-USDC,USDC,bb-a-DAI,DAI"'
  );
});

it('disables joins for weighted pools created after timestamp (2023-03-29) that are not in the weighted allow list', async () => {
  const { networkId } = useNetwork();
  networkId.value = 1;

  const pool = BoostedPoolMock;
  pool.createTime = dateToUnixTimestamp('2023-03-30'); //Created after 29 March
  pool.poolType = PoolType.Weighted;
  const { disableJoinsReason, shouldDisableJoins } =
    await mountVettedTokensInPool(pool);

  pool.tokens[0].address = randomAddress();

  expect(shouldDisableJoins.value).toBeTrue();
  expect(
    disableJoinsReason.value.nonAllowedWeightedPoolAfterTimestamp
  ).toBeTrue();
});

it('allows joins for weighted pools on test networks created after timestamp (2023-03-29) that are not in the weighted allow list', async () => {
  const { networkId } = useNetwork();
  networkId.value = 5;

  const pool = BoostedPoolMock;
  pool.createTime = dateToUnixTimestamp('2023-03-30'); //Created after 29 March
  pool.poolType = PoolType.Weighted;
  const { disableJoinsReason } = await mountVettedTokensInPool(pool);

  pool.tokens[0].address = randomAddress();

  expect(
    disableJoinsReason.value.nonAllowedWeightedPoolAfterTimestamp
  ).toBeFalse();
});

it('does not disables joins for pools created before 29 march', async () => {
  const pool = BoostedPoolMock;
  pool.createTime = dateToUnixTimestamp('2023-03-28'); //Created before 29 March
  pool.totalShares = '100';
  const { shouldDisableJoins, disableJoinsReason } =
    await mountVettedTokensInPool(pool);

  expect(disableJoinsReason.value.nonVettedTokensAfterTimestamp).toBeFalse();
  expect(shouldDisableJoins.value).toBeFalse();
});

it('disabled joins for pools FX pool', async () => {
  const pool = aPool({
    totalShares: '100',
    createTime: dateToUnixTimestamp('2023-03-28'),
    owner: randomAddress(),
    poolType: PoolType.Investment, // Requires Allow listing
    tokens: [
      aPoolToken({ address: daiAddress, symbol: 'DAI' }),
      aPoolToken({ address: balAddress, symbol: 'BAL' }),
    ],
  });

  const { networkId } = useNetwork();
  networkId.value = 1;

  const { shouldDisableJoins, disableJoinsReason } =
    await mountVettedTokensInPool(pool);

  expect(disableJoinsReason.value.requiresAllowListing).toBeTrue();
  expect(shouldDisableJoins.value).toBeTrue();
  expect(disableJoinsReason.value.nonVettedTokensAfterTimestamp).toBeFalse();
  expect(disableJoinsReason.value.notInitialLiquidity).toBeFalse();
});

import { getAddress } from '@ethersproject/address';
import BigNumber from 'bignumber.js';
import { initial } from 'lodash';
import { Ref } from 'vue';
import { Path } from 'vue-i18n';

import pkg from '@/../package.json';
import { NATIVE_ASSET_ADDRESS } from '@/constants/tokens';
import { POOLS } from '@/constants/pools';

export function shorten(str = '', slice1 = 6, slice2 = 4) {
  return `${str.slice(0, slice1)}...${str.slice(str.length - slice2)}`;
}

export async function sleep(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

function lsAddVersion(value: any, version: string) {
  return {
    data: value,
    _version: version,
  };
}

function lsGetKey(key: string) {
  return `${pkg.name}.${key}`;
}

export function lsSet(key: string, value: any, version?: string) {
  const data = version != null ? lsAddVersion(value, version) : value;

  return localStorage.setItem(lsGetKey(key), JSON.stringify(data));
}

export function lsGet<T = any>(
  key: string,
  defaultValue: any = null,
  version?: string
): T {
  const rawValue = localStorage.getItem(lsGetKey(key));

  if (rawValue != null) {
    try {
      const value = JSON.parse(rawValue);
      if (version != null) {
        return value._version === version ? value.data : defaultValue;
      }
      return value;
    } catch (e) {
      return defaultValue;
    }
  }

  return defaultValue;
}

export function lsRemove(key: string) {
  return localStorage.removeItem(lsGetKey(key));
}

export function getCurrentTs() {
  return parseInt((new Date().getTime() / 1e3).toString());
}

export function tsToBlockNumber(currentBlockNumber, ts) {
  const diffTs = getCurrentTs() - ts;
  return currentBlockNumber - parseInt((diffTs / 13.35).toString());
}

export function bnum(val: string | number | BigNumber): BigNumber {
  const number = typeof val === 'string' ? val : val ? val.toString() : '0';
  return new BigNumber(number);
}

export const bnumZero = bnum(0);

export function scale(
  input: BigNumber | string,
  decimalPlaces: number
): BigNumber {
  const unscaled = typeof input === 'string' ? new BigNumber(input) : input;
  const scalePow = new BigNumber(decimalPlaces.toString());
  const scaleMul = new BigNumber(10).pow(scalePow);
  return unscaled.times(scaleMul);
}

export function shortenLabel(str: string, segLength = 4) {
  const firstSegment = str.substring(0, segLength + 2);
  const lastSegment = str.substring(str.length, str.length - segLength);
  return `${firstSegment}...${lastSegment}`;
}

/**
 * Wait for a reactive variable to change to an expected value.
 */
export async function forChange<T>(
  reactiveVar: Ref<T>,
  expected: T,
  checkCount = 0,
  checkDelay = 500,
  checkLimit = 20
): Promise<void> {
  if (reactiveVar.value === expected || checkCount >= checkLimit) return;
  await sleep(checkDelay);
  await forChange(reactiveVar, expected, checkCount++);
}

/**
 * Sums and array of string numbers and returns as BigNumber
 */
export function bnSum(amounts: string[]): BigNumber {
  return amounts.reduce((a, b) => bnum(a).plus(b), bnum(0));
}

/**
 *  creates a sentence readable list for an array for string
 *  e.g. 'UBT, DSB and BAL' for [UBT, DSB, BAL]
 */
export function formatWordListAsSentence(
  words: string[],
  t: (key: Path | number) => string
) {
  if (!words.length) return '';
  if (words.length >= 2) {
    const commaSeperatedWords = initial(words);
    return `${commaSeperatedWords.join(', ')} ${t('and')} ${
      words[words.length - 1]
    }`;
  }
  // only one word, so just return that
  return words[0];
}

export function getAddressFromPoolId(poolId: string) {
  return poolId.substring(0, 42);
}

export function isSameAddress(address1: string, address2: string): boolean {
  if (!address1 || !address2) return false;
  return getAddress(address1) === getAddress(address2);
}

export function includesAddress(addresses: string[], address: string): boolean {
  if (!address) return false;
  addresses = addresses.map(a => (a ? getAddress(a) : ''));
  return addresses.includes(getAddress(address));
}

export function indexOfAddress(addresses: string[], address: string): number {
  if (!address) return -1;
  addresses = addresses.map(a => (a ? getAddress(a) : ''));
  return addresses.indexOf(getAddress(address));
}

/**
 * Select an Address when it's unknown what format the addresses are in.
 * If you know the format of the addresses use selectByAddressFast instead
 * @param map A hashmap of address -> type
 * @param address An address to find in the map
 * @returns Item from map or undefined
 */
export function selectByAddress<T>(
  map: Record<string, T>,
  address: string
): T | undefined {
  const foundAddress = Object.keys(map).find(itemAddress => {
    if (isSameAddress(itemAddress, address)) {
      return true;
    }
  });
  if (foundAddress) return map[foundAddress];
}

/**
 * Select an Address using a hashmap
 * You must ensure the hashmap keys and address are in the same case
 * (lowercase or checksum case) before passing them to this function
 * @param map A hashmap of address -> type
 * @param address An address to find in the map
 * @returns Item from map or undefined
 */
export function selectByAddressFast<T>(
  map: Record<string, T>,
  address: string
): T | undefined {
  return map[address];
}

export function findByAddress<T>(
  items: Array<T>,
  address: string,
  key = 'address'
): T | undefined {
  return items.find(item => isSameAddress(item[key], address));
}

export function removeAddress(address: string, addresses: string[]): string[] {
  return addresses.filter(a => !isSameAddress(a, address));
}

/**
 * Wraps an async function with loading=true and then loading=false for a given
 * reactive ref.
 *
 * @param {Function} fn - The async function to track if loading or finished.
 * @param {Ref<boolean>} toggle - The reactive property tracking loading state.
 */
export async function trackLoading<T>(
  fn: () => Promise<T>,
  toggle: Ref<boolean>
): Promise<T> {
  toggle.value = true;
  const result = await fn();
  toggle.value = false;
  return result;
}

// If given address is the native asset address, return the zero address
export function formatAddressForSor(address: string): string {
  return isSameAddress(address, NATIVE_ASSET_ADDRESS)
    ? POOLS.ZeroAddress
    : address;
}

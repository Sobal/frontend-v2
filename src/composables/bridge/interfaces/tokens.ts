export interface GasToken {
  token_name: string;
  token_mint: string;
  token_chain_id: `0x${string}`;
}

export type Amount = number | bigint | string;

export type NeonAddress = `0x${string}` | string;

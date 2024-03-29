export interface TokenInfo {
  readonly chainId: number;
  readonly address: string;
  readonly address_spl?: string;
  readonly name: string;
  readonly decimals: number;
  readonly symbol: string;
  readonly logoURI?: string;
  readonly tags?: string[];
  readonly balance?: string;
  readonly solanaBalance?: string;
  readonly price?: number;
  readonly extensions?: {
    readonly [key: string]: string | number | boolean | null;
  };
}

export type NativeAsset = TokenInfo & {
  deeplinkId: string;
  minTransactionBuffer: string;
};

export interface Version {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
}

export interface Tags {
  readonly [tagId: string]: {
    readonly name: string;
    readonly description: string;
  };
}

export interface TokenList {
  readonly name: string;
  readonly timestamp: string;
  readonly version: Version;
  readonly tokens: TokenInfo[];
  readonly keywords?: string[];
  readonly tags?: Tags;
  readonly logoURI?: string;
}

export type TokenListMap = { [address: string]: TokenList };
export type TokenInfoMap = Record<string, TokenInfo>;

export interface TokenListURLMap {
  Balancer: {
    Allowlisted: string;
  };
  External: string[];
  Bridge: string[];
}

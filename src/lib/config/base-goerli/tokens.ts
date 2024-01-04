import { TokenConstants } from '../types';

const tokens: TokenConstants = {
  Popular: {
    Symbols: ['DAI', 'cbETH', 'WETH'],
  },
  InitialSwapTokens: {
    input: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    output: '0x174956bDfbCEb6e53089297cce4fE2825E58d92C', // DAI
  },
  FeaturedSwapTokens: {
    input: '',
    output: '',
  },
  Addresses: {
    nativeAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    wNativeAsset: '0x4200000000000000000000000000000000000006', // WETH
    WETH: '0x4200000000000000000000000000000000000006',
    BAL: '0x0000000000000000000000000000000000000000',
  },
};

export default tokens;

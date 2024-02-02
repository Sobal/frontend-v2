import { TokenListURLMap } from '@/types/TokenList';

const tokenlists: TokenListURLMap = {
  Balancer: {
    Allowlisted:
      'https://raw.githubusercontent.com/Sobal/tokenlists/main/generated/sobal.tokenlist.json',
  },
  External: [],
  Bridge: [
    'https://raw.githubusercontent.com/neonlabsorg/token-list/main/tokenlist.json',
    'https://raw.githubusercontent.com/Sobal/tokenlists/main/manual/sobal-bridge.tokenlist.json',
  ],
};

export default tokenlists;

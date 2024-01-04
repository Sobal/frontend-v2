import { TokenListURLMap } from '@/types/TokenList';

const tokenlists: TokenListURLMap = {
  Balancer: {
    Allowlisted:
      'https://raw.githubusercontent.com/Sobal/tokenlists/main/generated/sobal.tokenlist.json',
  },
  External: [
    'https://raw.githubusercontent.com/neonlabsorg/token-list/main/tokenlist.json',
  ],
  Bridge: [
    'https://raw.githubusercontent.com/neonlabsorg/token-list/main/tokenlist.json',
  ],
};

export default tokenlists;

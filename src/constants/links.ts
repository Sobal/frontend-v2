export const EXTERNAL_LINKS = {
  Sobal: {
    Home: 'https://sobal.fi',
    Analytics: 'https://dune.xyz/sobal',
    BalForGas:
      'https://docs.balancer.finance/core-concepts/bal-balancer-governance-token/bal-for-gas',
    BugBounty: 'https://immunefi.com/bounty/balancer/',
    Docs: 'https://docs.sobal.fi',
    DevDocs: 'https://docs.sobal.fi/v/developers/',
    Forum: '',
    Grants: '',
    Social: {
      Discord: 'https://discord.sobal.fi',
      Github: 'https://github.com/sobal/',
      Mail: 'mailto:hello@sobal.fi',
      Medium: 'https://blog.sobal.fi',
      Linkedin: '',
      Twitter: 'https://twitter.com/sobalfi',
      Youtube: '',
    },
    Vote: 'https://snapshot.org/#/sobal.eth',
  },
  Gauntlet: {
    Home: 'https://gauntlet.network',
  },
  Neon: {
    Home: 'http://neonevm.org',
  },
  Base: {
    Home: 'https://base.org',
  },
  Ethereum: {
    Wallets: 'https://ethereum.org/en/wallets',
  },
  Gitbook: {
    Home: 'https://www.gitbook.com',
  },
  Simpool: {
    Home: 'https://simpool.fi/',
    Auctions: (poolAddress: string, networkPrefix = '') =>
      `https://${networkPrefix}simpool.io/pool/${poolAddress}`,
  },
};

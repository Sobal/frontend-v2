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
  Element: {
    Home: 'https://element.fi',
    Earn: 'https://app.element.fi/mint',
    Pools: {
      LUSD: 'https://app.element.fi/pools/0x56F30398d13F111401d6e7ffE758254a0946687d',
      USDC: 'https://app.element.fi/pools/0x7Edde0CB05ED19e03A9a47CD5E53fC57FDe1c80c',
    },
  },
  Copper: {
    Home: 'https://fjordfoundry.com/?utm_source=balancer&utm_medium=website',
    Auctions: (poolAddress: string, networkPrefix = '') =>
      `https://${networkPrefix}copperlaunch.com/auctions/${poolAddress}`,
  },
  Tracer: {
    Home: 'https://mycelium.xyz/',
  },
  Gyroscope: {
    Home: 'https://gyro.finance/',
  },
  Beets: {
    Home: 'https://beets.fi/',
  },
  Xave: {
    Home: 'https://www.xave.co/',
  },
  Sense: {
    Home: 'https://sense.finance/',
  },
};

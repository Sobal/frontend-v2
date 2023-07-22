export enum IncentiveProtocol {
  Neon = 'neon',
}

export const incentivizedProtocolIconPaths: Record<IncentiveProtocol, string> =
  {
    [IncentiveProtocol.Neon]: new URL(
      '@/assets/images/icons/protocols/neon.svg',
      import.meta.url
    ).href,
  };

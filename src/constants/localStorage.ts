export enum LocalStorageKey {
  // Onboarding / Accounts
  EvmAddress = 'dydx.EvmAddress',
  DydxAddress = 'dydx.DydxAddress',
  OnboardingSelectedWalletType = 'dydx.OnboardingSelectedWalletType',
  WalletConnectionType = 'dydx.WalletConnectionType',
  OnboardingHasAcknowledgedTerms = 'dydx.OnboardingHasAcknowledgedTerms',
  EvmDerivedAddresses = 'dydx.EvmDerivedAddresses',

  // UI State
  SelectedLocale = 'dydx.SelectedLocale',
}

export const LOCAL_STORAGE_VERSIONS = {
  [LocalStorageKey.EvmDerivedAddresses]: 'v1',
  // TODO: version all localStorage keys
};

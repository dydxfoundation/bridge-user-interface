export enum DialogTypes {
  AcknowledgeTerms = 'AcknowledgeTerms',
  DisconnectWallet = 'DisconnectWallet',
  MnemonicExport = 'MnemonicExport',
  MoreLinks = 'MoreLinks',
  Onboarding = 'Onboarding',
  RestrictedGeo = 'RestrictedGeo',
  WalletRestricted = 'WalletRestricted',
}

export type DialogProps = {
  setIsOpen?: (open: boolean) => void;
};

export type PreventCloseDialogProps = {
  preventClose?: boolean;
} & DialogProps;

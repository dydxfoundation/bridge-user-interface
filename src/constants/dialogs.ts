export enum DialogTypes {
  DisconnectWallet = 'DisconnectWallet',
  Onboarding = 'Onboarding',
  MnemonicExport = 'MnemonicExport',
  MoreLinks = 'MoreLinks',
}

export type DialogProps = {
  setIsOpen?: (open: boolean) => void;
};

export type PreventCloseDialogProps = {
  preventClose?: boolean;
} & DialogProps;

import { useDispatch, useSelector } from 'react-redux';

import { DialogTypes } from '@/constants/dialogs';

import { closeDialog, openDialog } from '@/state/dialogs';

import { getActiveDialog } from '@/state/dialogsSelectors';

import { AcknowledgeTermsDialog } from './AcknowledgeTermsDialog';
import { DisconnectDialog } from './DisconnectDialog';
import { MnemonicExportDialog } from './MnemonicExportDialog';
import { MoreLinksDialog } from './MoreLinksDialog';
import { OnboardingDialog } from './OnboardingDialog';
import { RestrictedGeoDialog } from './RestrictedGeoDialog';
import { WalletRestrictedDialog } from './WalletRestrictedDialog';

export const DialogManager = () => {
  const dispatch = useDispatch();
  const activeDialog = useSelector(getActiveDialog);

  if (!activeDialog) return null;
  const { dialogProps, type } = activeDialog;

  const modalProps = {
    ...dialogProps,
    setIsOpen: (isOpen: boolean) => {
      dispatch(
        isOpen
          ? openDialog({
              type: activeDialog.type,
              dialogProps: activeDialog.dialogProps,
            })
          : closeDialog()
      );
    },
  };

  return {
    [DialogTypes.AcknowledgeTerms]: <AcknowledgeTermsDialog {...modalProps} />,
    [DialogTypes.DisconnectWallet]: <DisconnectDialog {...modalProps} />,
    [DialogTypes.MnemonicExport]: <MnemonicExportDialog {...modalProps} />,
    [DialogTypes.MoreLinks]: <MoreLinksDialog {...modalProps} />,
    [DialogTypes.Onboarding]: <OnboardingDialog {...modalProps} />,
    [DialogTypes.RestrictedGeo]: <RestrictedGeoDialog {...modalProps} />,
    [DialogTypes.WalletRestricted]: <WalletRestrictedDialog {...modalProps} />,
  }[type];
};

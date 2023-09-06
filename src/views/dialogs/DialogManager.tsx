import { useDispatch, useSelector } from "react-redux";

import { DialogTypes } from "@/constants/dialogs";

import { closeDialog, openDialog } from "@/state/dialogs";

import { getActiveDialog } from "@/state/dialogsSelectors";

import { DisconnectDialog } from "@/views/dialogs/DisconnectDialog";
import { OnboardingDialog } from "@/views/dialogs/OnboardingDialog";

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
    [DialogTypes.DisconnectWallet]: <DisconnectDialog {...modalProps} />,
    [DialogTypes.Onboarding]: <OnboardingDialog {...modalProps} />,
  }[type];
};

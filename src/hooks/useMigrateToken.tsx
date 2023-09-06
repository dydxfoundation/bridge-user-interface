import { useContext, createContext, useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import BigNumber from "bignumber.js";

import { MigrateFormSteps } from "@/constants/migrate";

import { calculateCanAccountMigrate } from "@/state/accountCalculators";

import { MustBigNumber } from "@/lib/numbers";

import { useAccounts } from "./useAccounts";
import { useAccountBalance } from "./useAccountBalance";
import { useIsDydxAddressValid } from "./useIsDydxAddressValid";
import { useTokenAllowance } from "./migrate/useTokenAllowance";
import { useBridgeTransaction } from "./migrate/useBridgeTransaction";

const MigrateTokenContext = createContext<
  ReturnType<typeof useMigrateTokenContext> | undefined
>(undefined);

MigrateTokenContext.displayName = "MigrateStatus";

export const MigrateTokenProvider = ({ ...props }) => (
  <MigrateTokenContext.Provider value={useMigrateTokenContext()} {...props} />
);

export const useMigrateToken = () => useContext(MigrateTokenContext)!;

const useMigrateTokenContext = () => {
  const { evmAddress, dydxAddress: accountDydxAddress } = useAccounts();
  const { dv3tntBalance } = useAccountBalance();

  // Form state and inputs
  const [currentStep, setCurrentStep] = useState(MigrateFormSteps.Edit);
  const [amountBN, setAmountBN] = useState<BigNumber | undefined>();
  const [destinationAddress, setDestinationAddress] = useState<
    string | undefined
  >(accountDydxAddress as string | undefined);

  const canAccountMigrate = useSelector(
    calculateCanAccountMigrate,
    shallowEqual
  );

  useEffect(() => {
    setDestinationAddress(accountDydxAddress);
  }, [accountDydxAddress]);

  useEffect(() => {
    setAmountBN(undefined);
  }, [evmAddress]);

  // Validations
  const isAmountValid = Boolean(
    MustBigNumber(dv3tntBalance).gt(0) &&
      amountBN?.gt(0) &&
      amountBN?.lte(dv3tntBalance ?? 0)
  );

  const isDestinationAddressValid = useIsDydxAddressValid(destinationAddress);

  const canInteractWithContracts =
    canAccountMigrate && isAmountValid && isDestinationAddressValid;

  const { needTokenAllowance, tokenApproveWrite, ...tokenAllowance } =
    useTokenAllowance({
      amountBN,
      enabled:
        canInteractWithContracts &&
        (currentStep === MigrateFormSteps.Edit ||
          currentStep === MigrateFormSteps.Preview),
    });

  const { clearStatus, startBridge, bridgeError, ...bridgeTransaction } =
    useBridgeTransaction({
      amountBN,
      destinationAddress,
      enabled:
        canInteractWithContracts &&
        !needTokenAllowance &&
        currentStep === MigrateFormSteps.Preview,
    });

  const resetForm = (shouldClearInputs?: boolean) => {
    if (shouldClearInputs) {
      setAmountBN(undefined);
      setDestinationAddress(accountDydxAddress);
    }

    setCurrentStep(MigrateFormSteps.Edit);
    clearStatus();
  };

  useEffect(() => {
    // when wallet is disconnected
    if (!canAccountMigrate) resetForm();
  }, [canAccountMigrate]);

  const onFormSubmit = async () => {
    switch (currentStep) {
      case MigrateFormSteps.Edit: {
        if (!canAccountMigrate) return;
        setCurrentStep(MigrateFormSteps.Preview);
        break;
      }
      case MigrateFormSteps.Preview: {
        try {
          if (needTokenAllowance) {
            tokenApproveWrite?.();
          } else if (startBridge) {
            await startBridge();
            setCurrentStep(MigrateFormSteps.Confirmed);
          }
        } catch (error) {
          console.error(error);
        }
        break;
      }

      case MigrateFormSteps.Confirmed: {
        if (bridgeError) {
          resetForm();
        } else {
          // todo: switch to pending migrations tab
        }

        break;
      }
    }
  };

  return {
    // form state and inputs
    onFormSubmit,
    resetForm,
    currentStep,

    amountBN,
    setAmountBN,
    destinationAddress,
    setDestinationAddress,
    isAmountValid,
    isDestinationAddressValid,

    // token allowance
    needTokenAllowance,
    ...tokenAllowance,

    // transaction tracking
    bridgeError,
    ...bridgeTransaction,
  };
};

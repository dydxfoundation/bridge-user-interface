import { useContext, createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BigNumber from "bignumber.js";

import {
  MigrateFormSteps,
  MigrateTabs,
  TransactionStatus,
} from "@/constants/migrate";

import { SEPOLIA_ETH_CHAIN_ID } from "@/constants/wallets";

import { calculateCanAccountMigrate } from "@/state/accountCalculators";

import { MustBigNumber } from "@/lib/numbers";
import { parseWalletError } from "@/lib/wallet";

import { useAccountBalance } from "./useAccountBalance";
import { useAccounts } from "./useAccounts";
import { useBridgeTransaction } from "./migrate/useBridgeTransaction";
import { useIsDydxAddressValid } from "./useIsDydxAddressValid";
import { useMatchingEvmNetwork } from "./useMatchingEvmNetwork";
import { useStringGetter } from "./useStringGetter";
import { useTokenAllowance } from "./migrate/useTokenAllowance";

const MigrateTokenContext = createContext<
  ReturnType<typeof useMigrateTokenContext> | undefined
>(undefined);

MigrateTokenContext.displayName = "MigrateToken";

export const MigrateTokenProvider = ({ ...props }) => (
  <MigrateTokenContext.Provider value={useMigrateTokenContext()} {...props} />
);

export const useMigrateToken = () => useContext(MigrateTokenContext)!;

const useMigrateTokenContext = () => {
  const stringGetter = useStringGetter();
  const { evmAddress, dydxAddress } = useAccounts();
  const { dv3tntBalance } = useAccountBalance();
  const { isMatchingNetwork, matchNetwork, isSwitchingNetwork } =
    useMatchingEvmNetwork({
      chainId: SEPOLIA_ETH_CHAIN_ID,
    });

  const [selectedTab, setSelectedTab] = useState(MigrateTabs.Migrate);

  // Form state and inputs
  const [currentStep, setCurrentStep] = useState(MigrateFormSteps.Edit);
  const [isRequesting, setIsRequesting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<
    string | React.ReactNode[] | undefined
  >();
  const [amountBN, setAmountBN] = useState<BigNumber | undefined>();
  const [destinationAddress, setDestinationAddress] = useState<
    string | undefined
  >(dydxAddress as string | undefined);

  const canAccountMigrate = useSelector(calculateCanAccountMigrate);

  useEffect(() => {
    setDestinationAddress(dydxAddress);
  }, [dydxAddress]);

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

  const canWriteContracts =
    canAccountMigrate && isAmountValid && isDestinationAddressValid;

  // Transactions
  const { needTokenAllowance, approveToken, ...tokenAllowance } =
    useTokenAllowance({
      amountBN,
      enabled:
        canAccountMigrate &&
        isAmountValid &&
        currentStep === MigrateFormSteps.Preview,
    });

  const {
    clearStatus,
    startBridge,
    bridgeTxError,
    transactionStatus,
    ...bridgeTransaction
  } = useBridgeTransaction({
    amountBN,
    destinationAddress,
  });

  const resetForm = (shouldClearInputs?: boolean) => {
    if (shouldClearInputs) {
      setAmountBN(undefined);
      setDestinationAddress(dydxAddress);
    }

    setCurrentStep(MigrateFormSteps.Edit);
    clearStatus();
  };

  useEffect(() => {
    if (!canAccountMigrate && !isSwitchingNetwork && !isRequesting) resetForm();
  }, [canAccountMigrate, isSwitchingNetwork, isRequesting]);

  const onFormSubmit = async () => {
    switch (currentStep) {
      case MigrateFormSteps.Edit: {
        if (!canAccountMigrate) return;
        setCurrentStep(MigrateFormSteps.Preview);
        break;
      }
      case MigrateFormSteps.Preview: {
        if (!canWriteContracts) return;
        setIsRequesting(true);

        try {
          if (!isMatchingNetwork) await matchNetwork();

          if (needTokenAllowance) {
            await approveToken();
          } else {
            await startBridge();
            setCurrentStep(MigrateFormSteps.Confirmed);
          }
        } catch (error) {
          const { message } = parseWalletError({
            error,
            stringGetter,
          });

          if (message) setErrorMsg(message);
        } finally {
          setIsRequesting(false);
        }

        break;
      }

      case MigrateFormSteps.Confirmed: {
        if (bridgeTxError) {
          resetForm();
        } else if (transactionStatus === TransactionStatus.Acknowledged) {
          setSelectedTab(MigrateTabs.PendingMigrations);
        }

        break;
      }
    }
  };

  return {
    selectedTab,
    setSelectedTab,

    // form state and inputs
    onFormSubmit,
    resetForm,
    currentStep,
    errorMsg,

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
    bridgeTxError,
    transactionStatus,
    ...bridgeTransaction,
  };
};

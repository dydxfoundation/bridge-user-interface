import { useContext, createContext, useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { fromBech32, toHex } from "@cosmjs/encoding";
import BigNumber from "bignumber.js";

import {
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useWaitForTransaction,
} from "wagmi";

import {
  BRIDGE_CONTRACT_ABI,
  BRIDGE_CONTRACT_ADDRESS,
  ETH_TOKEN_ADDRESS,
  ETH_TOKEN_CONTRACT_ABI,
  MigrateFormSteps,
} from "@/constants/migrate";

import { DydxAddress, SEPOLIA_ETH_CHAIN_ID } from "@/constants/wallets";

import { calculateCanAccountMigrate } from "@/state/accountCalculators";

import { MustBigNumber } from "@/lib/numbers";

import { useAccounts } from "./useAccounts";
import { useIsDydxAddressValid } from "./useIsDydxAddressValid";

import { useAccountBalance } from "./useAccountBalance";

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

  const canAccountMigrate = useSelector(
    calculateCanAccountMigrate,
    shallowEqual
  );

  const [currentStep, setCurrentStep] = useState(MigrateFormSteps.Edit);
  const [bridgeTransactionHash, setBridgeTransactionHash] = useState<
    string | undefined
  >();

  // User input
  const [amountBN, setAmountBN] = useState<BigNumber | undefined>();
  const [destinationAddress, setDestinationAddress] = useState<
    string | undefined
  >(accountDydxAddress);

  useEffect(() => {
    setDestinationAddress(accountDydxAddress);
  }, [accountDydxAddress]);

  useEffect(() => {
    setAmountBN(undefined);
  }, [evmAddress]);

  useEffect(() => {
    // when wallet is disconnected
    if (!canAccountMigrate) {
      setCurrentStep(MigrateFormSteps.Edit);
    }
  }, [canAccountMigrate]);

  const resetInputs = () => {
    setAmountBN(undefined);
    setDestinationAddress(accountDydxAddress);
  };

  // Validations
  const isAmountValid = Boolean(
    MustBigNumber(dv3tntBalance).gt(0) &&
      amountBN &&
      amountBN.gt(0) &&
      amountBN.lte(dv3tntBalance ?? 0)
  );

  const isDestinationAddressValid = useIsDydxAddressValid(destinationAddress);

  // Token (dv3tnt) allowance
  const { data: tokenAllowance } = useContractRead({
    address: ETH_TOKEN_ADDRESS,
    abi: ETH_TOKEN_CONTRACT_ABI,
    functionName: "allowance",
    args: [evmAddress, BRIDGE_CONTRACT_ADDRESS],
    watch: true,
    enabled:
      evmAddress !== undefined &&
      isAmountValid &&
      (currentStep === MigrateFormSteps.Preview ||
        currentStep === MigrateFormSteps.Edit),
  });

  const needTokenAllowance = MustBigNumber(tokenAllowance as string).lt(
    amountBN?.shiftedBy(18) ?? 0
  );

  const { config: tokenApproveConfig } = usePrepareContractWrite({
    address: ETH_TOKEN_ADDRESS,
    abi: ETH_TOKEN_CONTRACT_ABI,
    functionName: "approve",
    args: [
      BRIDGE_CONTRACT_ADDRESS,
      MustBigNumber(dv3tntBalance).shiftedBy(18).toFixed(),
    ],
    enabled:
      evmAddress !== undefined &&
      currentStep === MigrateFormSteps.Preview &&
      needTokenAllowance,
    chainId: SEPOLIA_ETH_CHAIN_ID,
  });

  const {
    data: tokenApproveData,
    write: tokenApproveWrite,
    isLoading: isTokenApproveWriting,
    error: tokenApproveError,
  } = useContractWrite(tokenApproveConfig);

  const { isLoading: isTokenApprovePending, error: tokenApproveTxError } =
    useWaitForTransaction({
      hash: tokenApproveData?.hash,
    });

  // Bridge
  const { config: bridgeConfig } = usePrepareContractWrite({
    address: BRIDGE_CONTRACT_ADDRESS,
    abi: BRIDGE_CONTRACT_ABI,
    functionName: "bridge",
    args: [
      amountBN?.shiftedBy(18)?.toFixed() ?? "0",
      isDestinationAddressValid &&
        toHex(fromBech32(destinationAddress as DydxAddress).data),
      "", // memo
    ],
    enabled:
      isAmountValid &&
      isDestinationAddressValid &&
      !needTokenAllowance &&
      currentStep === MigrateFormSteps.Preview,
    chainId: SEPOLIA_ETH_CHAIN_ID,
  });

  const {
    data: bridgeData,
    writeAsync: bridgeWrite,
    isLoading: isBridgeWriting,
    error: bridgeError,
  } = useContractWrite(bridgeConfig);

  const {
    // data: bridgeTxData, todo: estimate finalization progress by comparing blockNumber to finalized
    isLoading: isBridgePending,
    error: bridgeTxError,
  } = useWaitForTransaction({
    hash: bridgeData?.hash,
  });

  const onFormSubmit = async () => {
    switch (currentStep) {
      case MigrateFormSteps.Edit: {
        setCurrentStep(MigrateFormSteps.Preview);
        break;
      }
      case MigrateFormSteps.Preview: {
        try {
          if (needTokenAllowance) {
            tokenApproveWrite?.();
          } else if (bridgeWrite) {
            const result = await bridgeWrite();
            setBridgeTransactionHash(result?.hash);
            setCurrentStep(MigrateFormSteps.Confirmed);
          }
        } catch (error) {
          console.error(error);
        }
        break;
      }

      case MigrateFormSteps.Confirmed: {
        // todo: switch to pending migrations tab
        break;
      }
    }
  };

  return {
    // Form state / submit
    currentStep,
    setCurrentStep,
    onFormSubmit,

    // Form inputs
    amountBN,
    setAmountBN,
    destinationAddress,
    setDestinationAddress,
    resetInputs,

    // Validation
    isAmountValid,
    isDestinationAddressValid,
    needTokenAllowance,

    // Transactions
    isTokenApproveLoading: isTokenApproveWriting || isTokenApprovePending,
    tokenApproveError: tokenApproveError || tokenApproveTxError,
    isBridgeLoading: isBridgeWriting || isBridgePending,
    bridgeError: bridgeError || bridgeTxError,
    bridgeTransactionHash,
  };
};

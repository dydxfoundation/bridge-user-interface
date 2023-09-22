import { useEffect, useState } from "react";
import { fromBech32, toHex } from "@cosmjs/encoding";
import BigNumber from "bignumber.js";

import { useContractWrite, useWaitForTransaction } from "wagmi";

import {
  BRIDGE_CONTRACT_ABI,
  BRIDGE_CONTRACT_ADDRESS,
  TransactionStatus,
} from "@/constants/migrate";

import { DydxAddress, SEPOLIA_ETH_CHAIN_ID } from "@/constants/wallets";

import { useTrackTransactionFinalized } from "./useTrackTransactionFinalized";
import { useIsDydxAddressValid } from "../useIsDydxAddressValid";

export const useBridgeTransaction = ({
  amountBN,
  destinationAddress,
}: {
  amountBN?: BigNumber;
  destinationAddress?: string;
}) => {
  const [transactionStatus, setTransactionStatus] =
    useState<TransactionStatus>();
  const [bridgeTxHash, setBridgeTxHash] = useState<string | undefined>();
  const [bridgeTxMinedBlockNumber, setBridgeTxMinedBlockNumber] = useState<
    bigint | undefined
  >();

  const { isTransactionFinalized } = useTrackTransactionFinalized({
    bridgeTxMinedBlockNumber,
  });

  const isDestinationAddressValid = useIsDydxAddressValid(destinationAddress);

  useEffect(() => {
    if (isTransactionFinalized)
      setTransactionStatus(TransactionStatus.Acknowledged);
  }, [isTransactionFinalized]);

  // Warn user before resfresh / leaving page if transaction has not been acknowledged
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (
        transactionStatus &&
        transactionStatus !== TransactionStatus.Acknowledged
      ) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [transactionStatus]);

  const clearStatus = () => {
    setTransactionStatus(undefined);
    setBridgeTxHash(undefined);
    setBridgeTxMinedBlockNumber(undefined);
  };

  const {
    data: bridgeData,
    writeAsync: bridge,
    isLoading: isBridgePending,
  } = useContractWrite({
    address: BRIDGE_CONTRACT_ADDRESS,
    abi: BRIDGE_CONTRACT_ABI,
    functionName: "bridge",
    args: [
      amountBN?.shiftedBy(18)?.toFixed() ?? "0",
      isDestinationAddressValid
        ? toHex(fromBech32(destinationAddress as DydxAddress).data)
        : "",
      "", // memo
    ],
    chainId: SEPOLIA_ETH_CHAIN_ID,
  });

  const startBridge = async () => {
    setTransactionStatus(TransactionStatus.Pending);
    try {
      const result = await bridge();
      setBridgeTxHash(result.hash);
    } catch (error) {
      setTransactionStatus(undefined);
      throw error;
    }
  };

  const { error: bridgeTxError } = useWaitForTransaction({
    hash: bridgeData?.hash,
    onSuccess(data) {
      setTransactionStatus(TransactionStatus.Unfinalized);
      setBridgeTxMinedBlockNumber(data.blockNumber);
    },
    enabled:
      bridgeData?.hash !== undefined &&
      transactionStatus === TransactionStatus.Pending,
  });

  return {
    transactionStatus,
    setTransactionStatus,
    clearStatus,

    startBridge,
    bridgeTxError,
    isBridgePending,
    bridgeTxHash,
    bridgeTxMinedBlockNumber,
  };
};

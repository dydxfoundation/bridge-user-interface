import { useEffect, useState } from "react";
import { fromBech32, toHex } from "@cosmjs/encoding";
import BigNumber from "bignumber.js";

import { useContractWrite, useWaitForTransaction } from "wagmi";

import { bridgeContractAbi } from "@/constants/abi";
import { TransactionStatus } from "@/constants/migrate";

import { DydxAddress, EthereumAddress } from "@/constants/wallets";

import { useTrackTransactionFinalized } from "./useTrackTransactionFinalized";
import { useIsDydxAddressValid } from "../useIsDydxAddressValid";

export const useBridgeTransaction = ({
  amountBN,
  destinationAddress,
}: {
  amountBN?: BigNumber;
  destinationAddress?: string;
}) => {
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(
    TransactionStatus.NotStarted
  );
  const [bridgeTxHash, setBridgeTxHash] = useState<
    EthereumAddress | undefined
  >();
  const [bridgeTxMinedBlockNumber, setBridgeTxMinedBlockNumber] = useState<
    bigint | undefined
  >();

  const { isTransactionFinalized } = useTrackTransactionFinalized({
    bridgeTxMinedBlockNumber,
  });

  const isDestinationAddressValid = useIsDydxAddressValid(destinationAddress);

  useEffect(() => {
    if (isTransactionFinalized)
      setTransactionStatus(TransactionStatus.Finalized);
  }, [isTransactionFinalized]);

  // Warn user before resfresh / leaving page if transaction has not been acknowledged
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (
        transactionStatus &&
        transactionStatus < TransactionStatus.Finalized
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
    setTransactionStatus(TransactionStatus.NotStarted);
    setBridgeTxHash(undefined);
    setBridgeTxMinedBlockNumber(undefined);
  };

  const { writeAsync: bridge, isLoading: isBridgePending } = useContractWrite({
    address: import.meta.env.VITE_BRIDGE_CONTRACT_ADDRESS,
    abi: bridgeContractAbi,
    functionName: "bridge",
    args: [
      amountBN?.shiftedBy(18)?.toFixed() ?? "0",
      isDestinationAddressValid
        ? `0x${toHex(fromBech32(destinationAddress as DydxAddress).data)}`
        : "",
      "", // memo
    ],
    chainId: Number(import.meta.env.VITE_ETH_CHAIN_ID),
  });

  const startBridge = async () => {
    setTransactionStatus(TransactionStatus.Pending);
    try {
      const result = await bridge();
      setBridgeTxHash(result.hash);
    } catch (error) {
      setTransactionStatus(TransactionStatus.NotStarted);
      throw error;
    }
  };

  const { error: bridgeTxError } = useWaitForTransaction({
    hash: bridgeTxHash,
    onSuccess(data) {
      setTransactionStatus(TransactionStatus.Unfinalized);
      setBridgeTxMinedBlockNumber(data.blockNumber);
    },
    enabled:
      bridgeTxHash !== undefined &&
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

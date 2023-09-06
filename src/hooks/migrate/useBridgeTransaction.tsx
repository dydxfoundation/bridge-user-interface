import { useEffect, useState } from "react";
import { fromBech32, toHex } from "@cosmjs/encoding";
import BigNumber from "bignumber.js";

import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import {
  BRIDGE_CONTRACT_ABI,
  BRIDGE_CONTRACT_ADDRESS,
  TransactionStatus,
} from "@/constants/migrate";

import { DydxAddress, SEPOLIA_ETH_CHAIN_ID } from "@/constants/wallets";

import { useTrackTransactionFinalized } from "./useTrackTransactionFinalized";

export const useBridgeTransaction = ({
  amountBN,
  destinationAddress,
  enabled,
}: {
  amountBN?: BigNumber;
  destinationAddress?: string;
  enabled: boolean;
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

  useEffect(() => {
    if (isTransactionFinalized) {
      console.log("finalized tracked update");
      setTransactionStatus(TransactionStatus.Acknowledged);
    }
  }, [isTransactionFinalized]);

  const clearStatus = () => {
    setTransactionStatus(undefined);
    setBridgeTxHash(undefined);
    setBridgeTxMinedBlockNumber(undefined);
  };

  const { config: bridgeConfig } = usePrepareContractWrite({
    address: BRIDGE_CONTRACT_ADDRESS,
    abi: BRIDGE_CONTRACT_ABI,
    functionName: "bridge",
    args: [
      amountBN?.shiftedBy(18)?.toFixed() ?? "0",
      enabled ? toHex(fromBech32(destinationAddress as DydxAddress).data) : "",
      "", // memo
    ],
    enabled,
    chainId: SEPOLIA_ETH_CHAIN_ID,
  });

  const {
    data: bridgeData,
    writeAsync: bridgeWrite,
    error: bridgeError,
  } = useContractWrite(bridgeConfig);

  const startBridge = async () => {
    if (!bridgeWrite) return;
    const result = await bridgeWrite?.();
    setBridgeTxHash(result.hash);
    setTransactionStatus(TransactionStatus.Pending);
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

    startBridge: bridgeWrite ? startBridge : undefined,
    bridgeError: bridgeError || bridgeTxError,
    bridgeTxHash,
    bridgeTxMinedBlockNumber,
  };
};

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BigNumber from "bignumber.js";

import {
  useContractWrite,
  useContractRead,
  useWaitForTransaction,
} from "wagmi";

import { v3TokenContractAbi } from "@/constants/abi";

import { calculateCanAccountMigrate } from "@/state/accountCalculators";

import { MustBigNumber } from "@/lib/numbers";

import { useAccounts } from "../useAccounts";
import { useAccountBalance } from "../useAccountBalance";

export const useTokenAllowance = ({ amountBN }: { amountBN?: BigNumber }) => {
  const { evmAddress } = useAccounts();
  const { v3TokenBalance } = useAccountBalance();
  const canAccountMigrate = useSelector(calculateCanAccountMigrate);

  const [isRefetchingAfterWrite, setIsRefetchingAfterWrite] = useState(false);

  const { data: needTokenAllowance, refetch } = useContractRead({
    address: import.meta.env.VITE_V3_TOKEN_ADDRESS,
    abi: v3TokenContractAbi,
    functionName: "allowance",
    args: [evmAddress, import.meta.env.VITE_BRIDGE_CONTRACT_ADDRESS],
    chainId: Number(import.meta.env.VITE_ETH_CHAIN_ID),
    enabled: canAccountMigrate,
    select: (allowance) =>
      MustBigNumber(allowance as string).lt(amountBN?.shiftedBy(18) ?? 0),
  });

  const {
    data: approveTokenData,
    writeAsync: approveToken,
    isLoading: isApproveTokenPending,
  } = useContractWrite({
    address: import.meta.env.VITE_V3_TOKEN_ADDRESS,
    abi: v3TokenContractAbi,
    functionName: "approve",
    args: [
      import.meta.env.VITE_BRIDGE_CONTRACT_ADDRESS,
      MustBigNumber(v3TokenBalance).shiftedBy(18).toFixed(),
    ],
    chainId: Number(import.meta.env.VITE_ETH_CHAIN_ID),
  });

  const { isLoading: isApproveTokenTxPending, error: approveTokenTxError } =
    useWaitForTransaction({
      hash: approveTokenData?.hash,
      enabled: approveTokenData?.hash !== undefined,
    });

  useEffect(() => {
    if (!isApproveTokenTxPending) {
      setIsRefetchingAfterWrite(true);
      refetch().then(() => setIsRefetchingAfterWrite(false));
    }
  }, [isApproveTokenTxPending]);

  return {
    needTokenAllowance,
    isApproveTokenLoading:
      isApproveTokenPending ||
      isApproveTokenTxPending ||
      isRefetchingAfterWrite,
    approveTokenTxError,
    approveToken,
  };
};

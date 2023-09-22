import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BigNumber from "bignumber.js";

import {
  useContractWrite,
  useContractRead,
  useWaitForTransaction,
} from "wagmi";

import {
  BRIDGE_CONTRACT_ADDRESS,
  V3_TOKEN_ADDRESS,
  ERC20_CONTRACT_ABI,
} from "@/constants/migrate";

import { SEPOLIA_ETH_CHAIN_ID } from "@/constants/wallets";

import { calculateCanAccountMigrate } from "@/state/accountCalculators";

import { MustBigNumber } from "@/lib/numbers";

import { useAccounts } from "../useAccounts";
import { useAccountBalance } from "../useAccountBalance";

export const useTokenAllowance = ({ amountBN }: { amountBN?: BigNumber }) => {
  const { evmAddress } = useAccounts();
  const { dv3tntBalance } = useAccountBalance();
  const canAccountMigrate = useSelector(calculateCanAccountMigrate);

  const [isRefetchingAfterWrite, setIsRefetchingAfterWrite] = useState(false);

  const { data: tokenAllowance, refetch } = useContractRead({
    address: V3_TOKEN_ADDRESS,
    abi: ERC20_CONTRACT_ABI,
    functionName: "allowance",
    args: [evmAddress, BRIDGE_CONTRACT_ADDRESS],
    watch: true,
    enabled: canAccountMigrate,
    chainId: SEPOLIA_ETH_CHAIN_ID,
  });

  const needTokenAllowance = MustBigNumber(tokenAllowance as string).lt(
    amountBN?.shiftedBy(18) ?? 0
  );

  const {
    data: approveTokenData,
    writeAsync: approveToken,
    isLoading: isApproveTokenPending,
  } = useContractWrite({
    address: V3_TOKEN_ADDRESS,
    abi: ERC20_CONTRACT_ABI,
    functionName: "approve",
    args: [
      BRIDGE_CONTRACT_ADDRESS,
      MustBigNumber(dv3tntBalance).shiftedBy(18).toFixed(),
    ],
    chainId: SEPOLIA_ETH_CHAIN_ID,
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

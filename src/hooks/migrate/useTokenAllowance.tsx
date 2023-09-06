import BigNumber from "bignumber.js";

import {
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useWaitForTransaction,
} from "wagmi";

import {
  BRIDGE_CONTRACT_ADDRESS,
  ETH_TOKEN_ADDRESS,
  ETH_TOKEN_CONTRACT_ABI,
} from "@/constants/migrate";

import { SEPOLIA_ETH_CHAIN_ID } from "@/constants/wallets";

import { MustBigNumber } from "@/lib/numbers";

import { useAccounts } from "../useAccounts";
import { useAccountBalance } from "../useAccountBalance";

export const useTokenAllowance = ({
  amountBN,
  enabled,
}: {
  amountBN?: BigNumber;
  enabled: boolean;
}) => {
  const { evmAddress } = useAccounts();
  const { dv3tntBalance } = useAccountBalance();

  const { data: tokenAllowance } = useContractRead({
    address: ETH_TOKEN_ADDRESS,
    abi: ETH_TOKEN_CONTRACT_ABI,
    functionName: "allowance",
    args: [evmAddress, BRIDGE_CONTRACT_ADDRESS],
    watch: true,
    enabled,
    chainId: SEPOLIA_ETH_CHAIN_ID,
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
    enabled,
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
      enabled: tokenApproveData?.hash !== undefined,
    });

  return {
    needTokenAllowance,
    isTokenApproveLoading: isTokenApproveWriting || isTokenApprovePending,
    tokenApproveError: tokenApproveError || tokenApproveTxError,
    tokenApproveWrite,
  };
};

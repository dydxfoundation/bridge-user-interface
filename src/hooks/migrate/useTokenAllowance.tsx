import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';

import { useContractWrite, useContractRead, useWaitForTransaction } from 'wagmi';

import { ethDYDXContractAbi } from '@/constants/abi';
import { TOKEN_DECIMAL_SHIFT } from '@/constants/migrate';

import { MustBigNumber } from '@/lib/numbers';

import { useAccounts } from '../useAccounts';
import { useAccountBalance } from '../useAccountBalance';

export const useTokenAllowance = ({
  amountBN,
  enabled,
  watch,
}: {
  amountBN?: BigNumber;
  enabled: boolean;
  watch: boolean;
}) => {
  const { evmAddress } = useAccounts();
  const { ethDYDXBalance } = useAccountBalance();

  const [needsRefetch, setNeedsRefetch] = useState(false);

  const { data: needTokenAllowance, refetch } = useContractRead({
    address: import.meta.env.VITE_ETH_DYDX_ADDRESSS,
    abi: ethDYDXContractAbi,
    functionName: 'allowance',
    args: [evmAddress, import.meta.env.VITE_BRIDGE_CONTRACT_ADDRESS],
    chainId: Number(import.meta.env.VITE_ETH_CHAIN_ID),
    enabled,
    watch,
    select: (allowance) =>
      MustBigNumber(allowance as string).lt(amountBN?.shiftedBy(TOKEN_DECIMAL_SHIFT) ?? 0),
  });

  const {
    data: approveTokenData,
    writeAsync: approveToken,
    isLoading: isApproveTokenPending,
  } = useContractWrite({
    address: import.meta.env.VITE_ETH_DYDX_ADDRESSS,
    abi: ethDYDXContractAbi,
    functionName: 'approve',
    args: [
      import.meta.env.VITE_BRIDGE_CONTRACT_ADDRESS,
      MustBigNumber(ethDYDXBalance).shiftedBy(TOKEN_DECIMAL_SHIFT).toFixed(),
    ],
    chainId: Number(import.meta.env.VITE_ETH_CHAIN_ID),
  });

  const { isLoading: isApproveTokenTxPending, error: approveTokenTxError } = useWaitForTransaction({
    hash: approveTokenData?.hash,
    enabled: approveTokenData?.hash !== undefined,
    onSettled(data) {
      (data ? refetch() : Promise.resolve()).then(() => setNeedsRefetch(false));
    },
  });

  useEffect(() => {
    if (isApproveTokenTxPending) setNeedsRefetch(true);
  }, [isApproveTokenTxPending]);

  return {
    needTokenAllowance,

    isApproveTokenLoading: isApproveTokenPending || isApproveTokenTxPending || needsRefetch,

    approveTokenTxError,
    approveToken,
  };
};

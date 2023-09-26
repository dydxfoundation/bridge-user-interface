import { useSelector } from "react-redux";
import { useBalance } from "wagmi";

import { calculateCanAccountMigrate } from "@/state/accountCalculators";

import { useAccounts } from "./useAccounts";
import { usePollNativeTokenBalance } from "./usePollNativeTokenBalance";

export const useAccountBalance = () => {
  const { evmAddress, dydxAddress } = useAccounts();
  const canAccountMigrate = useSelector(calculateCanAccountMigrate);

  const { data: v3BalanceData } = useBalance({
    enabled: evmAddress && canAccountMigrate,
    address: evmAddress,
    chainId: Number(import.meta.env.VITE_ETH_CHAIN_ID),
    token: import.meta.env.VITE_V3_TOKEN_ADDRESS,
    watch: true,
  });

  const { data: wethDYDXBalanceData } = useBalance({
    enabled: false, // TODO: enable when we switch to mainnet
    address: evmAddress,
    token: import.meta.env.VITE_WETH_DYDX_ADDRESS,
  });

  const { formatted: v3TokenBalance } = v3BalanceData || {};
  const { formatted: wethDYDXBalance } = wethDYDXBalanceData || {};
  const v4TokenBalance = usePollNativeTokenBalance({ dydxAddress });

  return {
    v3TokenBalance,
    wethDYDXBalance,
    v4TokenBalance,
  };
};

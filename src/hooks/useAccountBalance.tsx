import { useContext, createContext } from "react";
import { useSelector } from "react-redux";
import { useBalance } from "wagmi";

import { calculateCanAccountMigrate } from "@/state/accountCalculators";

import { useAccounts } from "./useAccounts";
import { useQuery } from "react-query";
import { DYDX_DENOM } from "@dydxprotocol/v4-client-js";
import { MustBigNumber } from "@/lib/numbers";
import { TOKEN_DECIMAL_SHIFT } from "@/constants/migrate";

const AccountBalanceContext = createContext<
  ReturnType<typeof useAccountBalanceContext> | undefined
>(undefined);

AccountBalanceContext.displayName = "AccountBalance";

export const AccountBalanceProvider = ({ ...props }) => (
  <AccountBalanceContext.Provider
    value={useAccountBalanceContext()}
    {...props}
  />
);

export const useAccountBalance = () => useContext(AccountBalanceContext)!;

const ACCOUNT_BALANCE_POLLING_INTERVAL = 60_000;

const useAccountBalanceContext = () => {
  const { evmAddress, dydxAddress, getAccountBalance } = useAccounts();
  const canAccountMigrate = useSelector(calculateCanAccountMigrate);

  const { data: v3TokenBalanceData, refetch: refetchV3TokenBalance } =
    useBalance({
      enabled: evmAddress && canAccountMigrate,
      address: evmAddress,
      chainId: Number(import.meta.env.VITE_ETH_CHAIN_ID),
      token: import.meta.env.VITE_V3_TOKEN_ADDRESS,
    });

  const { data: wethDYDXBalanceData, refetch: refetchWethDYDXBalance } =
    useBalance({
      enabled: false, // TODO: enable when we switch to mainnet
      address: evmAddress,
      token: import.meta.env.VITE_WETH_DYDX_ADDRESS,
    });

  const { data: v4TokenBalance, refetch: refetchV4TokenBalance } = useQuery({
    enabled: dydxAddress !== undefined,
    queryKey: ["usePollV4TokenBalance", { dydxAddress }],
    queryFn: async () => {
      if (!dydxAddress) return;
      return await getAccountBalance({
        dydxAddress,
        denom: DYDX_DENOM,
      });
    },
    refetchInterval: ACCOUNT_BALANCE_POLLING_INTERVAL,
    staleTime: ACCOUNT_BALANCE_POLLING_INTERVAL,
    select: (data) =>
      MustBigNumber(data?.amount)
        .shiftedBy(TOKEN_DECIMAL_SHIFT * -1)
        .toString(),
  });

  const { formatted: v3TokenBalance } = v3TokenBalanceData || {};
  const { formatted: wethDYDXBalance } = wethDYDXBalanceData || {};

  const refetchBalances = () => {
    refetchV3TokenBalance();
    // refetchWethDYDXBalance();
    refetchV4TokenBalance();
  }

  return {
    v3TokenBalance,
    wethDYDXBalance,
    v4TokenBalance,

    refetchBalances,
  };
};

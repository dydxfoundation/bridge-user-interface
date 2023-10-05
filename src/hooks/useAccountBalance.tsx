import { useContext, createContext } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { useBalance } from "wagmi";
import { DYDX_DENOM } from "@dydxprotocol/v4-client-js";

import { TOKEN_DECIMAL_SHIFT } from "@/constants/migrate";

import { calculateCanAccountMigrate } from "@/state/accountCalculators";

import { MustBigNumber } from "@/lib/numbers";

import { useAccounts } from "./useAccounts";

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

  const {
    data: wrappedV3TokenBalanceData,
    refetch: refetchWrappedV3TokenBalance,
  } = useBalance({
    enabled: evmAddress && canAccountMigrate,
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
  const { formatted: wrappedV3TokenBalance } = wrappedV3TokenBalanceData || {};

  const refetchBalances = () => {
    refetchV3TokenBalance();
    refetchWrappedV3TokenBalance();
    refetchV4TokenBalance();
  };

  return {
    v3TokenBalance,
    wrappedV3TokenBalance: 0, // TODO: renable for mainnet
    v4TokenBalance,

    refetchBalances,
  };
};

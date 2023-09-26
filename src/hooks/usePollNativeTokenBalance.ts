import { useQuery } from "react-query";
import { DYDX_DENOM } from "@dydxprotocol/v4-client-js";

import { DydxAddress } from "@/constants/wallets";

import { MustBigNumber } from "@/lib/numbers";

import { useAccounts } from "./useAccounts";
import { useIsDydxAddressValid } from "./useIsDydxAddressValid";

const ACCOUNT_BALANCE_POLLING_INTERVAL = 60_000;

export const usePollNativeTokenBalance = ({
  dydxAddress,
  interval = ACCOUNT_BALANCE_POLLING_INTERVAL,
}: {
  dydxAddress?: string;
  interval?: number;
}) => {
  const { getAccountBalance } = useAccounts();
  const isAddressValid = useIsDydxAddressValid(dydxAddress);

  const { data } = useQuery({
    enabled: isAddressValid,
    queryKey: ["usePollNativeTokenBalance", { dydxAddress }],
    queryFn: async () => {
      if (!isAddressValid) return;
      return await getAccountBalance({
        dydxAddress: dydxAddress as DydxAddress,
        denom: DYDX_DENOM,
      });
    },
    refetchInterval: interval,
    staleTime: interval,
  });

  return MustBigNumber(data?.amount).shiftedBy(-18).toString();
};

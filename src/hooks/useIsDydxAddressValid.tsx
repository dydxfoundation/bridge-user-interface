import { useMemo } from "react";
import { validation } from "@dydxprotocol/v4-client-js";

import { useAccounts } from "./useAccounts";

export const useIsDydxAddressValid = (dydxAddress?: string) => {
  const { dydxAddress: accountDydxAddress } = useAccounts();

  return useMemo(
    () =>
      dydxAddress !== undefined &&
      (dydxAddress === accountDydxAddress ||
        validation.isValidAddress(dydxAddress)),
    [dydxAddress, accountDydxAddress]
  );
};

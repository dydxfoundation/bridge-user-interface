import { useMemo } from 'react';
import { validation } from '@dydxprotocol/v4-client-js';

import { useAccounts } from './useAccounts';
import { useRestrictions } from './useRestrictions';

export const useIsDydxAddressValid = (dydxAddress?: string) => {
  const { dydxAddress: accountDydxAddress } = useAccounts();
  const { isAddressSanctioned } = useRestrictions();

  return useMemo(
    () =>
      dydxAddress !== undefined &&
      (dydxAddress === accountDydxAddress || validation.isValidAddress(dydxAddress)) &&
      !isAddressSanctioned(dydxAddress),
    [dydxAddress, accountDydxAddress, isAddressSanctioned]
  );
};

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { DialogTypes } from '@/constants/dialogs';

import { openDialog } from '@/state/dialogs';

import { shouldGeoRestrict } from '@/lib/restrictions';

import { useDydxClient } from './useDydxClient';
import { useAccounts } from './useAccounts';

const useRestrictionContext = () => {
  const { compositeClient } = useDydxClient();
  const { evmAddress, dydxAddress, disconnect } = useAccounts();
  const dispatch = useDispatch();

  const [sanctionedAddresses, setSanctionedAddresses] = useState<Set<string>>(new Set());

  const restrictGeo = () =>
    dispatch(
      openDialog({
        type: DialogTypes.RestrictedGeo,
        openImmediately: true,
        dialogProps: { preventClose: true },
      })
    );

  const restrictUser = useCallback(() => {
    disconnect();
    dispatch(
      openDialog({
        type: DialogTypes.WalletRestricted,
        openImmediately: true,
      })
    );
  }, [disconnect, dispatch]);

  const screenAddresses = useCallback(
    async ({ addresses, throwError }: { addresses: string[]; throwError?: boolean }) => {
      if (!compositeClient) return;

      try {
        const results = await Promise.all(
          addresses.map((address) => compositeClient.indexerClient.utility.screen(address))
        );

        const screenedAddresses = Object.fromEntries(
          addresses.map((address, index) => [address, results[index]?.restricted])
        );

        const toAdd = Object.entries(screenedAddresses)
          .filter(([, isSanctioned]) => isSanctioned)
          .map(([address]) => address);

        if (toAdd.length) {
          setSanctionedAddresses((prev) => new Set([...prev, ...toAdd]));
        }

        return screenedAddresses;
      } catch (error) {
        if (shouldGeoRestrict(error)) {
          restrictGeo();
        } else if (throwError) {
          throw error;
        }
      }
    },
    [compositeClient, dispatch]
  );

  const isAddressSanctioned = useCallback(
    (address: string) => sanctionedAddresses.has(address),
    [sanctionedAddresses]
  );

  // Check geo restriction
  useEffect(() => {
    if (!compositeClient) return;
    (async () => {
      try {
        await compositeClient.indexerClient.utility.getHeight();
      } catch (error) {
        if (shouldGeoRestrict(error)) restrictGeo();
      }
    })();
  }, [compositeClient]);

  // Screen account addresses
  useEffect(() => {
    if (evmAddress) screenAddresses({ addresses: [evmAddress] });
  }, [screenAddresses, evmAddress]);

  useEffect(() => {
    if (dydxAddress) screenAddresses({ addresses: [dydxAddress] });
  }, [screenAddresses, dydxAddress]);

  useEffect(() => {
    if (
      (evmAddress && isAddressSanctioned(evmAddress)) ||
      (dydxAddress && isAddressSanctioned(dydxAddress))
    ) {
      restrictUser();
    }
  }, [evmAddress, dydxAddress, isAddressSanctioned, restrictUser]);

  return {
    screenAddresses,
    isAddressSanctioned,
    restrictUser,
  };
};

type RestrictionContextType = ReturnType<typeof useRestrictionContext>;
const RestrictionContext = createContext<RestrictionContextType>({} as RestrictionContextType);
RestrictionContext.displayName = 'Restriction';

export const RestrictionProvider = ({ ...props }) => (
  <RestrictionContext.Provider value={useRestrictionContext()} {...props} />
);

export const useRestrictions = () => useContext(RestrictionContext);

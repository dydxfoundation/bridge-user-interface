import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useDispatch } from "react-redux";

import { DialogTypes } from "@/constants/dialogs";

import { openDialog } from "@/state/dialogs";

import { useDydxClient } from "./useDydxClient";
import { useAccounts } from "./useAccounts";

const useRestrictionContext = () => {
  const { compositeClient } = useDydxClient();
  const { evmAddress, dydxAddress, disconnect } = useAccounts();
  const dispatch = useDispatch();

  const [sanctionedAddresses, setSanctionedAddresses] = useState<Set<string>>(
    new Set()
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
    async ({ addresses }: { addresses: string[] }) => {
      if (!compositeClient) return;

      try {
        const results = await Promise.all(
          addresses.map((address) =>
            compositeClient.indexerClient.utility.screen(address)
          )
        );

        const screenedAddresses = Object.fromEntries(
          addresses.map((address, index) => [
            address,
            results[index]?.restricted,
          ])
        );

        const toAdd = Object.entries(screenedAddresses)
          .filter(([, isSanctioned]) => isSanctioned)
          .map(([address]) => address);

        if (toAdd.length) {
          setSanctionedAddresses((prev) => new Set([...prev, ...toAdd]));
        }

        return screenedAddresses;
      } catch (error) {
        if (error.code === 403)
          dispatch(
            openDialog({
              type: DialogTypes.RestrictedGeo,
              openImmediately: true,
              dialogProps: { preventClose: true },
            })
          );
      }
    },
    [compositeClient, dispatch]
  );

  const isAddressSanctioned = useCallback(
    (address: string) => sanctionedAddresses.has(address),
    [sanctionedAddresses]
  );

  // Screen account addresses
  useEffect(() => {
    if (evmAddress) screenAddresses({ addresses: [evmAddress] });
  }, [compositeClient, evmAddress]);

  useEffect(() => {
    if (dydxAddress) screenAddresses({ addresses: [dydxAddress] });
  }, [compositeClient, dydxAddress]);

  useEffect(() => {
    if (
      (evmAddress && isAddressSanctioned(evmAddress)) ||
      (dydxAddress && isAddressSanctioned(dydxAddress))
    ) {
      restrictUser();
    }
  }, [evmAddress, dydxAddress, isAddressSanctioned]);

  return {
    screenAddresses,
    isAddressSanctioned,
    restrictUser,
  };
};

type RestrictionContextType = ReturnType<typeof useRestrictionContext>;
const RestrictionContext = createContext<RestrictionContextType>(
  {} as RestrictionContextType
);
RestrictionContext.displayName = "Restriction";

export const RestrictionProvider = ({ ...props }) => (
  <RestrictionContext.Provider value={useRestrictionContext()} {...props} />
);

export const useRestrictions = () => useContext(RestrictionContext);

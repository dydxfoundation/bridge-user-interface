import { createContext, useContext, useEffect, useState } from "react";

import {
  BECH32_PREFIX,
  CompositeClient,
  LocalWallet,
  onboarding,
  Network,
} from "@dydxprotocol/v4-client-js";

type DydxContextType = ReturnType<typeof useDydxClientContext>;
const DydxContext = createContext<DydxContextType>({} as DydxContextType);
DydxContext.displayName = "dYdXClient";

export const DydxProvider = ({ ...props }) => (
  <DydxContext.Provider value={useDydxClientContext()} {...props} />
);

export const useDydxClient = () => useContext(DydxContext);

const useDydxClientContext = () => {
  // ------ Client Initialization ------ //
  const [compositeClient, setCompositeClient] = useState<CompositeClient>();

  useEffect(() => {
    (async () => {
      try {
        const initializedClient = await CompositeClient.connect(
          Network.staging()
        );
        setCompositeClient(initializedClient);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  // ------ Wallet Methods ------ //
  const getWalletFromEvmSignature = async ({
    signature,
  }: {
    signature: string;
  }) => {
    const { mnemonic, privateKey, publicKey } =
      onboarding.deriveHDKeyFromEthereumSignature(signature);

    return {
      wallet: await LocalWallet.fromMnemonic(mnemonic, BECH32_PREFIX),
      mnemonic,
      privateKey,
      publicKey,
    };
  };

  return {
    // Client initialization
    compositeClient,

    // Wallet Methods
    getWalletFromEvmSignature,
  };
};

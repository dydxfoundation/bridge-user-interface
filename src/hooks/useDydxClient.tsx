import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  BECH32_PREFIX,
  CompositeClient,
  LocalWallet,
  onboarding,
  Network,
  ValidatorConfig,
  IndexerConfig,
} from '@dydxprotocol/v4-client-js';

import { DialogTypes } from '@/constants/dialogs';
import { openDialog } from '@/state/dialogs';

type DydxContextType = ReturnType<typeof useDydxClientContext>;
const DydxContext = createContext<DydxContextType>({} as DydxContextType);
DydxContext.displayName = 'dYdXClient';

export const DydxProvider = ({ ...props }) => (
  <DydxContext.Provider value={useDydxClientContext()} {...props} />
);

export const useDydxClient = () => useContext(DydxContext);

const useDydxClientContext = () => {
  // ------ Client Initialization ------ //
  const [compositeClient, setCompositeClient] = useState<CompositeClient>();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const initializedClient = await CompositeClient.connect(
          new Network(
            import.meta.env.VITE_NETWORK_ENVIRONMENT,
            new IndexerConfig(
              import.meta.env.VITE_NETWORK_INDEXER_REST_ENDPOINT,
              import.meta.env.VITE_NETWORK_INDEXER_WS_ENDPOINT
            ),
            new ValidatorConfig(
              import.meta.env.VITE_NEWORK_VALIDATOR_REST_ENDPOINT,
              import.meta.env.VITE_NETWORK_CHAIN_ID
            )
          )
        );

        setCompositeClient(initializedClient);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  // Check geo restriction
  useEffect(() => {
    if (!compositeClient) return;
    (async () => {
      try {
        await compositeClient.indexerClient.utility.getHeight();
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
    })();
  }, [compositeClient]);

  // ------ Wallet Methods ------ //
  const getWalletFromEvmSignature = async ({ signature }: { signature: string }) => {
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

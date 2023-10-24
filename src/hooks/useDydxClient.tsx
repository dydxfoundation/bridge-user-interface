import { createContext, useContext, useEffect, useState } from 'react';

import {
  BECH32_PREFIX,
  CompositeClient,
  LocalWallet,
  onboarding,
  Network,
  ValidatorConfig,
  IndexerConfig,
} from '@dydxprotocol/v4-client-js';

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
              import.meta.env.VITE_NETWORK_CHAIN_ID,
              {
                USDC_DENOM: import.meta.env.VITE_NETWORK_USDC_DENOM,
                USDC_DECIMALS: import.meta.env.VITE_NETWORK_USDC_DECIMALS,
                USDC_GAS_DENOM: '0uusdc',
                CHAINTOKEN_DENOM: import.meta.env.VITE_DYDX_DENOM,
                CHAINTOKEN_DECIMALS: import.meta.env.VITE_DYDX_DECIMALS,
                CHAINTOKEN_GAS_DENOM: '0adv4tnt',
              }
            )
          )
        );

        setCompositeClient(initializedClient);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

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

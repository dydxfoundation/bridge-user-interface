import { useCallback, useEffect, useState } from 'react';

import {
  useConnect as useConnectWagmi,
  useAccount as useAccountWagmi,
  useDisconnect as useDisconnectWagmi,
  useWalletClient as useWalletClientWagmi,
} from 'wagmi';

import { type EthereumAddress, WalletConnectionType, WalletType } from '@/constants/wallets';

import { LocalStorageKey } from '@/constants/localStorage';

import { resolveWagmiConnector } from '@/lib/wagmi';
import { getWalletConnection, parseWalletError } from '@/lib/wallet';

import { useLocalStorage } from './useLocalStorage';
import { useStringGetter } from './useStringGetter';

export const useWalletConnection = () => {
  const stringGetter = useStringGetter();

  // EVM wallet connection
  const [evmAddress, saveEvmAddress] = useLocalStorage<EthereumAddress | undefined>({
    key: LocalStorageKey.EvmAddress,
    defaultValue: undefined,
  });
  const { address: evmAddressWagmi, isConnected: isConnectedWagmi } = useAccountWagmi();
  const { data: signerWagmi } = useWalletClientWagmi();
  const { disconnectAsync: disconnectWagmi } = useDisconnectWagmi();

  useEffect(() => {
    // Cache last connected address
    if (evmAddressWagmi) saveEvmAddress(evmAddressWagmi);
  }, [evmAddressWagmi]);

  // Wallet connection

  const [walletType, setWalletType] = useLocalStorage<WalletType | undefined>({
    key: LocalStorageKey.OnboardingSelectedWalletType,
    defaultValue: undefined,
  });

  const [walletConnectionType, setWalletConnectionType] = useLocalStorage<
    WalletConnectionType | undefined
  >({
    key: LocalStorageKey.WalletConnectionType,
    defaultValue: undefined,
  });

  // Wallet connection

  const connectWagmiArgs =
    walletType && walletConnectionType
      ? {
          connector: resolveWagmiConnector({
            walletType,
            walletConnection: {
              type: walletConnectionType,
            },
          }),
        }
      : undefined;

  const { connectAsync: connectWagmi } = useConnectWagmi(connectWagmiArgs);

  const connectWallet = useCallback(
    async ({ walletType }: { walletType: WalletType }) => {
      const walletConnection = getWalletConnection({ walletType });

      try {
        if (!walletConnection) {
          throw new Error('Onboarding: No wallet connection found.');
        } else {
          if (!isConnectedWagmi) {
            await connectWagmi({
              connector: resolveWagmiConnector({
                walletType,
                walletConnection,
              }),
            });
          }
        }
      } catch (error) {
        throw Object.assign(
          new Error([error.message, error.cause?.message].filter(Boolean).join('\n')),
          {
            walletConnectionType: walletConnection?.type,
          }
        );
      }

      return {
        walletType,
        walletConnectionType: walletConnection.type,
      };
    },
    [isConnectedWagmi, signerWagmi]
  );

  const disconnectWallet = useCallback(async () => {
    saveEvmAddress(undefined);
    if (isConnectedWagmi) await disconnectWagmi();
  }, [isConnectedWagmi]);

  // Wallet selection

  const [selectedWalletType, setSelectedWalletType] = useState<WalletType | undefined>(walletType);
  const [selectedWalletError, setSelectedWalletError] = useState<string | React.ReactNode[]>();

  useEffect(() => {
    (async () => {
      setSelectedWalletError(undefined);

      if (selectedWalletType) {
        try {
          const { walletType, walletConnectionType } = await connectWallet({
            walletType: selectedWalletType,
          });

          setWalletType(walletType);
          setWalletConnectionType(walletConnectionType);
        } catch (error) {
          const { message } = parseWalletError({
            error,
            stringGetter,
          });

          if (message) {
            setSelectedWalletError(message);
          }
        }
      } else {
        setWalletType(undefined);
        setWalletConnectionType(undefined);

        await disconnectWallet();
      }
    })();
  }, [selectedWalletType, signerWagmi]);

  const selectWalletType = async (walletType: WalletType | undefined) => {
    if (selectedWalletType) {
      setSelectedWalletType(undefined);
      await new Promise(requestAnimationFrame);
    }

    setSelectedWalletType(walletType);
  };

  return {
    // Wallet connection
    walletType,
    walletConnectionType,

    // Wallet selection
    selectWalletType,
    selectedWalletType,
    selectedWalletError,

    // Wallet connection (EVM)
    evmAddress,
    evmAddressWagmi,
    signerWagmi,
  };
};

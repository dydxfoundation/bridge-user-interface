import type { ExternalProvider } from '@ethersproject/providers';

import { STRING_KEYS } from '@/constants/localization';

import { CoinbaseIcon, GenericWalletIcon, MetaMaskIcon, WalletConnectIcon } from '@/icons';

import { isMetaMask } from '@/lib/wallet/providers';

// Wallet connection types

export enum WalletConnectionType {
  CoinbaseWalletSdk = 'coinbaseWalletSdk',
  InjectedEip1193 = 'injectedEip1193',
  WalletConnect2 = 'walletConnect2',
}

export enum WalletErrorType {
  // General
  ChainMismatch,
  UserCanceled,

  // Non-Deterministic
  NonDeterministicWallet,

  // Misc
  Unknown,
}

type WalletConnectionTypeConfig = {
  name: string;
  wagmiConnectorId?: string;
};

export const walletConnectionTypes: Record<WalletConnectionType, WalletConnectionTypeConfig> = {
  [WalletConnectionType.CoinbaseWalletSdk]: {
    name: 'Coinbase Wallet SDK',
    wagmiConnectorId: 'coinbaseWallet',
  },
  [WalletConnectionType.InjectedEip1193]: {
    name: 'injected EIP-1193 provider',
    wagmiConnectorId: 'injected',
  },
  [WalletConnectionType.WalletConnect2]: {
    name: 'WalletConnect 2.0',
    wagmiConnectorId: 'walletConnect',
  },
};

// Wallets

export enum WalletType {
  CoinbaseWallet = 'COINBASE_WALLET',
  MetaMask = 'METAMASK',
  WalletConnect2 = 'WALLETCONNECT_2',
  OtherWallet = 'OTHER_WALLET',
}

export const DISPLAYED_WALLETS: WalletType[] = [
  WalletType.MetaMask,
  WalletType.WalletConnect2,
  WalletType.CoinbaseWallet,
  WalletType.OtherWallet,
];

type WalletConfig = {
  type: WalletType;
  stringKey: string;
  icon: string;
  connectionTypes: WalletConnectionType[];
  matchesInjectedEip1193?: (provider: ExternalProvider & any) => boolean;
  walletconnect2Id?: string;
};

export const wallets: Record<WalletType, WalletConfig> = {
  [WalletType.OtherWallet]: {
    type: WalletType.OtherWallet,
    stringKey: STRING_KEYS.OTHER_WALLET,
    icon: GenericWalletIcon,
    connectionTypes: [WalletConnectionType.InjectedEip1193, WalletConnectionType.WalletConnect2],
    matchesInjectedEip1193: (provider) =>
      Object.entries(wallets).every(
        ([walletType, walletConfig]) =>
          walletType === WalletType.OtherWallet ||
          !walletConfig.matchesInjectedEip1193 ||
          !walletConfig.matchesInjectedEip1193(provider)
      ),
  },
  [WalletType.CoinbaseWallet]: {
    type: WalletType.CoinbaseWallet,
    stringKey: STRING_KEYS.COINBASE_WALLET,
    icon: CoinbaseIcon,
    connectionTypes: [WalletConnectionType.CoinbaseWalletSdk, WalletConnectionType.InjectedEip1193],
    matchesInjectedEip1193: (provider) => provider.isCoinbaseWallet,
  },
  [WalletType.MetaMask]: {
    type: WalletType.MetaMask,
    stringKey: STRING_KEYS.METAMASK,
    icon: MetaMaskIcon,
    connectionTypes: [WalletConnectionType.InjectedEip1193, WalletConnectionType.WalletConnect2],
    matchesInjectedEip1193: isMetaMask,
    walletconnect2Id: 'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
  },
  [WalletType.WalletConnect2]: {
    type: WalletType.WalletConnect2,
    stringKey: STRING_KEYS.WALLET_CONNECT_2,
    icon: WalletConnectIcon,
    connectionTypes: [WalletConnectionType.WalletConnect2],
  },
};

// Injected EIP-1193 Providers
export type InjectedEthereumProvider = ExternalProvider;

export type InjectedWeb3Provider = ExternalProvider;

export type InjectedCoinbaseWalletExtensionProvider = InjectedEthereumProvider & {
  isMetaMask: true;
  overrideIsMetaMask: true;
  providerMap: Map<'MetaMask' | 'CoinbaseWallet', ExternalProvider>;
  providers: ExternalProvider[];
};

export type WithInjectedEthereumProvider = {
  ethereum: InjectedEthereumProvider;
};

export type WithInjectedWeb3Provider = {
  web3: {
    currentProvider: InjectedWeb3Provider;
  };
};

// Wallet connections

export type WalletConnection = {
  type: WalletConnectionType;
  provider?: ExternalProvider;
};

// dYdX Chain wallets

import { type onboarding } from '@dydxprotocol/v4-client-js';

export const COSMOS_DERIVATION_PATH = "m/44'/118'/0'/0/0";

/**
 * @description typed data to sign for dYdX Chain onboarding
 */
export const SIGN_TYPED_DATA = {
  primaryType: 'dYdX',
  domain: {
    name: 'dYdX Chain',
  },
  types: {
    dYdX: [{ name: 'action', type: 'string' }],
  },
  message: {
    action: 'dYdX Chain Onboarding',
  },
} as const;

export type PrivateInformation = ReturnType<typeof onboarding.deriveHDKeyFromEthereumSignature>;

export type EthereumAddress = `0x${string}`;
export type DydxAddress = `dydx${string}`;

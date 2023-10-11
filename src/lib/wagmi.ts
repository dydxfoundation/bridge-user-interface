import { createConfig, configureChains, mainnet, sepolia, Chain } from 'wagmi';

import { alchemyProvider } from 'wagmi/providers/alchemy';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import { isTruthy } from './isTruthy';

// Config

export const WAGMI_SUPPORTED_CHAINS: Chain[] = [mainnet, sepolia];

const { chains, publicClient, webSocketPublicClient } = configureChains(
  WAGMI_SUPPORTED_CHAINS,
  [
    import.meta.env.VITE_ALCHEMY_API_KEY &&
      alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_API_KEY }),
    jsonRpcProvider({
      rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }),
    }),
    publicProvider(),
  ].filter(isTruthy)
);

const injectedConnectorOptions = {
  chains,
  options: {
    name: 'Injected',
    shimDisconnect: true,
    shimChainChangedDisconnect: false,
  },
};

const walletconnect2ConnectorOptions: ConstructorParameters<typeof WalletConnectConnector>[0] = {
  chains,
  options: {
    projectId: import.meta.env.VITE_WALLETCONNECT2_PROJECT_ID,
    metadata: {
      name: 'dYdX',
      description: '',
      url: import.meta.env.VITE_APP_URL,
      icons: ['https://trade.dydx.exchange/cbw-image.png'],
    },
    showQrModal: true,
    qrModalOptions: {
      themeMode: 'dark' as const,
      themeVariables: {
        '--w3m-accent-color': '#5973fe',
        '--w3m-background-color': '#5973fe',
        '--w3m-color-bg-1': 'var(--color-layer-3)',
        '--w3m-color-bg-2': 'var(--color-layer-4)',
        '--w3m-color-bg-3': 'var(--color-layer-5)',
        '--w3m-font-family': 'var(--fontFamily-base)',
        '--w3m-font-feature-settings': 'none',
        '--w3m-overlay-backdrop-filter': 'blur(6px)',
        // '--w3m-logo-image-url': 'https://trade.dydx.exchange/cbw-image.png',
      },
      enableExplorer: true,
      explorerAllowList: [],
      explorerDenyList: [],
      chainImages: {},
    },
  },
};

const connectors = [
  new MetaMaskConnector({
    chains,
    options: {
      shimDisconnect: true,
    },
  }),
  new CoinbaseWalletConnector({
    chains,
    options: {
      appName: 'wagmi',
      reloadOnDisconnect: false,
    },
  }),
  new WalletConnectConnector(walletconnect2ConnectorOptions),
  new InjectedConnector(injectedConnectorOptions),
];

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

// Custom connectors

import type { ExternalProvider } from '@ethersproject/providers';

// Create a custom wagmi InjectedConnector using a specific injected EIP-1193 provider (instead of wagmi's default detection logic)
const createInjectedConnectorWithProvider = (provider: ExternalProvider) =>
  new (class extends InjectedConnector {
    getProvider = async () =>
      provider as unknown as Awaited<ReturnType<InjectedConnector['getProvider']>>;
  })(injectedConnectorOptions) as InjectedConnector;

const createWalletConnect2ConnectorWithId = (walletconnect2Id: string) =>
  new WalletConnectConnector({
    ...walletconnect2ConnectorOptions,
    options: {
      ...walletconnect2ConnectorOptions.options,
      qrModalOptions: {
        ...walletconnect2ConnectorOptions.options.qrModalOptions,
        explorerRecommendedWalletIds: [walletconnect2Id],
        explorerExcludedWalletIds: 'ALL',
        chainImages: {},
      },
    },
  });

// Custom connector from wallet selection
import {
  type WalletConnection,
  WalletConnectionType,
  type WalletType,
  walletConnectionTypes,
  wallets,
} from '@/constants/wallets';

export const resolveWagmiConnector = ({
  walletType,
  walletConnection,
}: {
  walletType: WalletType;
  walletConnection: WalletConnection;
}) => {
  const walletConfig = wallets[walletType];
  const walletConnectionConfig = walletConnectionTypes[walletConnection.type];

  return walletConnection.type === WalletConnectionType.InjectedEip1193 && walletConnection.provider
    ? createInjectedConnectorWithProvider(walletConnection.provider)
    : walletConnection.type === WalletConnectionType.WalletConnect2 && walletConfig.walletconnect2Id
    ? createWalletConnect2ConnectorWithId(walletConfig.walletconnect2Id)
    : connectors.find(({ id }: { id: string }) => id === walletConnectionConfig.wagmiConnectorId);
};

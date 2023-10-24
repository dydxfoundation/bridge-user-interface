/**
 * OnboardingSteps
 * 1. Choose wallet
 * 2. Key derivation
 *  a. If wallet has no dYdX Chain transactions and not on whitelist, sign twice (future)
 *   i. Success
 *   ii. Signatures don't match error (Wallet is non-deterministic)
 *  b. Success
 */
export enum OnboardingSteps {
  ChooseWallet = 'ChooseWallet',
  KeyDerivation = 'KeyDerivation',
}

/**
 * @description The three main OnboardingStates,
 * - Disconnected
 * - WalletConnected
 * - AccountConnected
 */
export enum OnboardingState {
  Disconnected = 'Disconnected',
  WalletConnected = 'WalletConnected',
  AccountConnected = 'AccountConnected',
}

export enum EvmDerivedAccountStatus {
  NotDerived,
  Deriving,
  EnsuringDeterminism,
  Derived,
}

import type { DydxAddress, EthereumAddress } from './wallets';

export type EvmDerivedAddresses = {
  version?: string;
  [EthereumAddress: EthereumAddress]: {
    encryptedSignature?: string;
    dydxAddress?: DydxAddress;
  };
};

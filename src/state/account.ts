import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';

import { OnboardingState } from '@/constants/account';
import { LocalStorageKey } from '@/constants/localStorage';
import { WalletType } from '@/constants/wallets';

import { getLocalStorage } from '@/lib/localStorage';

export type AccountState = {
  onboardingState: OnboardingState;

  walletType?: WalletType;
};

const initialState: AccountState = {
  onboardingState: OnboardingState.Disconnected,
  walletType: getLocalStorage<WalletType>({
    key: LocalStorageKey.OnboardingSelectedWalletType,
  }),
};

export const accountSlice = createSlice({
  name: 'Account',
  initialState,
  reducers: {
    setOnboardingState: (state, action: PayloadAction<OnboardingState>) => ({
      ...state,
      onboardingState: action.payload,
    }),
  },
});

export const { setOnboardingState } = accountSlice.actions;

import { createSelector } from 'reselect';

import { OnboardingState, OnboardingSteps } from '@/constants/account';

import { getOnboardingState } from '@/state/accountSelectors';

export const calculateOnboardingStep = createSelector(
  [getOnboardingState],
  (onboardingState: OnboardingState) => {
    return {
      [OnboardingState.Disconnected]: OnboardingSteps.ChooseWallet,
      [OnboardingState.WalletConnected]: OnboardingSteps.KeyDerivation,
      [OnboardingState.AccountConnected]: undefined,
    }[onboardingState];
  }
);

export const calculateCanAccountMigrate = createSelector(
  [getOnboardingState],
  (onboardingState: OnboardingState) => {
    return onboardingState === OnboardingState.AccountConnected;
  }
);

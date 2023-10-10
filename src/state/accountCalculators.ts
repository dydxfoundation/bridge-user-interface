import { createSelector } from 'reselect';

import { OnboardingState, OnboardingSteps } from '@/constants/account';

import { getOnboardingGuards, getOnboardingState } from '@/state/accountSelectors';

export const calculateOnboardingStep = createSelector(
  [getOnboardingState, getOnboardingGuards],
  (onboardingState: OnboardingState, onboardingGuards: ReturnType<typeof getOnboardingGuards>) => {
    const { hasAcknowledgedTerms } = onboardingGuards;

    return {
      [OnboardingState.Disconnected]: OnboardingSteps.ChooseWallet,
      [OnboardingState.WalletConnected]: OnboardingSteps.KeyDerivation,
      [OnboardingState.AccountConnected]: !hasAcknowledgedTerms
        ? OnboardingSteps.AcknowledgeTerms
        : undefined,
    }[onboardingState];
  }
);

export const calculateCanAccountMigrate = createSelector(
  [getOnboardingState],
  (onboardingState: OnboardingState) => {
    return onboardingState === OnboardingState.AccountConnected;
  }
);

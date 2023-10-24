import { type ElementType, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled, { AnyStyledComponent, css } from 'styled-components';

import { DialogProps } from '@/constants/dialogs';
import { STRING_KEYS } from '@/constants/localization';
import { EvmDerivedAccountStatus, OnboardingSteps } from '@/constants/account';
import { wallets } from '@/constants/wallets';

import { useAccounts, useBreakpoints, useStringGetter } from '@/hooks';

import breakpoints from '@/styles/breakpoints';
import { layoutMixins } from '@/styles/layoutMixins';

import { calculateOnboardingStep } from '@/state/accountCalculators';

import { Dialog, DialogPlacement } from '@/components/Dialog';
import { Icon, IconName } from '@/components/Icon';
import { Ring } from '@/components/Ring';

import { ChooseWallet } from './OnboardingDialog/ChooseWallet';
import { GenerateKeys } from './OnboardingDialog/GenerateKeys';

export const OnboardingDialog = ({ setIsOpen }: DialogProps) => {
  const [derivationStatus, setDerivationStatus] = useState(EvmDerivedAccountStatus.NotDerived);

  const stringGetter = useStringGetter();
  const { isMobile } = useBreakpoints();

  const { walletType } = useAccounts();

  const currentOnboardingStep = useSelector(calculateOnboardingStep);

  useEffect(() => {
    if (!currentOnboardingStep) setIsOpen?.(false);
  }, [currentOnboardingStep]);

  return (
    <Styled.Dialog
      isOpen={Boolean(currentOnboardingStep)}
      setIsOpen={setIsOpen}
      {...(currentOnboardingStep &&
        {
          [OnboardingSteps.ChooseWallet]: {
            title: stringGetter({ key: STRING_KEYS.CONNECT_YOUR_WALLET }),
            description: stringGetter({ key: STRING_KEYS.CONNECT_YOUR_WALLET_SUBTITLE }),
            children: (
              <Styled.Content>
                <ChooseWallet />
              </Styled.Content>
            ),
          },
          [OnboardingSteps.KeyDerivation]: {
            slotIcon: {
              [EvmDerivedAccountStatus.NotDerived]: walletType && (
                <Icon iconComponent={wallets[walletType]?.icon as ElementType} />
              ),
              [EvmDerivedAccountStatus.Deriving]: <Styled.Ring withAnimation value={0.25} />,
              [EvmDerivedAccountStatus.EnsuringDeterminism]: (
                <Styled.Ring withAnimation value={0.25} />
              ),
              [EvmDerivedAccountStatus.Derived]: <Icon iconName={IconName.CheckCircle} />,
            }[derivationStatus],
            title: stringGetter({ key: STRING_KEYS.SIGN_MESSAGE }),
            description: stringGetter({
              key: STRING_KEYS.SIGNATURE_CREATES_COSMOS_WALLET,
            }),
            children: (
              <Styled.Content>
                <GenerateKeys status={derivationStatus} setStatus={setDerivationStatus} />
              </Styled.Content>
            ),
            width: '23rem',
          },
        }[currentOnboardingStep])}
      placement={isMobile ? DialogPlacement.FullScreen : DialogPlacement.Default}
    />
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Content = styled.div`
  ${layoutMixins.flexColumn}
  gap: 1rem;
`;

Styled.Dialog = styled(Dialog)<{ width?: string }>`
  @media ${breakpoints.notMobile} {
    ${({ width }) =>
      width &&
      css`
        --dialog-width: ${width};
      `}
  }

  --dialog-icon-size: 1.25rem;
`;

Styled.Ring = styled(Ring)`
  width: 1.25rem;
  height: 1.25rem;
`;

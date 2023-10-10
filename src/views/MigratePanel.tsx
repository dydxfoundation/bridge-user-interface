import { FormEvent } from 'react';
import styled, { AnyStyledComponent } from 'styled-components';

import breakpoints from '@/styles/breakpoints';
import { formMixins } from '@/styles/formMixins';
import { layoutMixins } from '@/styles/layoutMixins';

import { STRING_KEYS } from '@/constants/localization';
import { MigrateFormSteps, TransactionStatus } from '@/constants/migrate';

import { useStringGetter, useMigrateToken } from '@/hooks';

import { Icon, IconName } from '@/components/Icon';
import { Panel } from '@/components/Panel';
import { Ring } from '@/components/Ring';
import { VerticalSeparator } from '@/components/Separator';

import { MigrateFormEditingStep } from './MigrateForm/EditingStep/MigrateFormEditingStep';
import { MigrateFormPreviewStep } from './MigrateForm/PreviewStep/MigrateFormPreviewStep';
import { MigrateFormConfirmedStep } from './MigrateForm/ConfirmedStep/MigrateFormConfirmedStep';

export const MigratePanel = () => {
  const stringGetter = useStringGetter();

  const { currentStep, onFormSubmit, transactionStatus, bridgeTxError } = useMigrateToken();

  const { slotIcon, title, subtitle, content } = {
    [MigrateFormSteps.Edit]: {
      slotIcon: <Icon iconName={IconName.Migrate} />,
      title: stringGetter({ key: STRING_KEYS.MIGRATE }),
      subtitle: stringGetter({
        key: STRING_KEYS.FROM_TO,
        params: {
          FROM: <strong>Ethereum</strong>,
          TO: <strong>dYdX Chain</strong>,
        },
      }),
      content: <MigrateFormEditingStep />,
    },
    [MigrateFormSteps.Preview]: {
      title: stringGetter({ key: STRING_KEYS.CONFIRM_MIGRATION }),
      subtitle: stringGetter({
        key: STRING_KEYS.TO,
        params: {
          TO: <strong>dYdX Chain</strong>,
        },
      }),
      content: <MigrateFormPreviewStep />,
    },
    [MigrateFormSteps.Confirmed]: {
      slotIcon:
        transactionStatus >= TransactionStatus.Finalized ? (
          <Icon iconName={IconName.CheckCircle} />
        ) : bridgeTxError ? (
          <Icon iconName={IconName.CautionCircle} />
        ) : (
          <Ring withAnimation value={0.25} />
        ),
      title: stringGetter({
        key:
          transactionStatus >= TransactionStatus.Finalized
            ? STRING_KEYS.SENDING_SUCCESSFUL
            : bridgeTxError
            ? STRING_KEYS.MIGRATION_FAILED
            : STRING_KEYS.SENDING_IN_PROGRESS,
      }),
      content: <MigrateFormConfirmedStep />,
    },
  }[currentStep];

  return (
    <Styled.MigrateCard
      slotHeader={
        <Styled.Header>
          <h3>
            {slotIcon}
            {title}
          </h3>
          {subtitle && (
            <>
              <Styled.VerticalSeparator />
              <span>{subtitle}</span>
            </>
          )}
        </Styled.Header>
      }
    >
      <Styled.Form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          onFormSubmit();
        }}
      >
        {content}
      </Styled.Form>
    </Styled.MigrateCard>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.MigrateCard = styled(Panel)`
  width: 26rem;
  max-width: 100%;
  height: fit-content;

  @media ${breakpoints.tablet} {
    padding-top: 0;
    width: 100%;
    background-color: var(--color-layer-2);
  }
`;

Styled.Header = styled.div`
  ${layoutMixins.inlineRow}
  gap: 1ch;

  font: var(--font-small-book);
  color: var(--color-text-0);

  h3 {
    ${layoutMixins.inlineRow}
    font: var(--font-large-book);
    color: var(--color-text-2);

    svg {
      font-size: 1.75rem;
    }
  }

  span {
    margin-top: 0.2rem;
  }
`;

Styled.VerticalSeparator = styled(VerticalSeparator)`
  z-index: 1;

  && {
    height: 1.5rem;
  }

  @media ${breakpoints.tablet} {
    display: none;
  }
`;

Styled.Form = styled.form`
  ${formMixins.inputsColumn}
  gap: 1.25rem;
  overflow-y: hidden;
`;

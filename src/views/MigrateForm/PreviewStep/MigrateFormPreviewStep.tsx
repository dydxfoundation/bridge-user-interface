import { useState } from 'react';

import styled, { type AnyStyledComponent } from 'styled-components';

import { AlertType } from '@/constants/alerts';
import { ButtonAction, ButtonType } from '@/constants/buttons';
import { STRING_KEYS } from '@/constants/localization';

import { layoutMixins } from '@/styles/layoutMixins';

import { useMigrateToken, useStringGetter } from '@/hooks';

import { AlertMessage } from '@/components/AlertMessage';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { Tag } from '@/components/Tag';
import { DetailsReceipt } from '@/components/DetailsReceipt';
import { Icon, IconName } from '@/components/Icon';

import { TokensBeforeAfterDiagram } from '../TokensBeforeAfterDiagram';

export const MigrateFormPreviewStep = () => {
  const stringGetter = useStringGetter();

  const {
    resetForm,
    errorMsg,
    needTokenAllowance,
    isAmountValid,
    isApproveTokenLoading,
    approveTokenTxError,
    isBridgePending,
  } = useMigrateToken();

  const [hasAcknowledgedDuration, setHasAcknowledgedDuration] = useState(false);
  const [hasAcknowledgedLocked, setHasAcknowledgedLocked] = useState(false);

  return (
    <>
      <TokensBeforeAfterDiagram />

      <DetailsReceipt
        header={stringGetter({ key: STRING_KEYS.ESTIMATED_TIMELINE })}
        headerIcon={<Icon iconName={IconName.Time} />}
        detailItems={[
          {
            key: 'eth_settlement',
            label: stringGetter({ key: STRING_KEYS.ETHEREUM_SETTLEMENT }),
            value: (
              <Tag>
                {stringGetter({
                  key: STRING_KEYS.X_SECONDS_LOWERCASED,
                  params: { X: '0-12' },
                })}
              </Tag>
            ),
          },
          {
            key: 'eth_finalization',
            label: stringGetter({ key: STRING_KEYS.ETHEREUM_FINALIZATION }),
            value: (
              <Tag>
                {stringGetter({
                  key: STRING_KEYS.X_MINUTES_LOWERCASED,
                  params: { X: '~20' },
                })}
              </Tag>
            ),
          },
          {
            key: 'dydx_settlement',
            label: stringGetter({ key: STRING_KEYS.DYDX_CHAIN_SETTLEMENT }),
            tooltip: 'dydx-chain-settlement',
            value: (
              <Tag>
                {stringGetter({
                  key: STRING_KEYS.X_HOURS_LOWERCASED,
                  params: { X: '~40' },
                })}
              </Tag>
            ),
          },
        ]}
      />

      {(errorMsg || approveTokenTxError) && (
        <AlertMessage type={AlertType.Error}>
          {errorMsg || approveTokenTxError?.message}
        </AlertMessage>
      )}

      {!needTokenAllowance && (
        <>
          <Checkbox
            checked={hasAcknowledgedDuration}
            onCheckedChange={setHasAcknowledgedDuration}
            id="acknowledge-duration"
            label={stringGetter({
              key: STRING_KEYS.CONFIRM_MIGRATION_DISCLAIMER_1,
            })}
          />
          <Checkbox
            checked={hasAcknowledgedLocked}
            onCheckedChange={setHasAcknowledgedLocked}
            id="acknowledge-locked"
            label={stringGetter({
              key: STRING_KEYS.CONFIRM_MIGRATION_DISCLAIMER_2,
            })}
          />
        </>
      )}

      <Styled.ButtonRow>
        <Styled.EditButton onClick={() => resetForm(false)}>
          {stringGetter({ key: STRING_KEYS.EDIT })}
        </Styled.EditButton>

        <Styled.ConfirmButton
          action={ButtonAction.Primary}
          type={ButtonType.Submit}
          state={{
            isLoading: isApproveTokenLoading || isBridgePending,
            isDisabled:
              (!needTokenAllowance && !(hasAcknowledgedDuration && hasAcknowledgedLocked)) ||
              isBridgePending ||
              !isAmountValid,
          }}
        >
          {stringGetter({
            key: needTokenAllowance ? STRING_KEYS.APPROVE_ALLOWANCE : STRING_KEYS.CONFIRM_MIGRATION,
          })}
        </Styled.ConfirmButton>
      </Styled.ButtonRow>
    </>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.ButtonRow = styled.div`
  ${layoutMixins.inlineRow}
  gap: var(--form-input-gap);

  > button {
    padding: 0.75rem 1rem;
  }
`;

Styled.EditButton = styled(Button)`
  --button-backgroundColor: var(--color-layer-5);
  --color-border: var(--color-layer-6);
`;

Styled.ConfirmButton = styled(Button)`
  width: 100%;
`;

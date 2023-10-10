import styled, { AnyStyledComponent } from 'styled-components';
import { useDispatch } from 'react-redux';
import { Close } from '@radix-ui/react-dialog';

import { ButtonAction } from '@/constants/buttons';
import { DialogProps } from '@/constants/dialogs';
import { STRING_KEYS } from '@/constants/localization';

import { layoutMixins } from '@/styles/layoutMixins';

import { useAccounts, useStringGetter } from '@/hooks';

import { Button } from '@/components/Button';
import { Dialog } from '@/components/Dialog';

import { closeDialog } from '@/state/dialogs';

export const DisconnectDialog = ({ setIsOpen }: DialogProps) => {
  const stringGetter = useStringGetter();
  const dispatch = useDispatch();

  const { disconnect } = useAccounts();

  const onCancel = () => {
    dispatch(closeDialog());
  };

  return (
    <Dialog isOpen setIsOpen={setIsOpen} title="Disconnect">
      <Styled.Content>
        <p>{stringGetter({ key: STRING_KEYS.DISCONNECT_CONFIRMATION })}</p>
        <Styled.ButtonRow>
          <Close asChild>
            <Button action={ButtonAction.Destroy} onClick={disconnect}>
              {stringGetter({ key: STRING_KEYS.DISCONNECT })}
            </Button>
          </Close>
          <Close asChild>
            <Button onClick={onCancel}>{stringGetter({ key: STRING_KEYS.CANCEL })}</Button>
          </Close>
        </Styled.ButtonRow>
      </Styled.Content>
    </Dialog>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.ButtonRow = styled.div`
  ${layoutMixins.row}

  gap: 0.5rem;
  justify-content: end;
`;

Styled.Content = styled.div`
  ${layoutMixins.column}
  gap: 1rem;
`;

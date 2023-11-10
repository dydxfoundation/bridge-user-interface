import { useState } from 'react';
import styled, { AnyStyledComponent } from 'styled-components';
import { useDispatch } from 'react-redux';
import { Close } from '@radix-ui/react-dialog';

import { ButtonAction } from '@/constants/buttons';
import { STRING_KEYS } from '@/constants/localization';
import { AppRoute } from '@/constants/routes';

import { layoutMixins } from '@/styles/layoutMixins';

import { useAccounts, useStringGetter } from '@/hooks';

import { Button } from '@/components/Button';
import { Dialog } from '@/components/Dialog';
import { closeDialog } from '@/state/dialogs';
import { Checkbox } from '@/components/Checkbox';
import { Link } from '@/components/Link';

type ElementProps = {
  setIsOpen?: (open: boolean) => void;
};

export const AcknowledgeTermsDialog = ({ setIsOpen }: ElementProps) => {
  const stringGetter = useStringGetter();
  const dispatch = useDispatch();
  const { saveHasAcknowledgedTerms } = useAccounts();

  const [hasAcknowledged, setHasAcknowledged] = useState(false);

  const onContinue = () => {
    saveHasAcknowledgedTerms(true);
    dispatch(closeDialog());
  };

  return (
    <Dialog
      isOpen
      preventClose
      setIsOpen={setIsOpen}
      title={stringGetter({ key: STRING_KEYS.ACKNOWLEDGE_TERMS })}
    >
      <Styled.Content>
        <Checkbox
          id="acknowledge-terms"
          checked={hasAcknowledged}
          onCheckedChange={setHasAcknowledged}
          label={
            <Styled.Label>
              I have read and agree to the <Link href={`/#${AppRoute.Terms}`}>Terms of Use</Link>{' '}
              and <Link href={`/#${AppRoute.Privacy}`}>Privacy Policy</Link>.
            </Styled.Label>
          }
        />

        <Close asChild>
          <Button
            action={ButtonAction.Primary}
            onClick={onContinue}
            state={{ isDisabled: !hasAcknowledged }}
          >
            {stringGetter({ key: STRING_KEYS.CONTINUE })}
          </Button>
        </Close>
      </Styled.Content>
    </Dialog>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Content = styled.div`
  ${layoutMixins.column}
  gap: 1rem;
  margin-top: var(--border-width);
`;

Styled.Label = styled.span`
  display: inline-block;
  font: var(--font-base-book);
  color: var(--color-text-3);

  a {
    display: inline-block;
    --link-color: var(--color-text-2);
  }
`;

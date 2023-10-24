import { useState } from 'react';
import styled, { AnyStyledComponent } from 'styled-components';
import { CaretDownIcon } from '@radix-ui/react-icons';

import { STRING_KEYS } from '@/constants/localization';

import { layoutMixins } from '@/styles/layoutMixins';
import breakpoints from '@/styles/breakpoints';

import { useStringGetter } from '@/hooks';

import { ToggleButton } from '@/components/ToggleButton';

import { PendingMigrationsTable } from './PendingMigrationsTable';

export const PendingMigrationsPage = () => {
  const stringGetter = useStringGetter();
  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <Styled.Container>
      <Styled.Description>
        <p>
          {stringGetter({ key: STRING_KEYS.PENDING_MIGRATIONS_DESCRIPTION_I })}
          {!showFullDescription && '..'}
        </p>
        {showFullDescription && (
          <>
            <p>
              {stringGetter({
                key: STRING_KEYS.PENDING_MIGRATIONS_DESCRIPTION_II,
              })}
            </p>
            <p>
              {stringGetter({
                key: STRING_KEYS.PENDING_MIGRATIONS_DESCRIPTION_III,
              })}
            </p>
          </>
        )}
        <Styled.ViewMoreToggle
          onPressedChange={setShowFullDescription}
          slotRight={<CaretDownIcon />}
        >
          {stringGetter({
            key: showFullDescription ? STRING_KEYS.VIEW_LESS : STRING_KEYS.VIEW_MORE,
          })}
        </Styled.ViewMoreToggle>
      </Styled.Description>
      <PendingMigrationsTable />
    </Styled.Container>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Container = styled.section`
  ${layoutMixins.flexColumn}
  gap: 1rem;

  > * {
    width: 49.25rem;
    max-width: 100%;
  }
`;

Styled.Description = styled.div`
  font: var(--font-base-book);
  color: var(--color-text-0);
  padding: 0 0.75rem;

  p:not(:last-of-type) {
    margin-bottom: 1rem;
  }

  @media ${breakpoints.tablet} {
    padding: 0 2.25rem;
  }
`;

Styled.ViewMoreToggle = styled(ToggleButton)`
  --button-toggle-off-backgroundColor: transparent;
  --button-toggle-off-textColor: var(--color-text-1);
  --button-toggle-on-backgroundColor: transparent;
  --button-toggle-on-textColor: var(--color-text-1);
  --button-border: none;
  --button-padding: 0;

  &[data-state='on'] {
    svg {
      rotate: 0.5turn;
    }
  }
`;

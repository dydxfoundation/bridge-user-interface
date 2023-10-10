import styled, { AnyStyledComponent } from 'styled-components';

import { HelpPanel } from './HelpPanel';
import { MigratePanel } from './MigratePanel';
import { layoutMixins } from '@/styles/layoutMixins';
import breakpoints from '@/styles/breakpoints';

export const MigratePage = () => {
  return (
    <Styled.Container>
      <MigratePanel />
      <HelpPanel />
    </Styled.Container>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Container = styled.section`
  ${layoutMixins.gridConstrainedColumns}

  --column-gap: 2rem;
  --column-min-width: 21.25rem;
  --column-max-width: 26rem;

  @media ${breakpoints.tablet} {
    ${layoutMixins.flexColumn}
    width: 49.25rem;
    max-width: 100%;
    gap: 2rem;
  }
`;

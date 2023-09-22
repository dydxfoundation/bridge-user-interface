import styled, { AnyStyledComponent } from "styled-components";

import { layoutMixins } from "@/styles/layoutMixins";

export const PendingMigrationsPage = () => {
  return (
    <Styled.Container>
      <p>
        Pending migrations will appear on this table a few minutes after the
        corresponding Ethereum transaction has been finalized (finalization
        typically takes 20 minutes).
      </p>
      <h3>Coming soon</h3>
    </Styled.Container>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Container = styled.section`
  ${layoutMixins.flexColumn}
  gap: 1rem;

  > * {
    padding: 0 0.75rem;
    width: 49.25rem;
    max-width: 100%;
  }

  p {
    font: var(--font-base-book);
    color: var(--color-text-0);
  }
`;

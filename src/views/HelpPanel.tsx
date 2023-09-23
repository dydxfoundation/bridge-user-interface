import styled, { AnyStyledComponent } from "styled-components";

import breakpoints from "@/styles/breakpoints";

import { layoutMixins } from "@/styles/layoutMixins";

import { Link } from "@/components/Link";
import { Panel } from "@/components/Panel";

export const HelpPanel = () => {
  return (
    <Styled.HelpCard
      slotHeader={
        <Styled.Header>
          <h3>Migration help</h3>
          <Link
            withIcon
            href="https://www.dydx.foundation/blog/update-on-exploring-the-future-of-dydx"
          >
            Learn More
          </Link>
        </Styled.Header>
      }
    >
      Coming soon
    </Styled.HelpCard>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.HelpCard = styled(Panel)`
  width: 21.25rem;
  max-width: 100%;
  height: max-content;

  @media ${breakpoints.tablet} {
    padding-top: 0;
    width: 100%;
    background-color: var(--color-layer-2);
  }
`;

Styled.Header = styled.div`
  ${layoutMixins.spacedRow}
  gap: 1ch;

  font: var(--font-small-book);

  h3 {
    font: var(--font-medium-book);
    color: var(--color-text-2);
  }
`;

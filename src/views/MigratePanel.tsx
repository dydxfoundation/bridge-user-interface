import styled, { AnyStyledComponent } from "styled-components";

import breakpoints from "@/styles/breakpoints";
import { layoutMixins } from "@/styles/layoutMixins";

import { Icon, IconName } from "@/components/Icon";
import { Panel } from "@/components/Panel";
import { VerticalSeparator } from "@/components/Separator";

export const MigratePanel = () => {
  return (
    <Styled.MigrateCard
      slotHeader={
        <Styled.Header>
          <h3>
            <Icon iconName={IconName.DYDX} />
            Migrate
          </h3>
          <Styled.VerticalSeparator />
          <span>
            from <b>Ethereum</b> to <b>dYdX Chain</b>
          </span>
        </Styled.Header>
      }
    ></Styled.MigrateCard>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.MigrateCard = styled(Panel)`
  max-width: 25rem;
  width: 100%;

  @media ${breakpoints.tablet} {
    max-width: 100%;
  }
`;

Styled.Header = styled.div`
  ${layoutMixins.inlineRow}
  gap: 1ch;

  h3 {
    ${layoutMixins.inlineRow}
    font: var(--font-large-book);
    color: var(--color-text-2);

    svg {
      font-size: 1.75rem;
    }
  }

  span {
    color: var(--color-text-0);
    b {
      color: var(--color-text-1);
    }
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

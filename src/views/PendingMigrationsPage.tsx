import { useState } from "react";
import styled, { AnyStyledComponent } from "styled-components";
import { CaretDownIcon } from "@radix-ui/react-icons";

import { layoutMixins } from "@/styles/layoutMixins";
import breakpoints from "@/styles/breakpoints";

import { ToggleButton } from "@/components/ToggleButton";

export const PendingMigrationsPage = () => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <Styled.Container>
      <Styled.Description>
        <p>
          This table displays all Pending Migrations, which settle DYDX
          migrations on dYdX Chain. To view new or updated entries, you'll need
          to refresh the page. Migrations will appear on this table a few
          minutes after the corresponding Ethereum tx has been finalized
          (finalization typically takes 20 minutes).
        </p>
        {showFullDescription && (
          <>
            <p>
              Once a Pending Migration is listed, users can track the dYdX Chain
              block in which it will settle and be transferred to the dYdX Chain
              address. Please note that the estimated time shown is only an
              approximation, as it can vary due to dYdX Chain block time
              fluctuations.
            </p>
            <p>
              Once a Pending Migration has settled, it will be removed from this
              table upon refreshing the page.
            </p>
          </>
        )}
        <Styled.ViewMoreToggle
          onPressedChange={setShowFullDescription}
          slotRight={<CaretDownIcon />}
        >
          {showFullDescription ? "View less" : "View more"}
        </Styled.ViewMoreToggle>
      </Styled.Description>
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

    @media ${breakpoints.tablet} {
      padding: 0 2.25rem;
    }
  }
`;

Styled.Description = styled.div`
  font: var(--font-base-book);
  color: var(--color-text-0);

  p:not(:last-of-type) {
    margin-bottom: 1rem;
  }
`;

Styled.ViewMoreToggle = styled(ToggleButton)`
  --button-toggle-off-backgroundColor: transparent;
  --button-toggle-off-textColor: var(--color-text-1);
  --button-toggle-on-backgroundColor: transparent;
  --button-toggle-on-textColor: var(--color-text-1);
  --button-border: none;
  --button-padding: 0;

  &[data-state="on"] {
    svg {
      rotate: 0.5turn;
    }
  }
`;

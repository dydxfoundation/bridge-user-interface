import { useState } from "react";
import styled, { AnyStyledComponent } from "styled-components";
import { CaretDownIcon } from "@radix-ui/react-icons";

import { layoutMixins } from "@/styles/layoutMixins";
import breakpoints from "@/styles/breakpoints";

import { ToggleButton } from "@/components/ToggleButton";

import { PendingMigrationsTable } from "./PendingMigrationsTable";

export const PendingMigrationsPage = () => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <Styled.Container>
      <Styled.Description>
        <p>
          This table lists all ongoing token migrations from Ethereum to the
          dYdX Chain. It refreshes periodically or upon a manual page reload.
          New entries will appear a few minutes after their corresponding
          Ethereum transactions finalize, which typically takes around 20
          minutes.{!showFullDescription && ".."}
        </p>
        {showFullDescription && (
          <>
            <p>
              Once a pending migration is listed, you can track the dYdX Chain
              block where tokens will be transferred. Please note that the
              estimated time shown is only an approximation, as it can vary due
              to dYdX Chain block time fluctuations.
            </p>
            <p>
              Once the migration has settled, it will be removed from this table
              during the next automatic update or when the page is manually
              refreshed.
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

  &[data-state="on"] {
    svg {
      rotate: 0.5turn;
    }
  }
`;

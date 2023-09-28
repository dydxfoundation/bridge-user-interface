import styled, { AnyStyledComponent } from "styled-components";

import breakpoints from "@/styles/breakpoints";

import { layoutMixins } from "@/styles/layoutMixins";

import { Accordion } from "@/components/Accordion";
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
      <Accordion
        items={[
          {
            header: "What is the v4 Portal?",
            content: (
              <p>
                The dYdX Community elected to migrate Ethereum-based DYDX to
                dYdX Chain (vote{" "}
                <Styled.Link
                  withIcon
                  href="https://dydx.community/dashboard/proposal/15"
                >
                  here
                </Styled.Link>
                ). This portal assists Ethereum-based DYDX holders to engage
                with the Ethereum smart contract to migrate their DYDX tokens
                from Ethereum to dYdX Chain.
              </p>
            ),
          },
          {
            header: "What tokens will I receive?",
            content:
              "Holders who successfully engage with the portal will receive wethDYDX on Ethereum and DYDX on dYdX Chain.",
          },
          {
            header: "How long should the migration take?",
            content:
              "Once Ethereum-based DYDX is successfully sent to the Ethereum smart contract, a holder will receive wethDYDX immediately. dYdX Chain validators will acknowledge the Ethereum tx after it is finalized (which takes roughly 25 minutes). After dYdX Chain validators acknowledge the Ethereum tx, dYdX Chain DYDX settlement will be delayed for 86400 blocks, which translates into roughly 38.5 hours. After the 86400 block delay, dYdX Chain validators will send the dYdX Chain address the specified amount of DYDX. ",
          },
          {
            header: "How can I track the status of my migration?",
            content:
              "Once your Ethereum tx has been finalized (which takes roughly 25 minutes), you can track your pending dYdX Chain migration in Pending Migrations tab. You can filter the table by pasting a dYdX Chain address to see all of its pending migrations. Once the pending migration has settled to the dYdX Chain Address, the pending migration will no longer be shown in the table.",
          },
          {
            header: "Do I have to pay gas fees?",
            content:
              "Yes, holders who engage with the portal will have to pay gas costs on Ethereum. Users will not have to pay gas costs on dYdX Chain.",
          },
          {
            header: "What address can I send dYdX Chain DYDX to?",
            content:
              "Users who interact with the portal can send dYdX Chain DYDX tokens to any dYdX Chain address. User’s can send tokens directly to their dYdX Chain address that is automatically created from their Ethereum address’s signature.",
          },
          {
            header: "What are wrapped Ethereum DYDX tokens (“wethDYDX”)?",
            content:
              "wethDYDX are minted 1:1 to any users who successfully send Ethereum-based DYDX to the smart contract. wethDYDX have the same v3 governance rights as Ethereum-based DYDX, and are transferable. wethDYDX cannot be bridged to v4.",
          },
        ]}
      />
    </Styled.HelpCard>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.HelpCard = styled(Panel)`
  width: 21.25rem;
  max-width: 100%;
  height: max-content;
  padding: 0;
  gap: 0;

  @media ${breakpoints.tablet} {
    padding-top: 0;
    width: 100%;
    background-color: var(--color-layer-2);
  }
`;

Styled.Header = styled.div`
  ${layoutMixins.spacedRow}
  gap: 1ch;

  padding: 1.25rem 1.5rem;
  border-bottom: var(--border-width) solid var(--border-color);

  font: var(--font-small-book);

  h3 {
    font: var(--font-medium-book);
    color: var(--color-text-2);
  }
`;

Styled.Link = styled(Link)`
  display: inline-flex;
`;

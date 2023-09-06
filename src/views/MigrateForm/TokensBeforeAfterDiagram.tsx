import styled, { type AnyStyledComponent } from "styled-components";

import { layoutMixins } from "@/styles/layoutMixins";

import { useMigrateToken } from "@/hooks";

import { Details } from "@/components/Details";
import { Icon, IconName } from "@/components/Icon";
import { Tag } from "@/components/Tag";
import { Output, OutputType, ShowSign } from "@/components/Output";

export const TokensBeforeAfterDiagram = () => {
  const { amountBN } = useMigrateToken();

  const detailItems = [
    {
      key: "before",
      label: "Before",
      value: (
        <Styled.ValueContainer>
          <Styled.TokenColumn>
            <Styled.TokenIcon>
              <Icon iconName={IconName.DYDX} />
              <Icon iconName={IconName.Eth} />
            </Styled.TokenIcon>

            <Tag>dv3tnt</Tag>
            <span>on Ethereum</span>
          </Styled.TokenColumn>
        </Styled.ValueContainer>
      ),
    },
    {
      key: "after",
      label: "After",
      value: (
        <Styled.ValueContainer>
          <Styled.TokenColumn>
            <Styled.TokenIcon>
              <Icon iconName={IconName.DYDX} />
              <Icon iconName={IconName.Eth} />
            </Styled.TokenIcon>

            <Styled.Output
              value={amountBN}
              type={OutputType.Asset}
              fractionDigits={0}
              showSign={ShowSign.Both}
            />
            <Tag>wethDv3tnt</Tag>
            <span>on Ethereum</span>
          </Styled.TokenColumn>
          <Styled.TokenColumn>
            <Styled.TokenIcon>
              <Icon iconName={IconName.DYDX} />
              <Icon iconName={IconName.DYDX} />
            </Styled.TokenIcon>

            <Styled.Output
              value={amountBN}
              type={OutputType.Asset}
              fractionDigits={0}
              showSign={ShowSign.Both}
            />
            <Tag>dv4tnt</Tag>
            <span>on dYdX Chain</span>
          </Styled.TokenColumn>
        </Styled.ValueContainer>
      ),
    },
  ];

  return (
    <Styled.Container>
      <Styled.Details items={detailItems} layout="rowColumns" />
    </Styled.Container>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Container = styled.div`
  font: var(--font-small-book);
`;

Styled.ValueContainer = styled.div`
  ${layoutMixins.inlineRow}

  margin-top: 0.5rem;
  gap: 1rem;

  padding: 1rem 0.75rem;
  background-color: var(--color-layer-5);
  border-radius: 0.75em;
`;

Styled.TokenColumn = styled.div`
  ${layoutMixins.flexColumn}
  align-items: center;
  gap: 0.2rem;
  height: 6rem;

  > :not(:last-child) {
    color: var(--color-text-2);
  }

  > :last-child {
    font: var(--font-mini-book);
    color: var(--color-text-0);
  }
`;

Styled.Details = styled(Details)`
  text-align: center;
  place-content: center;

  > :last-child:before {
    content: "";
    background: url("src/icons/arrows-right.svg");
    position: absolute;
    margin: 5rem 0 0 -2rem;
    width: 2rem;
    height: 2rem;
  }
`;

Styled.TokenIcon = styled.div`
  ${layoutMixins.stack}

  margin: -0.25rem auto 0;

  > svg:first-child {
    height: 2rem;
    width: auto;
    margin: 0.25rem;
  }

  > svg:last-child {
    height: 0.9rem;
    width: auto;
    place-self: start end;
  }
`;

Styled.Output = styled(Output)`
  --output-sign-color: var(--color-positive);
`;

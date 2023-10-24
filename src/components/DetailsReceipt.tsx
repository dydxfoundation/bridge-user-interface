import styled, { type AnyStyledComponent } from 'styled-components';

import { layoutMixins } from '@/styles/layoutMixins';

import { Details, type DetailsItem } from '@/components/Details';

type ElementProps = {
  header?: React.ReactNode;
  headerIcon?: React.ReactNode;
  detailItems?: DetailsItem[];
};

type StyleProps = {
  className?: string;
};

export type DetailsReceiptProps = ElementProps & StyleProps;

export const DetailsReceipt = ({
  header,
  headerIcon,
  detailItems,
  className,
}: DetailsReceiptProps) => (
  <Styled.DetailsContainer className={className}>
    <Styled.DetailsHeader>
      {headerIcon}
      {header}
    </Styled.DetailsHeader>
    <Styled.Details items={detailItems} />
  </Styled.DetailsContainer>
);

const Styled: Record<string, AnyStyledComponent> = {};

Styled.DetailsContainer = styled.div`
  --detailsReceipt-backgroundColor: var(--color-layer-1);
  --detailsReceipt-header-color: var(--color-text-1);

  border-radius: 0.75em;
  background-color: var(--detailsReceipt-backgroundColor);
  padding: 0.25rem 0.75rem;

  h3 {
    ${layoutMixins.inlineRow}

    color: var(--color-text-1);
    font: var(--font-base-book);
    margin: 0.5rem 0;

    svg {
      margin-top: 1px;
    }
  }
`;

Styled.DetailsHeader = styled.h3`
  ${layoutMixins.inlineRow}

  margin: 0.5rem 0;
  color: var(--detailsReceipt-header-color);
  font: var(--font-base-book);
`;

Styled.Details = styled(Details)`
  font: var(--font-small-book);
`;

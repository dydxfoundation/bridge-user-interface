import styled, { AnyStyledComponent } from 'styled-components';

import { layoutMixins } from '@/styles/layoutMixins';

type PanelProps = {
  slotHeader?: React.ReactNode;
  children?: React.ReactNode;
  onHeaderClick?: () => void;
};

type PanelStyleProps = {
  className?: string;
};

export const Panel = ({ slotHeader, children, className }: PanelProps & PanelStyleProps) => (
  <Styled.Panel className={className}>
    {slotHeader}
    <Styled.Content className={className}>{children}</Styled.Content>
  </Styled.Panel>
);

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Panel = styled.section`
  ${layoutMixins.flexColumn}
  gap: 1.25rem;

  background-color: var(--color-layer-3);
  border-radius: 0.875rem;
  padding: 1.25rem 1.5rem;
`;

Styled.Content = styled.div`
  ${layoutMixins.scrollArea}
  ${layoutMixins.stickyArea0}
  --stickyArea0-background: transparent;
  overflow-x: hidden;
`;

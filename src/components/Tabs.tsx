import styled, { type AnyStyledComponent, css } from 'styled-components';
import { Content, List, Root, Trigger } from '@radix-ui/react-tabs';

import { layoutMixins } from '@/styles/layoutMixins';
import breakpoints from '@/styles/breakpoints';

export type TabItem<TabItemsValue> = {
  value: TabItemsValue;
  label: React.ReactNode;
  forceMount?: boolean;
  content?: React.ReactNode;
};

type ElementProps<TabItemsValue> = {
  defaultValue?: TabItemsValue;
  value?: TabItemsValue;
  items: TabItem<TabItemsValue>[];
  onValueChange?: (value: TabItemsValue) => void;
};

type StyleProps = {
  className?: string;
};

export const Tabs = <TabItemsValue extends string>({
  defaultValue,
  value,
  items,
  onValueChange,
  className,
}: ElementProps<TabItemsValue> & StyleProps) => {
  const currentItem = items.find((item) => item.value === value);

  return (
    <Styled.Root
      className={className}
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
    >
      <Styled.Header>
        <Styled.List>
          {items.map((item) => (
            <Styled.Trigger key={item.value} value={item.value}>
              {item.label}
            </Styled.Trigger>
          ))}
        </Styled.List>
      </Styled.Header>

      <Styled.Stack>
        {items.map(({ value, content, forceMount }) => (
          <Styled.Content
            key={value}
            value={value}
            forceMount={forceMount}
            $hide={forceMount && currentItem?.value !== value}
          >
            {content}
          </Styled.Content>
        ))}
      </Styled.Stack>
    </Styled.Root>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Root = styled(Root)`
  --trigger-backgroundColor: var(--color-layer-2);
  --trigger-textColor: var(--color-text-0);
  --trigger-borderColor: var(--trigger-backgroundColor);
  --trigger-active-backgroundColor: var(--color-layer-1);
  --trigger-active-textColor: var(--color-text-2);
  --trigger-active-borderColor: var(--color-border);

  --tabs-currentHeight: var(--tabs-height);

  ${layoutMixins.scrollArea}
  overscroll-behavior: contain;

  ${layoutMixins.stickyArea0}
  --stickyArea0-background: var(--color-layer-2);
  --stickyArea0-topGap: var(--border-width);

  ${layoutMixins.contentContainer}

  --stickyArea0-topHeight: var(--tabs-currentHeight);
  ${layoutMixins.expandingColumnWithHeader}

  @media ${breakpoints.tablet} {
    overscroll-behavior: contain auto;
  }
`;

Styled.Header = styled.header`
  ${layoutMixins.contentSectionDetachedScrollable}
  ${layoutMixins.stickyHeader}
  ${layoutMixins.row}
  justify-content: space-between;
`;

Styled.List = styled(List)`
  align-self: stretch;
  ${layoutMixins.inlineRow}
`;

Styled.Trigger = styled(Trigger)`
  ${layoutMixins.row}
  justify-content: center;
  gap: 0.5rem;

  align-self: stretch;
  padding: 0.5rem 0.75rem;

  font: var(--trigger-font, var(--font-medium-book));
  color: var(--trigger-textColor);
  background-color: var(--trigger-backgroundColor);
  border-radius: 0.5rem;
  border: var(--border-width) solid var(--trigger-borderColor);

  &[data-state='active'] {
    color: var(--trigger-active-textColor);
    background-color: var(--trigger-active-backgroundColor);
    border: var(--border-width) solid var(--trigger-active-borderColor);
  }
`;

Styled.Stack = styled.div`
  ${layoutMixins.stack}
  ${layoutMixins.perspectiveArea}

  box-shadow: none;
  margin-top: 1rem;
`;

Styled.Content = styled(Content)<{ $hide?: boolean }>`
  ${layoutMixins.flexColumn}
  outline: none;
  box-shadow: none;

  &[data-state='inactive'] {
    pointer-events: none;
  }

  ${({ $hide }) =>
    $hide &&
    css`
      display: none;
    `}
`;

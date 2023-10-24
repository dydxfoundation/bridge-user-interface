import styled, { keyframes, type AnyStyledComponent } from 'styled-components';

import { Root, Item, Header, Trigger, Content } from '@radix-ui/react-accordion';

import { ChevronDownIcon } from '@radix-ui/react-icons';
import { layoutMixins } from '@/styles/layoutMixins';

export type AccordionItem = {
  header: React.ReactNode;
  content: React.ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
  className?: string;
};

export const Accordion = ({ items, className }: AccordionProps) => (
  <Styled.Root className={className} type="single" collapsible>
    {items.map(({ header, content }, idx) => (
      <Styled.Item key={idx} value={idx.toString()}>
        <Header>
          <Styled.Trigger>
            {header}
            <ChevronDownIcon aria-hidden />
          </Styled.Trigger>
        </Header>
        <Styled.Content>{content}</Styled.Content>
      </Styled.Item>
    ))}
  </Styled.Root>
);

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Root = styled(Root)`
  font: var(--font-base-book);
  > *:not(:last-child) {
    border-bottom: var(--border-width) solid var(--border-color);
  }
`;

Styled.Item = styled(Item)``;

Styled.Trigger = styled(Trigger)`
  ${layoutMixins.spacedRow}
  width: 100%;
  padding: 1rem 1.5rem;

  color: var(--color-text-2);
  text-align: start;

  svg {
    transition: transform 0.3s var(--ease-out-expo);
  }

  &[data-state='open'] svg {
    transform: rotate(0.5turn);
  }
`;

Styled.Content = styled(Content)`
  margin-top: 1rem;
  overflow: hidden;
  margin: 0 1.5rem 1rem;

  &[data-state='open'] {
    animation: ${keyframes`
      from {
        height: 0;
      }
      to {
        height: var(--radix-accordion-content-height);
      }
    `} 0.3s var(--ease-out-expo);
  }

  &[data-state='closed'] {
    animation: ${keyframes`
      from {
        height: var(--radix-accordion-content-height);
      }
      to {
        height: 0;
      }
    `} 0.1s var(--ease-in-expo);
  }
`;

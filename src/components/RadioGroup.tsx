import styled, { type AnyStyledComponent } from 'styled-components';

import { Root, Item, Indicator } from '@radix-ui/react-radio-group';
import { layoutMixins } from '@/styles/layoutMixins';
import { formMixins } from '@/styles/formMixins';
import breakpoints from '@/styles/breakpoints';

export type RadioGroupItem = {
  value: string;
  label: React.ReactNode;
  slotContent?: React.ReactNode;
};

type StyleProps = {
  className?: string;
};

type ElementProps = {
  value: string;
  items: RadioGroupItem[];
  onValueChange?: (value: string) => void;
};

type RadioGroupProps = StyleProps & ElementProps;

export const RadioGroup = ({ items, value, onValueChange, className }: RadioGroupProps) => (
  <Styled.Root className={className} defaultValue={value} onValueChange={onValueChange} required>
    {items.map((item: RadioGroupItem, index) => (
      <Styled.RadioItem
        className={className}
        key={item.value}
        value={item.value}
        id={index.toString()}
      >
        <Styled.InlineRow>
          <Styled.IndicatorContainer>
            <Styled.Indicator />
          </Styled.IndicatorContainer>
          <Styled.Label id={index.toString()}>{item.label}</Styled.Label>
        </Styled.InlineRow>

        {item.value === value && item.slotContent}
      </Styled.RadioItem>
    ))}
  </Styled.Root>
);

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Root = styled(Root)`
  ${layoutMixins.flexColumn}
  gap: var(--form-input-gap);
`;

Styled.RadioItem = styled(Item)`
  ${formMixins.inputContainer}
  ${layoutMixins.flexColumn}

  align-content: center;
  align-items: start;
  padding: 0.75rem var(--form-input-paddingX);
  gap: 0.5rem;

  border-radius: 0.5em;
  font: var(--font-small-book);
  color: var(--color-text-0);

  cursor: pointer;

  &:hover,
  &:focus {
    filter: brightness(1.1);
  }

  > :nth-child(2) {
    padding-left: 1.75rem;
    width: 100%;
  }

  @media ${breakpoints.tablet} {
    --input-height: auto;
  }
`;

Styled.InlineRow = styled.div`
  ${layoutMixins.inlineRow}
  gap: 0.5rem;
  min-width: 100%;
  text-align: start;
`;

Styled.IndicatorContainer = styled.div`
  background-color: var(--color-layer-2);
  min-width: 1.25rem;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 100%;
  border: 1px solid var(--border-color);

  ${Styled.RadioItem}[data-state="checked"] & {
    background-color: var(--color-accent);
  }
`;

Styled.Indicator = styled(Indicator)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;

  &[data-state='checked']:after {
    content: '';
    display: block;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background-color: var(--color-layer-2);
  }
`;

Styled.Label = styled.label`
  cursor: pointer;
`;

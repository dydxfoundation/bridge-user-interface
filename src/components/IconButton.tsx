import { forwardRef, type ElementType } from 'react';
import styled, { css, type AnyStyledComponent } from 'styled-components';

import { ButtonShape, ButtonSize } from '@/constants/buttons';

import { Button, type ButtonProps } from '@/components/Button';
import { Icon, IconName } from '@/components/Icon';
import { ToggleButton, type ToggleButtonProps } from '@/components/ToggleButton';

type ElementProps = {
  isToggle?: boolean;
  iconName?: IconName;
  iconComponent?: ElementType;
  slotIcon?: React.ReactNode;
};

export type IconButtonProps = ElementProps & ButtonProps & ToggleButtonProps;

export const IconButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, IconButtonProps>(
  (
    {
      size = ButtonSize.XSmall,
      shape = ButtonShape.Circle,

      href,
      isToggle,
      iconName,
      iconComponent,
      slotIcon,

      onClick,
      onPressedChange,
      className,

      ...otherProps
    },
    ref
  ) => {
    return isToggle ? (
      <Styled.IconToggleButton
        ref={ref}
        className={className}
        size={size}
        shape={shape}
        href={href}
        onPressedChange={onPressedChange ?? onClick}
        {...otherProps}
      >
        {slotIcon ? slotIcon : <Icon iconName={iconName} iconComponent={iconComponent} />}
      </Styled.IconToggleButton>
    ) : (
      <Styled.IconButton
        ref={ref}
        className={className}
        size={size}
        shape={shape}
        href={href}
        onClick={onClick}
        {...otherProps}
      >
        {slotIcon ? slotIcon : <Icon iconName={iconName} iconComponent={iconComponent} />}
      </Styled.IconButton>
    );
  }
);

const Styled: Record<string, AnyStyledComponent> = {};

const buttonMixin = css`
  // Params
  --button-icon-size: 1.125em;

  // Rules
  > * {
    font-size: var(--button-icon-size);
  }
`;

Styled.IconButton = styled(Button)`
  ${buttonMixin}
`;

Styled.IconToggleButton = styled(ToggleButton)`
  ${buttonMixin}
`;

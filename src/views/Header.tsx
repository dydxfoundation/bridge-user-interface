import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import styled, { type AnyStyledComponent } from 'styled-components';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';

import { ButtonShape } from '@/constants/buttons';
import { STRING_KEYS } from '@/constants/localization';
import { DialogTypes } from '@/constants/dialogs';
import { RELEVANT_LINKS } from '@/constants/links';
import { LogoShortIcon } from '@/icons';

import { headerMixins } from '@/styles/headerMixins';
import { layoutMixins } from '@/styles/layoutMixins';
import breakpoints from '@/styles/breakpoints';

import { useBreakpoints, useStringGetter } from '@/hooks';

import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { NavigationMenu } from '@/components/NavigationMenu';
import { VerticalSeparator } from '@/components/Separator';

import { AccountMenu } from '@/views/menus/AccountMenu';
import { LanguageSelector } from '@/views/menus/LanguageSelector';

import { openDialog } from '@/state/dialogs';

import { isTruthy } from '@/lib/isTruthy';

export const Header = () => {
  const stringGetter = useStringGetter();
  const { isNotMobile, isMobile } = useBreakpoints();
  const dispatch = useDispatch();

  const navItems = [
    {
      group: 'navigation',
      items: [
        import.meta.env.VITE_TRADE_URL && {
          value: 'TRADE',
          label: stringGetter({ key: STRING_KEYS.TRADE }),
          href: import.meta.env.VITE_TRADE_URL,
        },
        {
          value: 'MIGRATE',
          label: stringGetter({ key: STRING_KEYS.MIGRATE }),
          active: true,
          href: '/',
        },
        {
          value: 'MORE',
          label: stringGetter({ key: STRING_KEYS.MORE }),
          subitems: RELEVANT_LINKS.map((linkItem) => ({
            value: linkItem.value,
            slotBefore: linkItem.iconName ? <Icon iconName={linkItem.iconName} /> : undefined,
            label: stringGetter({ key: linkItem.labelStringKey }),
            href: linkItem.href,
          })),
        },
      ].filter(isTruthy),
    },
  ];

  return (
    <Styled.Header>
      <Styled.Logo to="/">
        <LogoShortIcon />
      </Styled.Logo>

      <VerticalSeparator />

      <Styled.NavBefore>
        <LanguageSelector sideOffset={16} />
      </Styled.NavBefore>

      <VerticalSeparator />

      {isNotMobile && <Styled.NavigationMenu items={navItems} />}

      <div role="separator" />

      <Styled.NavAfter>
        {isMobile && (
          <Styled.MoreLinksButton
            shape={ButtonShape.Square}
            slotIcon={<DotsHorizontalIcon />}
            onClick={() => dispatch(openDialog({ type: DialogTypes.MoreLinks }))}
          />
        )}
        <VerticalSeparator />
        <AccountMenu />
      </Styled.NavAfter>
    </Styled.Header>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Header = styled.header`
  --logo-width: 3.5rem;
  --navBefore-width: calc(calc(var(--sidebar-width) - var(--logo-width) - var(--border-width)) / 2);
  --trigger-height: 2.25rem;

  ${layoutMixins.container}
  ${layoutMixins.stickyHeader}
  ${layoutMixins.scrollSnapItem}
  backdrop-filter: none;

  height: var(--page-currentHeaderHeight);

  display: grid;
  align-items: stretch;
  grid-auto-flow: column;
  grid-template:
    'Logo . NavBefore . Nav . NavAfter' 100%
    / var(--logo-width) var(--border-width) var(--navBefore-width)
    var(--border-width) 1fr var(--border-width) auto;

  @media ${breakpoints.tablet} {
    --trigger-height: 3rem;
  }

  @media ${breakpoints.mobile} {
    --navBefore-width: 7rem;
  }

  font-size: 0.9375em;
  background-color: var(--color-layer-2);

  :before {
    backdrop-filter: blur(10px);
  }
`;

Styled.NavigationMenu = styled(NavigationMenu)`
  & {
    --navigationMenu-height: var(--stickyArea-topHeight);
    --navigationMenu-item-height: var(--trigger-height);
  }

  ${layoutMixins.scrollArea}
  padding: 0 0.5rem;
  scroll-padding: 0 0.5rem;
`;

Styled.NavBefore = styled.div`
  ${layoutMixins.flexEqualColumns}

  > * {
    align-self: center;
    margin: 0 0.4rem;
  }
`;

Styled.NavAfter = styled.div`
  ${layoutMixins.row}
  justify-self: end;
  padding-right: 0.75rem;

  gap: 0.5rem;
`;

Styled.MoreLinksButton = styled(IconButton)`
  ${headerMixins.button}
  --button-height: var(--trigger-height);
  svg {
    height: auto;
    width: 1.5rem;
  }
`;

Styled.Logo = styled(NavLink)`
  display: flex;
  align-self: stretch;

  > svg {
    margin: auto;
    width: auto;
    height: 45%;
  }
`;

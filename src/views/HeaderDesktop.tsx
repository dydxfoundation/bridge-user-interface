import styled, { type AnyStyledComponent } from "styled-components";

import { ButtonShape, ButtonType } from "@/constants/buttons";
import { STRING_KEYS } from "@/constants/localization";
import { useStringGetter } from "@/hooks";
import { LogoShortIcon } from "@/icons";

import { Icon, IconName } from "@/components/Icon";
import { IconButton } from "@/components/IconButton";
import { NavigationMenu } from "@/components/NavigationMenu";
import { VerticalSeparator } from "@/components/Separator";

import { AccountMenu } from "@/views/menus/AccountMenu";
import { LanguageSelector } from "@/views/menus/LanguageSelector";

import { headerMixins } from "@/styles/headerMixins";
import { layoutMixins } from "@/styles/layoutMixins";

export const HeaderDesktop = () => {
  const stringGetter = useStringGetter();

  const navItems = [
    {
      group: "navigation",
      items: [
        {
          value: "TRADE",
          label: stringGetter({ key: STRING_KEYS.TRADE }),
          href: "https://v4.testnet.dydx.exchange/",
        },
        {
          value: "MIGRATE",
          label: "Migrate",
          active: true,
          onClick: (e: MouseEvent) => {
            e.preventDefault();
          },
        },
        {
          value: "MORE",
          label: stringGetter({ key: STRING_KEYS.MORE }),
          subitems: [
            {
              value: "DOCUMENTATION",
              slotBefore: <Icon iconName={IconName.Terminal} />,
              label: stringGetter({ key: STRING_KEYS.DOCUMENTATION }),
              href: "https://v4-teacher.vercel.app/",
            },
            {
              value: "MINTSCAN",
              slotBefore: <Icon iconName={IconName.Mintscan} />,
              label: stringGetter({ key: STRING_KEYS.MINTSCAN }),
              href: "https://testnet.mintscan.io/dydx-testnet",
            },
            {
              value: "COMMUNITY",
              slotBefore: <Icon iconName={IconName.Discord} />,
              label: stringGetter({ key: STRING_KEYS.COMMUNITY }),
              href: "https://discord.gg/dydx",
            },
            {
              value: "TERMS_OF_USE",
              slotBefore: <Icon iconName={IconName.File} />,
              label: stringGetter({ key: STRING_KEYS.TERMS_OF_USE }),
              href: "https://dydx.exchange/terms",
            },
            {
              value: "PRIVACY_POLICY",
              slotBefore: <Icon iconName={IconName.Privacy} />,
              label: stringGetter({ key: STRING_KEYS.PRIVACY_POLICY }),
              href: "https://dydx.exchange/privacy",
            },
          ],
        },
      ],
    },
  ];

  return (
    <Styled.Header>
      <Styled.Logo>
        <LogoShortIcon />
      </Styled.Logo>

      <VerticalSeparator />

      <Styled.NavBefore>
        <LanguageSelector sideOffset={16} />
      </Styled.NavBefore>

      <VerticalSeparator />

      <Styled.NavigationMenu items={navItems} />

      <div role="separator" />

      <Styled.NavAfter>
        <Styled.IconButton
          shape={ButtonShape.Rectangle}
          iconName={IconName.HelpCircle}
          type={ButtonType.Link}
          href="https://v4-teacher.vercel.app/"
        />

        <VerticalSeparator />

        <AccountMenu />
      </Styled.NavAfter>
    </Styled.Header>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Header = styled.header`
  --logo-width: 3.5rem;

  ${layoutMixins.container}
  ${layoutMixins.stickyHeader}
  ${layoutMixins.scrollSnapItem}
  backdrop-filter: none;

  grid-area: Header;

  display: grid;
  align-items: stretch;
  grid-auto-flow: column;
  grid-template:
    "Logo . NavBefore . Nav . NavAfter" 100%
    / var(--logo-width) var(--border-width) calc(
      calc(var(--sidebar-width) - var(--logo-width) - var(--border-width)) / 2
    )
    var(--border-width) 1fr var(--border-width) auto;

  font-size: 0.9375em;
  background-color: var(--color-layer-2);

  :before {
    backdrop-filter: blur(10px);
  }
`;

Styled.NavigationMenu = styled(NavigationMenu)`
  & {
    --navigationMenu-height: var(--stickyArea-topHeight);
    --navigationMenu-item-height: 2.25rem;
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

Styled.IconButton = styled(IconButton)`
  ${headerMixins.button}
  --button-border: none;
`;

Styled.Logo = styled.div`
  display: flex;
  align-self: stretch;

  > svg {
    margin: auto;
    width: auto;
    height: 45%;
  }
`;

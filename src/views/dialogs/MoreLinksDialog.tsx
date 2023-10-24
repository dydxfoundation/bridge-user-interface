import styled, { AnyStyledComponent } from 'styled-components';

import { DialogProps } from '@/constants/dialogs';
import { RELEVANT_LINKS } from '@/constants/links';
import { STRING_KEYS } from '@/constants/localization';

import { useStringGetter } from '@/hooks';

import { Dialog } from '@/components/Dialog';
import { Icon } from '@/components/Icon';
import { NavigationMenu } from '@/components/NavigationMenu';

import { isTruthy } from '@/lib/isTruthy';

export const MoreLinksDialog = ({ setIsOpen }: DialogProps) => {
  const stringGetter = useStringGetter();

  const navItems = [
    {
      group: 'relevantLinks',
      items: [
        import.meta.env.VITE_TRADE_URL && {
          value: 'TRADE',
          slotBefore: undefined,
          label: stringGetter({ key: STRING_KEYS.TRADE }),
          href: import.meta.env.VITE_TRADE_URL,
        },
        ...RELEVANT_LINKS.map((linkItem) => ({
          value: linkItem.value,
          slotBefore: linkItem.iconName ? <Icon iconName={linkItem.iconName} /> : undefined,
          label: stringGetter({ key: linkItem.labelStringKey }),
          href: linkItem.href,
        })),
      ].filter(isTruthy),
    },
  ];

  return (
    <Dialog isOpen setIsOpen={setIsOpen} title={stringGetter({ key: STRING_KEYS.RELEVANT_LINKS })}>
      <Styled.NavigationMenu items={navItems} orientation="vertical" />
    </Dialog>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.NavigationMenu = styled(NavigationMenu)`
  font: var(--font-medium-book);
`;

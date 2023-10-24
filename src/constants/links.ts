import { IconName } from '@/components/Icon';
import { STRING_KEYS } from './localization';
import { AppRoute } from './routes';

export const RELEVANT_LINKS = [
  {
    value: 'DOCUMENTATION',
    iconName: IconName.Terminal,
    labelStringKey: STRING_KEYS.DOCUMENTATION,
    href: import.meta.env.VITE_DOCS_URL,
  },
  {
    value: 'MINTSCAN',
    iconName: IconName.Mintscan,
    labelStringKey: STRING_KEYS.MINTSCAN,
    href: import.meta.env.VITE_MINTSCAN_URL,
  },
  {
    value: 'COMMUNITY',
    iconName: IconName.Discord,
    labelStringKey: STRING_KEYS.COMMUNITY,
    href: 'https://discord.gg/dydx',
  },
  {
    value: 'TERMS_OF_USE',
    iconName: IconName.File,
    labelStringKey: STRING_KEYS.TERMS_OF_USE,
    href: AppRoute.Terms,
  },
  {
    value: 'PRIVACY_POLICY',
    iconName: IconName.Privacy,
    labelStringKey: STRING_KEYS.PRIVACY_POLICY,
    href: AppRoute.Privacy,
  },
];

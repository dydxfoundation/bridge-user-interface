import { type ElementType } from 'react';

import styled from 'styled-components';

import {
  AddressConnectorIcon,
  ArrowIcon,
  BoxCloseIcon,
  CautionCircleIcon,
  CautionCircleStrokeIcon,
  CheckIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  CloseIcon,
  CopyIcon,
  DiscordIcon,
  ExportKeysIcon,
  FileIcon,
  HelpCircleIcon,
  HideIcon,
  LinkOutIcon,
  LogoShortIcon,
  MigrateIcon,
  MintscanIcon,
  PrivacyIcon,
  SearchIcon,
  ShowIcon,
  TerminalIcon,
  TimeIcon,
  TriangleIcon,
  WarningIcon,
} from '@/icons';

export enum IconName {
  AddressConnector = 'AddressConnector',
  Arrow = 'Arrow',
  BoxClose = 'BoxClose',
  CautionCircle = 'CautionCircle',
  CautionCircleStroke = 'CautionCircleStroke',
  Check = 'Check',
  CheckCircle = 'CheckCircle',
  ChevronLeft = 'ChevronLeft',
  Close = 'Close',
  Copy = 'Copy',
  Discord = 'Discord',
  ExportKeys = 'ExportKeys',
  File = 'File',
  HelpCircle = 'HelpCircle',
  Hide = 'Hide',
  LinkOut = 'LinkOut',
  LogoShort = 'LogoShort',
  Migrate = 'Migrate',
  Mintscan = 'Mintscan',
  Privacy = 'Privacy',
  Search = 'Search',
  Show = 'Show',
  Terminal = 'Terminal',
  Time = 'Time',
  Triangle = 'Triangle',
  Warning = 'Warning',
}

const icons = {
  [IconName.AddressConnector]: AddressConnectorIcon,
  [IconName.Arrow]: ArrowIcon,
  [IconName.BoxClose]: BoxCloseIcon,
  [IconName.CautionCircle]: CautionCircleIcon,
  [IconName.CautionCircleStroke]: CautionCircleStrokeIcon,
  [IconName.Check]: CheckIcon,
  [IconName.CheckCircle]: CheckCircleIcon,
  [IconName.ChevronLeft]: ChevronLeftIcon,
  [IconName.Close]: CloseIcon,
  [IconName.Copy]: CopyIcon,
  [IconName.Discord]: DiscordIcon,
  [IconName.ExportKeys]: ExportKeysIcon,
  [IconName.File]: FileIcon,
  [IconName.HelpCircle]: HelpCircleIcon,
  [IconName.Hide]: HideIcon,
  [IconName.LinkOut]: LinkOutIcon,
  [IconName.LogoShort]: LogoShortIcon,
  [IconName.Migrate]: MigrateIcon,
  [IconName.Mintscan]: MintscanIcon,
  [IconName.Privacy]: PrivacyIcon,
  [IconName.Search]: SearchIcon,
  [IconName.Show]: ShowIcon,
  [IconName.Terminal]: TerminalIcon,
  [IconName.Time]: TimeIcon,
  [IconName.Triangle]: TriangleIcon,
  [IconName.Warning]: WarningIcon,
} as Record<IconName, ElementType>;

type ElementProps = {
  iconName?: IconName;
  iconComponent?: ElementType | string;
};

type StyleProps = {
  className?: string;
};

export const Icon = styled(
  ({
    iconName,
    iconComponent: Component = iconName && icons[iconName],
    className,
    ...props
  }: ElementProps & StyleProps) =>
    Component ? <Component className={className} {...props} /> : null
)`
  width: 1em;
  height: 1em;
`;

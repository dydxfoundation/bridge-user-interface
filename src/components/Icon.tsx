import { type ElementType } from "react";

import styled from "styled-components";

import {
  AddressConnectorIcon,
  ArrowIcon,
  ArrowsRightIcon,
  BoxCloseIcon,
  CheckIcon,
  ChevronLeftIcon,
  CloseIcon,
  CopyIcon,
  DiscordIcon,
  DYDXIcon,
  EthIcon,
  FileIcon,
  HelpCircleIcon,
  LinkOutIcon,
  LogoShortIcon,
  MigrateIcon,
  MintscanIcon,
  PrivacyIcon,
  TerminalIcon,
  TimeIcon,
  TriangleIcon,
  WarningIcon,
} from "@/icons";

export enum IconName {
  AddressConnector = "AddressConnector",
  Arrow = "Arrow",
  ArrowsRight = "ArrowsRight",
  BoxClose = "BoxClose",
  Check = "Check",
  ChevronLeft = "ChevronLeft",
  Close = "Close",
  Copy = "Copy",
  Discord = "Discord",
  DYDX = "DYDX",
  Eth = "Eth",
  File = "File",
  HelpCircle = "HelpCircle",
  LinkOut = "LinkOut",
  LogoShort = "LogoShort",
  Migrate = "Migrate",
  Mintscan = "Mintscan",
  Privacy = "Privacy",
  Terminal = "Terminal",
  Time = "Time",
  Triangle = "Triangle",
  Warning = "Warning",
}

const icons = {
  [IconName.AddressConnector]: AddressConnectorIcon,
  [IconName.Arrow]: ArrowIcon,
  [IconName.ArrowsRight]: ArrowsRightIcon,
  [IconName.BoxClose]: BoxCloseIcon,
  [IconName.Check]: CheckIcon,
  [IconName.ChevronLeft]: ChevronLeftIcon,
  [IconName.Close]: CloseIcon,
  [IconName.Copy]: CopyIcon,
  [IconName.Discord]: DiscordIcon,
  [IconName.DYDX]: DYDXIcon,
  [IconName.Eth]: EthIcon,
  [IconName.File]: FileIcon,
  [IconName.HelpCircle]: HelpCircleIcon,
  [IconName.LinkOut]: LinkOutIcon,
  [IconName.LogoShort]: LogoShortIcon,
  [IconName.Migrate]: MigrateIcon,
  [IconName.Mintscan]: MintscanIcon,
  [IconName.Privacy]: PrivacyIcon,
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

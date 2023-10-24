import styled, { type AnyStyledComponent } from 'styled-components';

export type AssetSymbol = keyof typeof assetIcons;

const assetIcons = {
  DYDX: '/currencies/dydx.png',
  ETH: '/currencies/eth.png',
} as const;

const isAssetSymbol = (symbol?: string): symbol is AssetSymbol =>
  symbol !== undefined && assetIcons.hasOwnProperty(symbol);

export const AssetIcon = ({ symbol, className }: { symbol?: string; className?: string }) =>
  isAssetSymbol(symbol) ? <Styled.Img src={assetIcons[symbol]} className={className} /> : null;

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Img = styled.img`
  width: auto;
  height: 1em;
`;

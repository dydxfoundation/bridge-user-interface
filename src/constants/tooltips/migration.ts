import { type TooltipStrings, TOOLTIP_STRING_KEYS } from '@/constants/localization';

export const migrationTooltips: TooltipStrings = {
  'dydx-chain-settlement': ({ stringGetter }) => ({
    title: stringGetter({
      key: TOOLTIP_STRING_KEYS.DYDX_CHAIN_SETTLEMENT_TITLE,
    }),
    body: stringGetter({ key: TOOLTIP_STRING_KEYS.DYDX_CHAIN_SETTLEMENT_BODY }),
  }),
};

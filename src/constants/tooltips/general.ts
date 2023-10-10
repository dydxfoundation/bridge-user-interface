import { type TooltipStrings, TOOLTIP_STRING_KEYS } from '@/constants/localization';

export const generalTooltips: TooltipStrings = {
  'remember-me': ({ stringGetter }) => ({
    title: stringGetter({ key: TOOLTIP_STRING_KEYS.REMEMBER_ME_TITLE }),
    body: stringGetter({ key: TOOLTIP_STRING_KEYS.REMEMBER_ME_BODY }),
  }),
};

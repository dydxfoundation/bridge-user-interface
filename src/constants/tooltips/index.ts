import type { TooltipStrings } from '@/constants/localization';

import { generalTooltips } from './general';
import { migrationTooltips } from './migration';

export const tooltipStrings: TooltipStrings = {
  ...generalTooltips,
  ...migrationTooltips,
} as const;

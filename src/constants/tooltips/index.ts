import type { TooltipStrings } from "@/constants/localization";

import { generalTooltips } from "./general";

export const tooltipStrings: TooltipStrings = {
  ...generalTooltips,
} as const;

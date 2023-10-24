import { ButtonAction, ButtonSize } from '@/constants/buttons';

import { IconName } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';

type ElementProps = {
  onClick?: () => void;
};

export const BackButton = ({ onClick }: ElementProps) => (
  <IconButton
    onClick={onClick}
    iconName={IconName.ChevronLeft}
    size={ButtonSize.Small}
    action={ButtonAction.Navigation}
  />
);

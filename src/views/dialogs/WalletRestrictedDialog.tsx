import styled, { AnyStyledComponent } from "styled-components";

import { PreventCloseDialogProps } from "@/constants/dialogs";
import { STRING_KEYS } from "@/constants/localization";
import { useStringGetter } from "@/hooks";
import { layoutMixins } from "@/styles/layoutMixins";

import { Dialog } from "@/components/Dialog";
import { Icon, IconName } from "@/components/Icon";

export const WalletRestrictedDialog = ({
  preventClose,
  setIsOpen,
}: PreventCloseDialogProps) => {
  const stringGetter = useStringGetter();

  return (
    <Dialog
      isOpen
      preventClose={preventClose}
      setIsOpen={setIsOpen}
      title={stringGetter({ key: STRING_KEYS.WALLET_RESTRICTED_ERROR_TITLE })}
      slotIcon={<Styled.Icon iconName={IconName.Warning} />}
    >
      <Styled.Content>
        {stringGetter({ key: STRING_KEYS.MIGRATION_BLOCKED_MESSAGE })}
      </Styled.Content>
    </Dialog>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Icon = styled(Icon)`
  color: var(--color-warning);
`;

Styled.Content = styled.div`
  ${layoutMixins.column}
  gap: 1rem;
`;

import { useState } from "react";

import styled, { type AnyStyledComponent } from "styled-components";

import { AlertType } from "@/constants/alerts";
import { ButtonAction, ButtonType } from "@/constants/buttons";

import { layoutMixins } from "@/styles/layoutMixins";

import { useMigrateToken } from "@/hooks";

import { AlertMessage } from "@/components/AlertMessage";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { Tag } from "@/components/Tag";
import { DetailsReceipt } from "@/components/DetailsReceipt";
import { IconName } from "@/components/Icon";

import { TokensBeforeAfterDiagram } from "../TokensBeforeAfterDiagram";

export const MigrateFormPreviewStep = () => {
  const {
    resetForm,
    needTokenAllowance,
    isTokenApproveLoading,
    tokenApproveError,
    isBridgePending,
  } = useMigrateToken();

  const [hasAcknowledged, setHasAcknowledged] = useState(false);

  return (
    <>
      <TokensBeforeAfterDiagram />

      <DetailsReceipt
        header="Estimated timeline"
        headerIconName={IconName.Time}
        detailItems={[
          {
            key: "eth_settlement",
            label: "Ethereum settlement",
            value: <Tag>0-12 seconds</Tag>,
          },
          {
            key: "eth_finalization",
            label: "Ethereum finalization",
            value: <Tag>15 minutes</Tag>,
          },
          {
            key: "dydx_settlement",
            label: "dYdX Chain settlment",
            value: <Tag>24-48 hours</Tag>,
          },
        ]}
      />

      {tokenApproveError && (
        <AlertMessage type={AlertType.Error}>
          {tokenApproveError.message}
        </AlertMessage>
      )}

      <Checkbox
        checked={hasAcknowledged}
        onCheckedChange={setHasAcknowledged}
        id="acknowledge-duration"
        label="I understand it will take 24-48 hours until my tokens are available on
          dYdX Chain."
      />

      <Styled.ButtonRow>
        <Styled.EditButton onClick={() => resetForm(false)}>
          Edit
        </Styled.EditButton>

        <Styled.ConfirmButton
          action={ButtonAction.Primary}
          type={ButtonType.Submit}
          state={{
            isLoading: isTokenApproveLoading || isBridgePending,
            isDisabled:
              (!needTokenAllowance && !hasAcknowledged) || isBridgePending,
          }}
        >
          {needTokenAllowance ? "Approve allowance" : "Confirm migration"}
        </Styled.ConfirmButton>
      </Styled.ButtonRow>
    </>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.ButtonRow = styled.div`
  ${layoutMixins.inlineRow}
  gap: var(--form-input-gap);

  > button {
    padding: 0.75rem 1rem;
  }
`;

Styled.EditButton = styled(Button)`
  --button-backgroundColor: var(--color-layer-5);
  --color-border: var(--color-layer-6);
`;

Styled.ConfirmButton = styled(Button)`
  width: 100%;
`;

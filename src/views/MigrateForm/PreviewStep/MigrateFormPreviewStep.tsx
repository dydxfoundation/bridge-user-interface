import styled, { type AnyStyledComponent } from "styled-components";

import { AlertType } from "@/constants/alerts";
import { ButtonAction, ButtonType } from "@/constants/buttons";
import { MigrateFormSteps } from "@/constants/migrate";

import { layoutMixins } from "@/styles/layoutMixins";

import { useMigrateToken } from "@/hooks/useMigrateToken";

import { AlertMessage } from "@/components/AlertMessage";
import { Button } from "@/components/Button";
import { Tag } from "@/components/Tag";
import { DetailsReceipt } from "@/components/DetailsReceipt";
import { IconName } from "@/components/Icon";

import { TokensBeforeAfterDiagram } from "../TokensBeforeAfterDiagram";

export const MigrateFormPreviewStep = ({ errorMsg }: { errorMsg?: string }) => {
  const { setCurrentStep, needTokenAllowance, isTokenApproveLoading } =
    useMigrateToken();

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

      {errorMsg && (
        <AlertMessage type={AlertType.Error}>{errorMsg}</AlertMessage>
      )}

      <Styled.ButtonRow>
        <Styled.EditButton
          onClick={() => setCurrentStep(MigrateFormSteps.Edit)}
        >
          Edit
        </Styled.EditButton>

        <Styled.ConfirmButton
          action={ButtonAction.Primary}
          type={ButtonType.Submit}
          state={{ isLoading: isTokenApproveLoading }}
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

import styled, { type AnyStyledComponent } from "styled-components";
import BigNumber from "bignumber.js";

import { ButtonAction, ButtonType } from "@/constants/buttons";
import { MigrateFormSteps } from "@/constants/migrate";

import { layoutMixins } from "@/styles/layoutMixins";

import { useAccounts, useMigrateToken } from "@/hooks";

import { Button } from "@/components/Button";
import { DetailsReceipt } from "@/components/DetailsReceipt";
import { IconName } from "@/components/Icon";
import { Link } from "@/components/Link";
import { Output, OutputType, ShowSign } from "@/components/Output";
import { Ring } from "@/components/Ring";
import { Tag } from "@/components/Tag";

import { truncateAddress } from "@/lib/wallet";

import { TokensBeforeAfterDiagram } from "../TokensBeforeAfterDiagram";

export const MigrateFormConfirmedStep = () => {
  const {
    amountBN,
    destinationAddress,
    setCurrentStep,
    resetInputs,
    isBridgeLoading,
  } = useMigrateToken();

  const { evmAddress } = useAccounts();

  return (
    <>
      <TokensBeforeAfterDiagram />

      <DetailsReceipt
        header="Ethereum settlement"
        headerIconName={IconName.Eth}
        detailItems={[
          {
            key: "transaction",
            label: (
              <Styled.InlineRow>
                {isBridgeLoading && <Ring withAnimation value={0.25} />}
                Transaction
              </Styled.InlineRow>
            ),
            value: <Link>Block explorer</Link>,
          },
          {
            key: "address",
            label: "Address",
            value: truncateAddress(evmAddress, "0x"),
          },
          {
            key: "wethDv3tnt",
            label: "wethDv3tnt on Ethereum",
            value: (
              <Styled.Output
                type={OutputType.Asset}
                showSign={ShowSign.Both}
                value={amountBN}
                roundingMode={BigNumber.ROUND_DOWN}
              />
            ),
          },
          {
            key: "dv3tnt",
            label: "dv3tnt on Ethereum",
            value: (
              <Styled.Output
                type={OutputType.Asset}
                showSign={ShowSign.Both}
                value={amountBN?.negated()}
                roundingMode={BigNumber.ROUND_DOWN}
                isNegative
              />
            ),
          },
        ]}
      />

      <DetailsReceipt
        header="dYdX Chain settlement"
        headerIconName={IconName.DYDX}
        detailItems={[
          {
            key: "transaction",
            label: (
              <Styled.InlineRow>
                Transaction <Tag>Not started</Tag>
              </Styled.InlineRow>
            ),
            value: "Estimated 24-48 hours",
          },
          {
            key: "address",
            label: "Address",
            value: truncateAddress(destinationAddress),
          },
          {
            key: "dv4tnt",
            label: "dv4tnt on dYdX Chain",
            value: (
              <Styled.Output
                type={OutputType.Asset}
                showSign={ShowSign.Both}
                value={amountBN}
                roundingMode={BigNumber.ROUND_DOWN}
              />
            ),
          },
        ]}
      />

      {!isBridgeLoading && (
        <Styled.ButtonRow>
          <Styled.ResetButton
            onClick={() => {
              setCurrentStep(MigrateFormSteps.Edit);
              resetInputs();
            }}
          >
            Start new migration
          </Styled.ResetButton>

          <Styled.CheckStatusButton
            action={ButtonAction.Primary}
            type={ButtonType.Submit}
          >
            Check Status
          </Styled.CheckStatusButton>
        </Styled.ButtonRow>
      )}
    </>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.InlineRow = styled.span`
  ${layoutMixins.inlineRow}
`;

Styled.ButtonRow = styled.div`
  ${layoutMixins.inlineRow}
  gap: var(--form-input-gap);

  > button {
    padding: 0.75rem 1rem;
  }
`;

Styled.ResetButton = styled(Button)`
  --button-backgroundColor: var(--color-layer-5);
  --color-border: var(--color-layer-6);
`;

Styled.CheckStatusButton = styled(Button)`
  width: 100%;
`;

Styled.Output = styled(Output)<{ isNegative?: boolean }>`
  --output-sign-color: ${({ isNegative }) =>
    isNegative ? `var(--color-negative)` : `var(--color-positive)`};
`;

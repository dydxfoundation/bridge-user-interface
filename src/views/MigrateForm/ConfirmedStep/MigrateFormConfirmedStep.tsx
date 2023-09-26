import styled, { type AnyStyledComponent } from "styled-components";
import BigNumber from "bignumber.js";

import { ButtonAction, ButtonType } from "@/constants/buttons";
import { TransactionStatus } from "@/constants/migrate";

import { layoutMixins } from "@/styles/layoutMixins";

import { useAccounts, useMigrateToken } from "@/hooks";

import { Button } from "@/components/Button";
import { DetailsReceipt } from "@/components/DetailsReceipt";
import { IconName } from "@/components/Icon";
import { Link } from "@/components/Link";
import { Output, OutputType, ShowSign } from "@/components/Output";
import { Ring } from "@/components/Ring";
import { Tag, TagSign } from "@/components/Tag";

import { truncateAddress } from "@/lib/wallet";

import { TokensBeforeAfterDiagram } from "../TokensBeforeAfterDiagram";
import { FinalizingCountdownTimer } from "./FinalizingCountdownTimer";

const etherscanUri = "https://sepolia.etherscan.io/tx/";

export const MigrateFormConfirmedStep = () => {
  const {
    amountBN,
    destinationAddress,
    resetForm,
    bridgeTxHash,
    transactionStatus,
    bridgeTxError,
    bridgeTxMinedBlockNumber,
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
                {transactionStatus &&
                  transactionStatus < TransactionStatus.Finalized &&
                  !bridgeTxError && <Ring withAnimation value={0.25} />}
                Transaction
                {transactionStatus >= TransactionStatus.Finalized ? (
                  <Tag sign={TagSign.Positive}>Finalized</Tag>
                ) : bridgeTxError ? (
                  <Tag sign={TagSign.Negative}>Failed</Tag>
                ) : (
                  transactionStatus === TransactionStatus.Unfinalized && (
                    <FinalizingCountdownTimer
                      bridgeTxMinedBlockNumber={bridgeTxMinedBlockNumber}
                    />
                  )
                )}
              </Styled.InlineRow>
            ),
            value: (
              <Link href={`${etherscanUri}${bridgeTxHash}`} withIcon>
                Block explorer
              </Link>
            ),
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
                Transaction
                {transactionStatus < TransactionStatus.Acknowledged && (
                  <Styled.NotStartedTag>Not started</Styled.NotStartedTag>
                )}
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

      {transactionStatus < TransactionStatus.Finalized ? (
        <Styled.FooterNote>
          Leave this open while the transaction is being finalized.
        </Styled.FooterNote>
      ) : (
        <Styled.ButtonRow>
          {bridgeTxError ? (
            <Styled.SubmitButton
              action={ButtonAction.Primary}
              type={ButtonType.Submit}
            >
              Retry migration
            </Styled.SubmitButton>
          ) : (
            <>
              <Styled.ResetButton onClick={() => resetForm(true)}>
                New migration
              </Styled.ResetButton>

              <Styled.SubmitButton
                action={ButtonAction.Primary}
                type={ButtonType.Submit}
                disabled
              >
                Check status
              </Styled.SubmitButton>
            </>
          )}
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

Styled.SubmitButton = styled(Button)`
  width: 100%;
`;

Styled.Output = styled(Output)<{ isNegative?: boolean }>`
  --output-sign-color: ${({ isNegative }) =>
    isNegative ? `var(--color-negative)` : `var(--color-positive)`};
`;

Styled.NotStartedTag = styled(Tag)`
  color: var(--color-text-1);
`;

Styled.FooterNote = styled.span`
  font: var(--font-small-book);
  color: var(--color-text-0);
  text-align: center;
`;

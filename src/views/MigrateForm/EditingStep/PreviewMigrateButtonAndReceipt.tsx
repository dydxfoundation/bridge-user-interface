import { useSelector } from "react-redux";
import styled, { type AnyStyledComponent } from "styled-components";
import BigNumber from "bignumber.js";

import { ButtonAction, ButtonSize, ButtonType } from "@/constants/buttons";
import { STRING_KEYS } from "@/constants/localization";
import { NumberSign } from "@/constants/numbers";

import { layoutMixins } from "@/styles/layoutMixins";

import {
  useAccounts,
  useAccountBalance,
  useStringGetter,
  useMigrateToken,
} from "@/hooks";

import { Button } from "@/components/Button";
import { DiffOutput } from "@/components/DiffOutput";
import { OutputType } from "@/components/Output";
import { Tag } from "@/components/Tag";
import { WithDetailsReceipt } from "@/components/WithDetailsReceipt";
import { OnboardingTriggerButton } from "@/views/dialogs/OnboardingTriggerButton";

import { calculateCanAccountMigrate } from "@/state/accountCalculators";

import { MustBigNumber } from "@/lib/numbers";
import { isTruthy } from "@/lib/isTruthy";

type ElementProps = {
  isDisabled?: boolean;
  isLoading?: boolean;
};

export const PreviewMigrateButtonAndReceipt = ({
  isDisabled,
  isLoading,
}: ElementProps) => {
  const stringGetter = useStringGetter();
  const { dydxAddress, evmAddress } = useAccounts() || {};
  const { amountBN, destinationAddress } = useMigrateToken();
  const { v3TokenBalance, v4TokenBalance, wrappedV3TokenBalance } =
    useAccountBalance();

  const canAccountMigrate = useSelector(calculateCanAccountMigrate);

  const getLabel = ({ chain, asset }: { chain: string; asset: string }) => (
    <Styled.InlineRow>
      {stringGetter({
        key: STRING_KEYS.BALANCE_ON_CHAIN,
        params: { CHAIN: chain },
      })}
      <Tag>{asset}</Tag>
    </Styled.InlineRow>
  );

  const migrateDetailItems = [
    {
      key: "v3TokenBalance",
      label: getLabel({ chain: "Ethereum", asset: "DYDX" }),
      value: (
        <DiffOutput
          type={OutputType.Asset}
          value={v3TokenBalance}
          newValue={MustBigNumber(v3TokenBalance)
            .minus(amountBN ?? 0)
            .toNumber()}
          sign={NumberSign.Negative}
          withDiff={Boolean(v3TokenBalance !== undefined && amountBN)}
          roundingMode={BigNumber.ROUND_DOWN}
          isLoading={v3TokenBalance === undefined}
        />
      ),
    },
    {
      key: "wrappedV3TokenBalance",
      label: getLabel({ chain: "Ethereum", asset: "wethDYDX" }),
      value: (
        <DiffOutput
          type={OutputType.Asset}
          value={wrappedV3TokenBalance}
          newValue={amountBN?.plus(wrappedV3TokenBalance ?? 0).toNumber() ?? 0}
          sign={NumberSign.Positive}
          withDiff={Boolean(wrappedV3TokenBalance !== undefined && amountBN)}
          roundingMode={BigNumber.ROUND_DOWN}
          isLoading={wrappedV3TokenBalance === undefined}
        />
      ),
    },
    dydxAddress &&
      dydxAddress === destinationAddress && {
        key: "v4TokenBalance",
        label: getLabel({ chain: "dYdX Chain", asset: "DYDX" }),
        value: (
          <DiffOutput
            type={OutputType.Asset}
            value={v4TokenBalance}
            newValue={amountBN?.plus(v4TokenBalance ?? 0).toNumber() ?? 0}
            sign={NumberSign.Positive}
            withDiff={Boolean(v4TokenBalance !== undefined && amountBN)}
            roundingMode={BigNumber.ROUND_DOWN}
            isLoading={v4TokenBalance === undefined}
          />
        ),
      },
  ].filter(isTruthy);

  return (
    <WithDetailsReceipt
      detailItems={migrateDetailItems}
      hideReceipt={!evmAddress}
    >
      {!canAccountMigrate ? (
        <OnboardingTriggerButton size={ButtonSize.Base} />
      ) : (
        <Button
          action={ButtonAction.Primary}
          type={ButtonType.Submit}
          state={{ isLoading, isDisabled }}
        >
          {stringGetter({ key: STRING_KEYS.PREVIEW_MIGRATION })}
        </Button>
      )}
    </WithDetailsReceipt>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.InlineRow = styled.span`
  ${layoutMixins.inlineRow}
`;

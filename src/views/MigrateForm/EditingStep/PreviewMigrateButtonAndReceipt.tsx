import { useSelector } from "react-redux";
import BigNumber from "bignumber.js";

import { ButtonAction, ButtonSize, ButtonType } from "@/constants/buttons";
import { STRING_KEYS } from "@/constants/localization";
import { NumberSign } from "@/constants/numbers";

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
  const { dydxAddress } = useAccounts() || {};
  const { amountBN, destinationAddress } = useMigrateToken();
  const { v3TokenBalance, v4TokenBalance, wethDYDXBalance } =
    useAccountBalance();

  const canAccountMigrate = useSelector(calculateCanAccountMigrate);

  const migrateDetailItems = [
    {
      key: "v3TokenBalance",
      label: (
        <span>
          Balance on Ethereum <Tag>dv3tnt</Tag>
        </span>
      ),
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
        />
      ),
    },
    {
      key: "wethDYDXBalance",
      label: (
        <span>
          Balance on Ethereum <Tag>wethDYDX</Tag>
        </span>
      ),
      value: (
        <DiffOutput
          type={OutputType.Asset}
          value={wethDYDXBalance}
          newValue={amountBN?.plus(wethDYDXBalance ?? 0).toNumber() ?? 0}
          sign={NumberSign.Positive}
          withDiff={Boolean(wethDYDXBalance !== undefined && amountBN)}
          roundingMode={BigNumber.ROUND_DOWN}
        />
      ),
    },
    dydxAddress &&
      dydxAddress === destinationAddress && {
        key: "v4TokenBalance",
        label: (
          <span>
            {stringGetter({ key: STRING_KEYS.BALANCE })} <Tag>dv4tnt</Tag>
          </span>
        ),
        value: (
          <DiffOutput
            type={OutputType.Asset}
            value={v4TokenBalance}
            newValue={amountBN?.plus(v4TokenBalance).toNumber() ?? 0}
            sign={NumberSign.Positive}
            withDiff={Boolean(v4TokenBalance !== undefined && amountBN)}
            roundingMode={BigNumber.ROUND_DOWN}
          />
        ),
      },
  ].filter(isTruthy);

  return (
    <WithDetailsReceipt detailItems={migrateDetailItems}>
      {!canAccountMigrate ? (
        <OnboardingTriggerButton size={ButtonSize.Base} />
      ) : (
        <Button
          action={ButtonAction.Primary}
          type={ButtonType.Submit}
          state={{ isLoading, isDisabled }}
        >
          Preview migration
        </Button>
      )}
    </WithDetailsReceipt>
  );
};

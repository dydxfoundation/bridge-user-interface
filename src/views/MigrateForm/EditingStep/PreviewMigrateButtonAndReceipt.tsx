import { shallowEqual, useSelector } from "react-redux";
import BigNumber from "bignumber.js";

import { ButtonAction, ButtonSize, ButtonType } from "@/constants/buttons";
import { STRING_KEYS } from "@/constants/localization";
import { NumberSign } from "@/constants/numbers";

import {
  useAccounts,
  useAccountBalance,
  useMigrateToken,
  useStringGetter,
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
  const { dv3tntBalance, dv4tntBalance, wethDv3tntBalance } =
    useAccountBalance() || {};

  const canAccountMigrate = useSelector(
    calculateCanAccountMigrate,
    shallowEqual
  );

  const migrateDetailItems = [
    {
      key: "dv3tntBalance",
      label: (
        <span>
          Balance on Ethereum <Tag>dv3tnt</Tag>
        </span>
      ),
      value: (
        <DiffOutput
          type={OutputType.Asset}
          value={dv3tntBalance}
          newValue={MustBigNumber(dv3tntBalance)
            .minus(amountBN ?? 0)
            .toNumber()}
          sign={NumberSign.Negative}
          withDiff={Boolean(dv3tntBalance !== undefined && amountBN)}
          roundingMode={BigNumber.ROUND_DOWN}
        />
      ),
    },
    {
      key: "wethDv3tntBalance",
      label: (
        <span>
          Balance on Ethereum <Tag>wethDv3tnt</Tag>
        </span>
      ),
      value: (
        <DiffOutput
          type={OutputType.Asset}
          value={wethDv3tntBalance}
          newValue={amountBN?.plus(wethDv3tntBalance).toNumber() ?? 0}
          sign={NumberSign.Positive}
          withDiff={Boolean(wethDv3tntBalance !== undefined && amountBN)}
          roundingMode={BigNumber.ROUND_DOWN}
        />
      ),
    },
    dydxAddress &&
      dydxAddress === destinationAddress && {
        key: "dv4tntBalance",
        label: (
          <span>
            {stringGetter({ key: STRING_KEYS.BALANCE })} <Tag>dv4tnt</Tag>
          </span>
        ),
        value: (
          <DiffOutput
            type={OutputType.Asset}
            value={dv4tntBalance}
            newValue={amountBN?.plus(dv4tntBalance).toNumber() ?? 0}
            sign={NumberSign.Positive}
            withDiff={Boolean(dv4tntBalance !== undefined && amountBN)}
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

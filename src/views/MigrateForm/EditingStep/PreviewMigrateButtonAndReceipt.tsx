import { useSelector } from 'react-redux';
import styled, { type AnyStyledComponent } from 'styled-components';
import BigNumber from 'bignumber.js';

import { ButtonAction, ButtonSize, ButtonType } from '@/constants/buttons';
import { STRING_KEYS } from '@/constants/localization';
import { NumberSign } from '@/constants/numbers';

import { layoutMixins } from '@/styles/layoutMixins';

import { useAccounts, useAccountBalance, useStringGetter, useMigrateToken } from '@/hooks';

import { Button } from '@/components/Button';
import { DiffOutput } from '@/components/DiffOutput';
import { OutputType } from '@/components/Output';
import { Tag } from '@/components/Tag';
import { WithDetailsReceipt } from '@/components/WithDetailsReceipt';
import { OnboardingTriggerButton } from '@/views/dialogs/OnboardingTriggerButton';

import { calculateCanAccountMigrate } from '@/state/accountCalculators';

import { MustBigNumber } from '@/lib/numbers';
import { isTruthy } from '@/lib/isTruthy';

type ElementProps = {
  isDisabled?: boolean;
  isLoading?: boolean;
};

export const PreviewMigrateButtonAndReceipt = ({ isDisabled, isLoading }: ElementProps) => {
  const stringGetter = useStringGetter();
  const { dydxAddress, evmAddress } = useAccounts();
  const { amountBN, destinationAddress } = useMigrateToken();
  const { ethDYDXBalance, DYDXBalance, wethDYDXBalance } = useAccountBalance();

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
      key: 'ethDYDXBalance',
      label: getLabel({ chain: 'Ethereum', asset: 'ethDYDX' }),
      value: (
        <DiffOutput
          type={OutputType.Asset}
          value={ethDYDXBalance}
          newValue={MustBigNumber(ethDYDXBalance)
            .minus(amountBN ?? 0)
            .toNumber()}
          sign={NumberSign.Negative}
          withDiff={Boolean(ethDYDXBalance !== undefined && amountBN)}
          roundingMode={BigNumber.ROUND_DOWN}
        />
      ),
    },
    import.meta.env.VITE_BRIDGE_CONTRACT_ADDRESS && {
      key: 'wethDYDXBalance',
      label: getLabel({ chain: 'Ethereum', asset: 'wethDYDX' }),
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
        key: 'DYDXBalance',
        label: getLabel({ chain: 'dYdX Chain', asset: 'DYDX' }),
        value: (
          <DiffOutput
            type={OutputType.Asset}
            value={DYDXBalance}
            newValue={amountBN?.plus(DYDXBalance ?? 0).toNumber() ?? 0}
            sign={NumberSign.Positive}
            withDiff={Boolean(DYDXBalance !== undefined && amountBN)}
            roundingMode={BigNumber.ROUND_DOWN}
          />
        ),
      },
  ].filter(isTruthy);

  return (
    <WithDetailsReceipt detailItems={migrateDetailItems} hideReceipt={!evmAddress}>
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

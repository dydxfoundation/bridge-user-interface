import { useState } from 'react';
import styled, { type AnyStyledComponent } from 'styled-components';
import type { NumberFormatValues } from 'react-number-format';
import type { SyntheticInputEvent } from 'react-number-format/types/types';
import BigNumber from 'bignumber.js';

import { AlertType } from '@/constants/alerts';
import { ButtonShape, ButtonSize } from '@/constants/buttons';
import { STRING_KEYS } from '@/constants/localization';
import { DestinationAddressOptions } from '@/constants/migrate';
import { NumberSign, TOKEN_DECIMALS } from '@/constants/numbers';

import { formMixins } from '@/styles/formMixins';
import { layoutMixins } from '@/styles/layoutMixins';

import {
  useAccounts,
  useStringGetter,
  useAccountBalance,
  useMigrateToken,
  useRestrictions,
} from '@/hooks';

import { DiffOutput } from '@/components/DiffOutput';
import { FormInput } from '@/components/FormInput';
import { Icon, IconName } from '@/components/Icon';
import { InputType } from '@/components/Input';
import { OutputType } from '@/components/Output';
import { RadioGroup } from '@/components/RadioGroup';
import { Tag } from '@/components/Tag';
import { ToggleButton } from '@/components/ToggleButton';
import { WithDetailsReceipt } from '@/components/WithDetailsReceipt';

import { MustBigNumber } from '@/lib/numbers';
import { truncateAddress } from '@/lib/wallet';

import { PreviewMigrateButtonAndReceipt } from './PreviewMigrateButtonAndReceipt';

export const MigrateFormEditingStep = () => {
  const stringGetter = useStringGetter();
  const { dydxAddress: accountDydxAddress } = useAccounts();
  const { ethDYDXBalance } = useAccountBalance();
  const { isAddressSanctioned } = useRestrictions();

  const {
    amountBN,
    destinationAddress,
    setAmountBN,
    setDestinationAddress,
    isAmountValid,
    isDestinationAddressValid,
  } = useMigrateToken();

  const [destinationAddressOption, setDestinationAddressOption] = useState(
    DestinationAddressOptions.Account
  );

  const ethDYDXBalanceBN = MustBigNumber(ethDYDXBalance);
  const newEthDYDXBalanceBN = ethDYDXBalanceBN.minus(amountBN ?? 0);

  const onOptionChange = (option: string) => {
    if (option === DestinationAddressOptions.Other) {
      setDestinationAddress('');
    } else if (accountDydxAddress) {
      setDestinationAddress(accountDydxAddress);
    }
    setDestinationAddressOption(option as DestinationAddressOptions);
  };

  const onPasteAddress = async () => {
    try {
      const value = await navigator.clipboard.readText();
      setDestinationAddress(value);
    } catch (error) {
      // expected error if user rejects clipboard access
    }
  };

  const amountDetailItems = [
    {
      key: 'amount',
      label: (
        <Styled.InlineRow>
          {stringGetter({
            key: STRING_KEYS.AVAILABLE_ON_CHAIN,
            params: {
              CHAIN: 'Ethereum',
            },
          })}
          <Tag>ethDYDX</Tag>
        </Styled.InlineRow>
      ),
      value: (
        <DiffOutput
          type={OutputType.Asset}
          value={ethDYDXBalance?.toString()}
          newValue={newEthDYDXBalanceBN.toString()}
          sign={NumberSign.Negative}
          hasInvalidNewValue={newEthDYDXBalanceBN.isNegative()}
          withDiff={ethDYDXBalance !== undefined && amountBN && amountBN.gt(0)}
          roundingMode={BigNumber.ROUND_DOWN}
        />
      ),
    },
  ];

  const renderFormInputButton = ({
    label,
    isInputEmpty,
    onClear,
    onClick,
  }: {
    label: string | React.ReactNode[];
    isInputEmpty: boolean;
    onClear: () => void;
    onClick: () => void;
  }) => (
    <Styled.FormInputToggleButton
      size={ButtonSize.XSmall}
      isPressed={!isInputEmpty}
      onPressedChange={(isPressed: boolean) => (isPressed ? onClick : onClear)()}
      shape={isInputEmpty ? ButtonShape.Rectangle : ButtonShape.Circle}
    >
      {isInputEmpty ? label : <Icon iconName={IconName.Close} />}
    </Styled.FormInputToggleButton>
  );

  return (
    <>
      <WithDetailsReceipt side="bottom" detailItems={amountDetailItems}>
        <Styled.FormInput
          id="amount"
          label={stringGetter({ key: STRING_KEYS.AMOUNT })}
          type={InputType.Number}
          onChange={({ floatValue }: NumberFormatValues) => setAmountBN(MustBigNumber(floatValue))}
          value={amountBN?.toFixed(
            Math.min(TOKEN_DECIMALS, amountBN?.dp() ?? 0),
            BigNumber.ROUND_DOWN
          )}
          slotRight={renderFormInputButton({
            label: stringGetter({ key: STRING_KEYS.MAX }),
            isInputEmpty: !amountBN,
            onClear: () => setAmountBN(undefined),
            onClick: () => ethDYDXBalance && setAmountBN(ethDYDXBalanceBN),
          })}
        />
      </WithDetailsReceipt>

      <RadioGroup
        items={[
          {
            value: DestinationAddressOptions.Account,
            label: (
              <Styled.Label>
                {stringGetter({
                  key: STRING_KEYS.GENERATED_ADDRESS_VIA_ADDRESS,
                  params: {
                    ADDRESS_OR_WALLET_SIGNATURE: (
                      <strong>
                        {accountDydxAddress
                          ? truncateAddress(accountDydxAddress)
                          : stringGetter({ key: STRING_KEYS.WALLET_SIGNATURE })}
                      </strong>
                    ),
                  },
                })}
              </Styled.Label>
            ),
            slotContent: accountDydxAddress && (
              <Styled.InnerFormInput
                label={
                  <Styled.DestinationInputLabel>
                    {stringGetter({ key: STRING_KEYS.DYDX_CHAIN_ADDRESS })}
                    <Icon iconName={IconName.Check} />
                  </Styled.DestinationInputLabel>
                }
                type={InputType.Text}
                value={truncateAddress(accountDydxAddress)}
                validationConfig={{
                  attached: true,
                  type: AlertType.Info,
                  message: stringGetter({
                    key: STRING_KEYS.GENERATED_ADDRESS_INFO,
                    params: {
                      TRADE_URL: import.meta.env.VITE_TRADE_URL || 'the trading app',
                    },
                  }),
                }}
                disabled
              />
            ),
          },
          {
            value: DestinationAddressOptions.Other,
            label: (
              <Styled.Label>
                {stringGetter({
                  key: STRING_KEYS.SEND_TO_ANOTHER_ADDRESS,
                  params: {
                    ADDRESS: (
                      <strong>{stringGetter({ key: STRING_KEYS.DYDX_CHAIN_ADDRESS })}</strong>
                    ),
                  },
                })}
              </Styled.Label>
            ),
            slotContent: (
              <Styled.AdressInputContainer>
                <Styled.InnerFormInput
                  id="destination"
                  onInput={(e: SyntheticInputEvent) => setDestinationAddress(e.target?.value)}
                  label={
                    <Styled.DestinationInputLabel>
                      {stringGetter({ key: STRING_KEYS.DYDX_CHAIN_ADDRESS })}
                      {isDestinationAddressValid && <Icon iconName={IconName.Check} />}
                    </Styled.DestinationInputLabel>
                  }
                  type={InputType.Text}
                  value={destinationAddress}
                  placeholder={stringGetter({ key: STRING_KEYS.ENTER_ADDRESS })}
                  slotRight={renderFormInputButton({
                    label: stringGetter({ key: STRING_KEYS.PASTE }),
                    isInputEmpty: !destinationAddress,
                    onClear: () => setDestinationAddress(''),
                    onClick: onPasteAddress,
                  })}
                  validationConfig={
                    destinationAddress &&
                    !isDestinationAddressValid && {
                      attached: true,
                      type: AlertType.Error,
                      message: stringGetter({
                        key: isAddressSanctioned(destinationAddress)
                          ? STRING_KEYS.MIGRATION_BLOCKED_MESSAGE_DESTINATION
                          : STRING_KEYS.INVALID_ADDRESS_BODY,
                      }),
                    }
                  }
                />
              </Styled.AdressInputContainer>
            ),
          },
        ]}
        value={destinationAddressOption}
        onValueChange={onOptionChange}
      />

      <Styled.Footer>
        <PreviewMigrateButtonAndReceipt isDisabled={!isAmountValid || !isDestinationAddressValid} />
      </Styled.Footer>
    </>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.FormInput = styled(FormInput)`
  --form-input-height: 3.5rem;
`;

Styled.InnerFormInput = styled(FormInput)`
  --input-backgroundColor: var(--color-layer-5);
  input {
    font: var(--font-mini-book);
  }
`;

Styled.Footer = styled.footer`
  ${layoutMixins.stickyFooter}
  margin-top: auto;
`;

Styled.Row = styled.div`
  ${layoutMixins.gridEqualColumns}
  gap: var(--form-input-gap);
`;

Styled.DestinationInputLabel = styled.span`
  ${layoutMixins.inlineRow}

  svg {
    color: var(--color-positive);
  }
`;

Styled.AdressInputContainer = styled.div`
  ${layoutMixins.flexColumn}
  gap: var(--form-input-gap);
  text-align: start;
`;

Styled.FormInputToggleButton = styled(ToggleButton)`
  ${formMixins.inputInnerToggleButton}

  svg {
    color: var(--color-text-0);
  }
`;

Styled.AddressOption = styled.div`
  ${layoutMixins.column}
  text-align:start;
  gap: 0.5rem;

  width: 100%;
`;

Styled.Label = styled.span`
  font: var(--font-mini-book);
`;

Styled.InlineRow = styled.span`
  ${layoutMixins.inlineRow}
`;

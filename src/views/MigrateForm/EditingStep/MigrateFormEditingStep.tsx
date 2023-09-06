import { useState } from "react";
import styled, { type AnyStyledComponent } from "styled-components";
import type { NumberFormatValues } from "react-number-format";
import type { SyntheticInputEvent } from "react-number-format/types/types";
import BigNumber from "bignumber.js";

import { AlertType } from "@/constants/alerts";
import { ButtonShape, ButtonSize } from "@/constants/buttons";
import { STRING_KEYS } from "@/constants/localization";
import { DestinationAddressOptions } from "@/constants/migrate";
import { NumberSign, TOKEN_DECIMALS } from "@/constants/numbers";

import { formMixins } from "@/styles/formMixins";
import { layoutMixins } from "@/styles/layoutMixins";

import {
  useAccounts,
  useStringGetter,
  useAccountBalance,
  useMigrateToken,
} from "@/hooks";

import { AlertMessage } from "@/components/AlertMessage";
import { DiffOutput } from "@/components/DiffOutput";
import { FormInput } from "@/components/FormInput";
import { Icon, IconName } from "@/components/Icon";
import { InputType } from "@/components/Input";
import { OutputType } from "@/components/Output";
import { RadioGroup } from "@/components/RadioGroup";
import { Tag } from "@/components/Tag";
import { ToggleButton } from "@/components/ToggleButton";
import { WithDetailsReceipt } from "@/components/WithDetailsReceipt";

import { MustBigNumber } from "@/lib/numbers";
import { truncateAddress } from "@/lib/wallet";

import { PreviewMigrateButtonAndReceipt } from "./PreviewMigrateButtonAndReceipt";

export const MigrateFormEditingStep = () => {
  const stringGetter = useStringGetter();
  const { dydxAddress: accountDydxAddress } = useAccounts();

  const { dv3tntBalance } = useAccountBalance();
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

  // BN
  const dv3tntBalanceBN = MustBigNumber(dv3tntBalance);
  const newDv3tntBalanceBN = dv3tntBalanceBN.minus(amountBN ?? 0);

  const onOptionChange = (option: string) => {
    if (option === DestinationAddressOptions.Other) {
      setDestinationAddress("");
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
      key: "amount",
      label: (
        <span>
          Available on Ethereum <Tag>dv3tnt</Tag>
        </span>
      ),
      value: (
        <DiffOutput
          type={OutputType.Asset}
          value={dv3tntBalance?.toString()}
          newValue={newDv3tntBalanceBN.toString()}
          sign={NumberSign.Negative}
          hasInvalidNewValue={newDv3tntBalanceBN.isNegative()}
          withDiff={dv3tntBalance !== undefined && amountBN && amountBN.gt(0)}
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
      onPressedChange={(isPressed: boolean) =>
        (isPressed ? onClick : onClear)()
      }
      shape={isInputEmpty ? ButtonShape.Rectangle : ButtonShape.Circle}
    >
      {isInputEmpty ? label : <Icon iconName={IconName.Close} />}
    </Styled.FormInputToggleButton>
  );

  return (
    <>
      <WithDetailsReceipt side="bottom" detailItems={amountDetailItems}>
        <Styled.FormInput
          label={stringGetter({ key: STRING_KEYS.AMOUNT })}
          type={InputType.Number}
          onChange={({ floatValue }: NumberFormatValues) =>
            setAmountBN(MustBigNumber(floatValue))
          }
          value={amountBN?.toFixed(
            Math.min(TOKEN_DECIMALS, amountBN?.dp() ?? 0),
            BigNumber.ROUND_DOWN
          )}
          slotRight={renderFormInputButton({
            label: stringGetter({ key: STRING_KEYS.MAX }),
            isInputEmpty: !amountBN,
            onClear: () => setAmountBN(undefined),
            onClick: () => dv3tntBalance && setAmountBN(dv3tntBalanceBN),
          })}
        />
      </WithDetailsReceipt>

      <RadioGroup
        items={[
          {
            value: DestinationAddressOptions.Account,
            label: (
              <Styled.Label>
                Generated dYdX address via{" "}
                <b>
                  {accountDydxAddress
                    ? truncateAddress(accountDydxAddress)
                    : "wallet signature"}
                </b>
              </Styled.Label>
            ),
            slotContent: accountDydxAddress && (
              <Styled.InnerFormInput
                id="destination"
                label={
                  <Styled.DestinationInputLabel>
                    dYdX address
                    <Icon iconName={IconName.Check} />
                  </Styled.DestinationInputLabel>
                }
                type={InputType.Text}
                value={accountDydxAddress}
                disabled
              />
            ),
          },
          {
            value: DestinationAddressOptions.Other,
            label: (
              <Styled.Label>
                Send to another <b>dYdX Address</b>
              </Styled.Label>
            ),
            slotContent: (
              <Styled.AdressInputContainer>
                <Styled.InnerFormInput
                  id="destination"
                  onInput={(e: SyntheticInputEvent) =>
                    setDestinationAddress(e.target?.value)
                  }
                  label={
                    <Styled.DestinationInputLabel>
                      dYdX address
                      {isDestinationAddressValid && (
                        <Icon iconName={IconName.Check} />
                      )}
                    </Styled.DestinationInputLabel>
                  }
                  type={InputType.Text}
                  value={destinationAddress}
                  placeholder="Enter dYdX address"
                  slotRight={renderFormInputButton({
                    label: stringGetter({ key: STRING_KEYS.PASTE }),
                    isInputEmpty: !destinationAddress,
                    onClear: () => setDestinationAddress(""),
                    onClick: onPasteAddress,
                  })}
                />
                {destinationAddress && !isDestinationAddressValid && (
                  <AlertMessage type={AlertType.Error}>
                    {stringGetter({
                      key: STRING_KEYS.TRANSFER_INVALID_DYDX_ADDRESS,
                    })}
                  </AlertMessage>
                )}
              </Styled.AdressInputContainer>
            ),
          },
        ]}
        value={destinationAddressOption}
        onValueChange={onOptionChange}
      />

      <Styled.Footer>
        <PreviewMigrateButtonAndReceipt
          isDisabled={!isAmountValid || !isDestinationAddressValid}
        />
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

    path {
      stroke-width: 2;
    }
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
  b {
    font-weight: 500;
    color: var(--color-text-1);
  }
`;

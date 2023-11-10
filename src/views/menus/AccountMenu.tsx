import styled, { type AnyStyledComponent } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import { OnboardingState } from '@/constants/account';

import { ButtonAction, ButtonShape, ButtonSize, ButtonType } from '@/constants/buttons';

import { DialogTypes } from '@/constants/dialogs';
import { STRING_KEYS, TOOLTIP_STRING_KEYS } from '@/constants/localization';
import { wallets } from '@/constants/wallets';

import { layoutMixins } from '@/styles/layoutMixins';
import { headerMixins } from '@/styles/headerMixins';

import { useAccountBalance, useAccounts, useBreakpoints, useStringGetter } from '@/hooks';

import { OnboardingTriggerButton } from '@/views/dialogs/OnboardingTriggerButton';

import { AssetIcon } from '@/components/AssetIcon';
import { CopyButton } from '@/components/CopyButton';
import { DropdownMenu } from '@/components/DropdownMenu';
import { Icon, IconName } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { Output, OutputType } from '@/components/Output';

import { openDialog } from '@/state/dialogs';

import { getOnboardingState } from '@/state/accountSelectors';

import { isTruthy } from '@/lib/isTruthy';
import { truncateAddress } from '@/lib/wallet';
import { WithTooltip } from '@/components/WithTooltip';

export const AccountMenu = () => {
  const stringGetter = useStringGetter();
  const { isTablet } = useBreakpoints();
  const dispatch = useDispatch();
  const onboardingState = useSelector(getOnboardingState);

  const { evmAddress, walletType, dydxAddress, hdKey } = useAccounts();
  const { DYDXBalance } = useAccountBalance();

  const onRecoverKeys = () => {
    dispatch(openDialog({ type: DialogTypes.Onboarding }));
  };

  return onboardingState === OnboardingState.Disconnected ? (
    <OnboardingTriggerButton size={ButtonSize.XSmall} />
  ) : (
    <Styled.DropdownMenu
      slotTopContent={
        onboardingState === OnboardingState.AccountConnected && (
          <Styled.AccountInfo>
            <Styled.AddressRow>
              <AssetIcon symbol="DYDX" />
              <Styled.Column>
                <WithTooltip
                  slotTooltip={
                    <dl>
                      <dt>
                        {stringGetter({
                          key: TOOLTIP_STRING_KEYS.DYDX_ADDRESS_BODY,
                          params: {
                            DYDX_ADDRESS: <strong>{truncateAddress(dydxAddress)}</strong>,
                            EVM_ADDRESS: truncateAddress(evmAddress, '0x'),
                          },
                        })}
                      </dt>
                    </dl>
                  }
                >
                  <Styled.Label>
                    {stringGetter({ key: STRING_KEYS.DYDX_CHAIN_ADDRESS })}
                  </Styled.Label>
                </WithTooltip>
                <Styled.Address>{truncateAddress(dydxAddress)}</Styled.Address>
              </Styled.Column>
              <Styled.CopyButton buttonType="icon" value={dydxAddress} shape={ButtonShape.Square} />
              <Styled.IconButton
                action={ButtonAction.Base}
                href={`${import.meta.env.VITE_MINTSCAN_URL}/account/${dydxAddress}`}
                iconName={IconName.LinkOut}
                shape={ButtonShape.Square}
                type={ButtonType.Link}
              />
            </Styled.AddressRow>
            <Styled.AddressRow>
              {walletType && (
                <Styled.SourceIcon>
                  <Styled.ConnectorIcon iconName={IconName.AddressConnector} />
                  <Icon iconComponent={wallets[walletType].icon} />
                </Styled.SourceIcon>
              )}
              <Styled.Column>
                <Styled.Label>{stringGetter({ key: STRING_KEYS.SOURCE_ADDRESS })}</Styled.Label>
                <Styled.Address>{truncateAddress(evmAddress, '0x')}</Styled.Address>
              </Styled.Column>

              <Styled.CopyButton buttonType="icon" value={evmAddress} shape={ButtonShape.Square} />

              <Styled.IconButton
                action={ButtonAction.Base}
                href={`${import.meta.env.VITE_ETHERSCAN_URL}/address/${evmAddress}`}
                iconName={IconName.LinkOut}
                shape={ButtonShape.Square}
                type={ButtonType.Link}
              />
            </Styled.AddressRow>
            <Styled.Balance>
              <Styled.Label>
                {stringGetter({
                  key: STRING_KEYS.ASSET_BALANCE,
                  params: { ASSET: 'DYDX' },
                })}
              </Styled.Label>
              <Styled.BalanceOutput type={OutputType.Asset} value={DYDXBalance} />
            </Styled.Balance>
          </Styled.AccountInfo>
        )
      }
      items={[
        onboardingState === OnboardingState.WalletConnected && {
          value: 'ConnectToChain',
          label: (
            <Styled.ConnectToChain>
              <p>{stringGetter({ key: STRING_KEYS.MISSING_KEYS_DESCRIPTION })}</p>
              <OnboardingTriggerButton />
            </Styled.ConnectToChain>
          ),
          onSelect: onRecoverKeys,
          separator: true,
        },
        onboardingState === OnboardingState.AccountConnected &&
          hdKey && {
            value: 'MnemonicExport',
            icon: <Icon iconName={IconName.ExportKeys} />,
            label: stringGetter({ key: STRING_KEYS.EXPORT_SECRET_PHRASE }),
            highlightColor: 'negative',
            onSelect: () => dispatch(openDialog({ type: DialogTypes.MnemonicExport })),
          },
        {
          value: 'Disconnect',
          icon: <Icon iconName={IconName.BoxClose} />,
          label: stringGetter({ key: STRING_KEYS.DISCONNECT }),
          highlightColor: 'negative',
          onSelect: () => dispatch(openDialog({ type: DialogTypes.DisconnectWallet })),
        },
      ].filter(isTruthy)}
      align="end"
      sideOffset={16}
    >
      {onboardingState === OnboardingState.WalletConnected ? (
        <Styled.WarningIcon iconName={IconName.Warning} />
      ) : onboardingState === OnboardingState.AccountConnected ? (
        walletType && <Icon iconComponent={wallets[walletType].icon} />
      ) : null}
      {!isTablet && <Styled.Address>{truncateAddress(dydxAddress)}</Styled.Address>}
    </Styled.DropdownMenu>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.AccountInfo = styled.div`
  ${layoutMixins.flexColumn}

  gap: 1rem;
  padding: 1rem 1rem 0.5rem 1rem;
`;

Styled.Column = styled.div`
  ${layoutMixins.column}
`;

Styled.InlineRow = styled.div`
  ${layoutMixins.inlineRow}
`;

Styled.AddressRow = styled.div`
  ${layoutMixins.row}

  gap: 0.5rem;

  ${Styled.Column} {
    margin-right: auto;
  }

  > img {
    font-size: 1.75rem;
  }
`;

Styled.SourceIcon = styled.div`
  padding: 0.375rem;
  position: relative;
  z-index: 1;

  font-size: 1rem;

  line-height: 0;
  border-radius: 50%;
  background-color: #303045;
`;

Styled.ConnectorIcon = styled(Icon)`
  position: absolute;
  top: -1.625rem;
  height: 1.75rem;
`;

Styled.Label = styled.div`
  ${layoutMixins.row}

  gap: 0.25rem;
  font-size: var(--fontSize-mini);
  color: var(--color-text-0);

  img {
    font-size: 1rem;
  }
`;

Styled.DropdownMenu = styled(DropdownMenu)`
  ${headerMixins.dropdownTrigger}

  --dropdownMenu-item-font-size: 0.875rem;
  --popover-padding: 0 0 0.5rem 0;
`;

Styled.WarningIcon = styled(Icon)`
  font-size: 1.25rem;
  color: var(--color-warning);
`;

Styled.Address = styled.span`
  font: var(--font-base-book);
  font-feature-settings: var(--fontFeature-monoNumbers);
`;

Styled.ConnectToChain = styled(Styled.Column)`
  max-width: 12em;
  gap: 0.5rem;
  text-align: center;

  p {
    color: var(--color-text-1);
    font: var(--font-small-book);
  }
`;

Styled.Balance = styled.div`
  padding: 0.5rem 1rem;

  background-color: var(--color-layer-4);
  border-radius: 0.5rem;
`;

Styled.BalanceOutput = styled(Output)`
  font-size: var(--fontSize-medium);
`;

Styled.IconButton = styled(IconButton)`
  --button-padding: 0 0.25rem;
  --button-border: solid var(--border-width) var(--color-layer-6);
`;

Styled.CopyButton = styled(CopyButton)`
  --button-padding: 0 0.25rem;
  --button-border: solid var(--border-width) var(--color-layer-6);
`;

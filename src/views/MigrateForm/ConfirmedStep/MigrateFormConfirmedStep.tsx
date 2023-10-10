import styled, { type AnyStyledComponent, css } from 'styled-components';
import BigNumber from 'bignumber.js';

import { ButtonAction, ButtonType } from '@/constants/buttons';
import { TransactionStatus } from '@/constants/migrate';
import { STRING_KEYS } from '@/constants/localization';

import { layoutMixins } from '@/styles/layoutMixins';

import { useAccounts, useMigrateToken, useStringGetter } from '@/hooks';

import { AssetIcon } from '@/components/AssetIcon';
import { Button } from '@/components/Button';
import { CopyButton } from '@/components/CopyButton';
import { DetailsReceipt } from '@/components/DetailsReceipt';
import { Link } from '@/components/Link';
import { LoadingDots } from '@/components/Loading/LoadingDots';
import { Output, OutputType, ShowSign } from '@/components/Output';
import { Ring } from '@/components/Ring';
import { Tag, TagSign } from '@/components/Tag';

import { truncateAddress } from '@/lib/wallet';

import { TokensBeforeAfterDiagram } from '../TokensBeforeAfterDiagram';
import { FinalizingCountdownTimer } from './FinalizingCountdownTimer';

export const MigrateFormConfirmedStep = () => {
  const stringGetter = useStringGetter();

  const {
    amountBN,
    destinationAddress,
    resetForm,
    bridgeTxHash,
    transactionStatus,
    bridgeTxError,
    numBlocksTillFinalized,
  } = useMigrateToken();

  const { evmAddress } = useAccounts();

  const getAssetOnChainLabel = ({ asset, chain }: { asset: string; chain: string }) => (
    <span>
      {asset} {stringGetter({ key: STRING_KEYS.ON_CHAIN, params: { CHAIN: chain } })}
    </span>
  );

  return (
    <>
      <TokensBeforeAfterDiagram />

      <DetailsReceipt
        header={stringGetter({ key: STRING_KEYS.ETHEREUM_SETTLEMENT })}
        headerIcon={<AssetIcon symbol="ETH" />}
        detailItems={[
          {
            key: 'transaction',
            label: (
              <Styled.InlineRow>
                {transactionStatus > TransactionStatus.NotStarted &&
                  transactionStatus < TransactionStatus.Finalized &&
                  !bridgeTxError && <Ring withAnimation value={0.25} />}
                {stringGetter({ key: STRING_KEYS.TRANSACTION })}
                {transactionStatus >= TransactionStatus.Finalized ? (
                  <Tag sign={TagSign.Positive}>{stringGetter({ key: STRING_KEYS.FINALIZED })}</Tag>
                ) : bridgeTxError ? (
                  <Tag sign={TagSign.Negative}>{stringGetter({ key: STRING_KEYS.FAILED })}</Tag>
                ) : (
                  transactionStatus === TransactionStatus.Unfinalized && (
                    <FinalizingCountdownTimer numBlocksTillFinalized={numBlocksTillFinalized} />
                  )
                )}
              </Styled.InlineRow>
            ),
            value: (
              <Link href={`${import.meta.env.VITE_ETHERSCAN_URL}/tx/${bridgeTxHash}`} withIcon>
                {stringGetter({ key: STRING_KEYS.BLOCK_EXPLORER })}
              </Link>
            ),
          },
          {
            key: 'address',
            label: stringGetter({ key: STRING_KEYS.ADDRESS }),
            value: (
              <CopyButton buttonType="text" value={evmAddress}>
                {truncateAddress(evmAddress, '0x')}
              </CopyButton>
            ),
          },
          {
            key: 'wethDYDX',
            label: getAssetOnChainLabel({
              asset: 'wethDYDX',
              chain: 'Ethereum',
            }),
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
            key: 'ethDYDX',
            label: getAssetOnChainLabel({
              asset: 'ethDYDX',
              chain: 'Ethereum',
            }),
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
        header={stringGetter({ key: STRING_KEYS.DYDX_CHAIN_SETTLEMENT })}
        headerIcon={<AssetIcon symbol="DYDX" />}
        detailItems={[
          {
            key: 'transaction',
            label: (
              <Styled.InlineRow>
                {transactionStatus === TransactionStatus.Finalized && (
                  <Ring withAnimation value={0.25} />
                )}
                {stringGetter({ key: STRING_KEYS.TRANSACTION })}
                <Styled.StartedTag
                  hasStarted={transactionStatus === TransactionStatus.Acknowledged}
                >
                  {stringGetter({
                    key:
                      transactionStatus < TransactionStatus.Acknowledged
                        ? STRING_KEYS.NOT_STARTED
                        : STRING_KEYS.STARTED,
                  })}
                </Styled.StartedTag>
              </Styled.InlineRow>
            ),
            value: stringGetter({
              key: STRING_KEYS.X_HOURS_LOWERCASED,
              params: { X: '~40' },
            }),
          },
          {
            key: 'address',
            label: stringGetter({ key: STRING_KEYS.ADDRESS }),
            value: (
              <CopyButton buttonType="text" value={destinationAddress}>
                {truncateAddress(destinationAddress)}
              </CopyButton>
            ),
          },
          {
            key: 'DYDX',
            label: getAssetOnChainLabel({
              asset: 'DYDX',
              chain: 'dYdX Chain',
            }),
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

      {bridgeTxError ? (
        <Styled.ButtonRow>
          <Styled.SubmitButton action={ButtonAction.Primary} type={ButtonType.Submit}>
            {stringGetter({ key: STRING_KEYS.RETRY_MIGRATION })}
          </Styled.SubmitButton>
        </Styled.ButtonRow>
      ) : transactionStatus < TransactionStatus.Acknowledged ? (
        <Styled.FooterNote>
          {transactionStatus < TransactionStatus.Finalized ? (
            stringGetter({ key: STRING_KEYS.PROGRESS_TRACKING_WARNING })
          ) : (
            <LoadingDots size={3} />
          )}
        </Styled.FooterNote>
      ) : (
        <Styled.ButtonRow>
          <Styled.ResetButton onClick={() => resetForm(true)}>
            {stringGetter({ key: STRING_KEYS.NEW_MIGRATION })}
          </Styled.ResetButton>
          <Styled.SubmitButton action={ButtonAction.Primary} type={ButtonType.Submit}>
            {stringGetter({ key: STRING_KEYS.CHECK_STATUS })}
          </Styled.SubmitButton>
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

Styled.StartedTag = styled(Tag)<{ hasStarted: boolean }>`
  color: var(--color-text-1);

  ${({ hasStarted }) =>
    hasStarted &&
    css`
      color: #ffcc48;
      background-color: #ffcc4816;
    `}
`;

Styled.FooterNote = styled.span`
  font: var(--font-small-book);
  color: var(--color-text-0);
  text-align: center;
`;

Styled.LoadingDotsContainer = styled.div`
  text-align: center;
`;

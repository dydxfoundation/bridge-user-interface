import styled, { type AnyStyledComponent } from 'styled-components';

import { STRING_KEYS, StringGetterFunction } from '@/constants/localization';

import {
  DYDX_CHAIN_ESTIMATED_BLOCK_TIME_MS,
  PendingMigrationData,
  PendingMigrationFilter,
} from '@/constants/migrate';

import { useStringGetter, usePendingMigrationsData, useAccounts, useBreakpoints } from '@/hooks';

import breakpoints from '@/styles/breakpoints';
import { layoutMixins } from '@/styles/layoutMixins';

import { AssetIcon } from '@/components/AssetIcon';
import { CopyButton } from '@/components/CopyButton';
import { Icon, IconName } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { Input, InputType } from '@/components/Input';
import { Output, OutputType } from '@/components/Output';
import { ToggleGroup } from '@/components/ToggleGroup';
import { type ColumnDef, Table, TableCell } from '@/components/Table';
import { VerticalSeparator } from '@/components/Separator';
import { WithLabel } from '@/components/WithLabel';

import { truncateAddress } from '@/lib/wallet';
import { formatRelativeTimeFromMs } from '@/lib/dateTime';

export enum PendingMigrationsTableColumnKey {
  Address = 'Address',
  Amount = 'Amount',
  BlockHeight = 'BlockHeight',
}

const getPendingMigrationsTableColumnDef = ({
  key,
  latestBlockHeight,
  stringGetter,
}: {
  key: PendingMigrationsTableColumnKey;
  latestBlockHeight?: number;
  stringGetter: StringGetterFunction;
}): ColumnDef<PendingMigrationData> =>
  (
    ({
      [PendingMigrationsTableColumnKey.Address]: {
        columnKey: PendingMigrationsTableColumnKey.Address,
        getCellValue: (row) => row.address,
        label: stringGetter({ key: STRING_KEYS.DYDX_CHAIN_ADDRESS }),
        renderCell: ({ address }) => (
          <CopyButton buttonType="text" value={address}>
            {truncateAddress(address)}
          </CopyButton>
        ),
      },
      [PendingMigrationsTableColumnKey.Amount]: {
        columnKey: PendingMigrationsTableColumnKey.Amount,
        getCellValue: (row) => row.amount.toNumber(),
        label: stringGetter({ key: STRING_KEYS.AMOUNT }),
        renderCell: ({ amount }) => (
          <Styled.InlineRow>
            <Output type={OutputType.Asset} value={amount} />
            <AssetIcon symbol="DYDX" />
          </Styled.InlineRow>
        ),
      },
      [PendingMigrationsTableColumnKey.BlockHeight]: {
        columnKey: PendingMigrationsTableColumnKey.BlockHeight,
        getCellValue: (row) => row.blockHeight,
        label: stringGetter({ key: STRING_KEYS.ESTIMATED_TIME_LEFT }),
        renderCell: ({ blockHeight }) => (
          <TableCell stacked>
            {latestBlockHeight && blockHeight > latestBlockHeight && (
              <Output
                type={OutputType.Text}
                value={formatRelativeTimeFromMs(
                  (blockHeight - latestBlockHeight) * DYDX_CHAIN_ESTIMATED_BLOCK_TIME_MS,
                  {
                    format: 'short',
                  }
                )}
              />
            )}
            <Styled.InlineRow>
              {stringGetter({ key: STRING_KEYS.AVAILABLE_BLOCK })}
              <Output type={OutputType.Number} value={blockHeight} />
            </Styled.InlineRow>
          </TableCell>
        ),
      },
    }) as Record<PendingMigrationsTableColumnKey, ColumnDef<PendingMigrationData>>
  )[key];

export const PendingMigrationsTable = ({
  columnKeys = Object.values(PendingMigrationsTableColumnKey),
  className,
}: {
  columnKeys?: PendingMigrationsTableColumnKey[];
  className?: string;
}) => {
  const stringGetter = useStringGetter();
  const { dydxAddress } = useAccounts();
  const { isNotMobile } = useBreakpoints();

  const {
    pendingMigrations,
    filter,
    setFilter,
    addressSearchFilter,
    setAddressSearchFilter,
    latestBlockHeight,
  } = usePendingMigrationsData();

  const showTitle = latestBlockHeight || isNotMobile;
  const showAddressSearchInput = filter === PendingMigrationFilter.All;

  return (
    <Styled.Container className={className}>
      <Styled.Header showTitle={showTitle}>
        {showTitle && (
          <Styled.TableTitle>
            <h3>{stringGetter({ key: STRING_KEYS.PENDING_MIGRATIONS })}</h3>
            {latestBlockHeight && (
              <span>
                {stringGetter({ key: STRING_KEYS.LATEST_BLOCK_HEIGHT })}:{' '}
                <Output type={OutputType.Number} value={latestBlockHeight} />
              </span>
            )}
          </Styled.TableTitle>
        )}
        <Styled.Filters>
          {showAddressSearchInput && (
            <Styled.InputContainer label={<Icon iconName={IconName.Search} />} inputID="search">
              <Input
                id="search"
                placeholder={stringGetter({
                  key: STRING_KEYS.SEARCH_DYDX_CHAIN_ADDRESS,
                })}
                type={InputType.Search}
                value={addressSearchFilter}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setAddressSearchFilter(e.target.value);
                }}
              />
              {addressSearchFilter !== '' && (
                <Styled.ClearButton
                  iconName={IconName.Close}
                  onClick={() => setAddressSearchFilter('')}
                />
              )}
            </Styled.InputContainer>
          )}
          {dydxAddress && (
            <>
              {showAddressSearchInput && <Styled.VerticalSeparator />}
              <Styled.ToggleGroup
                items={[
                  {
                    value: PendingMigrationFilter.Mine,
                    label: stringGetter({ key: STRING_KEYS.MINE }),
                  },
                  {
                    value: PendingMigrationFilter.All,
                    label: stringGetter({ key: STRING_KEYS.ALL }),
                  },
                ]}
                value={filter}
                onValueChange={(val: string) => setFilter(val as PendingMigrationFilter)}
              />
            </>
          )}
        </Styled.Filters>
      </Styled.Header>
      <Styled.Table
        data={pendingMigrations}
        getRowKey={(row: PendingMigrationData) => row.id}
        label="Pending migrations"
        columns={columnKeys.map((key: PendingMigrationsTableColumnKey) =>
          getPendingMigrationsTableColumnDef({
            key,
            stringGetter,
            latestBlockHeight,
          })
        )}
        slotEmpty={
          <Styled.EmptyText>
            {stringGetter({
              key:
                filter === PendingMigrationFilter.Mine
                  ? STRING_KEYS.EMPTY_PENDING_MIGRATIONS_MINE
                  : addressSearchFilter !== ''
                  ? STRING_KEYS.EMPTY_PENDING_MIGRATIONS_SEARCH
                  : STRING_KEYS.EMPTY_PENDING_MIGRATIONS_ALL,
              params: {
                SEARCH_STRING: (
                  <Styled.HighlightedText>"{addressSearchFilter}"</Styled.HighlightedText>
                ),
              },
            })}
          </Styled.EmptyText>
        }
      />
    </Styled.Container>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Container = styled.div`
  border: var(--border-width) solid var(--border-color);
  border-radius: 0.625rem;

  @media ${breakpoints.mobile} {
    border-radius: 0;
  }
`;

Styled.Header = styled.div<{ showTitle: boolean }>`
  ${layoutMixins.spacedRow}
  gap: 1rem;

  ${({ showTitle }) => !showTitle && layoutMixins.inlineRow}

  width: 100%;
  height: 4rem;
  padding: 0.25rem 1.5rem;
  overflow-x: scroll;

  background-color: var(--color-layer-3);
  border-bottom: var(--border-width) solid var(--border-color);
  border-radius: 0.625rem 0.625rem 0 0;

  h3 {
    font: var(--font-medium-book);
  }

  @media ${breakpoints.mobile} {
    border-radius: 0;

    h3 {
      display: none;
    }
  }
`;

Styled.EmptyText = styled.div`
  max-width: 49.25rem;
  text-align: center;
`;

Styled.Table = styled(Table)`
  --tableCell-padding: 1rem 1.5rem;
  --table-cell-align: end;
  --tableHeader-backgroundColor: var(--color-layer-0);
  overflow-x: scroll;

  font: var(--font-small-book);

  thead {
    @media ${breakpoints.notMobile} {
      font: var(--font-base-book);
    }
  }

  :last-child {
    border-radius: 0 0 0.625rem 0.625rem;

    @media ${breakpoints.mobile} {
      border-radius: 0;
    }
  }
`;

Styled.InlineRow = styled.div`
  ${layoutMixins.inlineRow}

  img {
    height: 1.25em;
  }
`;

Styled.VerticalSeparator = styled(VerticalSeparator)`
  && {
    height: 1.5rem;
  }

  @media ${breakpoints.mobile} {
    display: none;
  }
`;

Styled.Filters = styled.div`
  ${layoutMixins.row}
  justify-content: end;
  width: 100%;
  gap: 0.5rem;
`;

Styled.InputContainer = styled(WithLabel)`
  ${layoutMixins.inlineRow}
  --border-color: var(--color-layer-6);
  --input-backgroundColor: var(--color-layer-4);
  --input-font: var(--font-mini-book);
  --input-height: 1.75rem;

  gap: 0;
  min-width: 13rem;
  padding: 0 0.25rem 0 0.5rem;
  height: var(--input-height);

  background-color: var(--input-backgroundColor);
  border: var(--border-width) solid var(--border-color);
  border-radius: 6em;

  :focus-within {
    --input-backgroundColor: var(--color-layer-1);
  }

  @media ${breakpoints.tablet} {
    --input-font: var(--font-small-book);
    --input-height: 2.25rem;
  }

  @media ${breakpoints.mobile} {
    :not(:focus-within, :only-child) {
      min-width: 5rem;
    }
  }

  label {
    cursor: text;
  }

  input {
    padding-left: 0.5ch;
    font: var(--input-font);
  }

  svg {
    font-size: 1.125rem;
    color: var(--color-text-0);
  }
`;

Styled.ToggleGroup = styled(ToggleGroup)`
  --button-toggle-off-backgroundColor: var(--color-layer-4);
`;

Styled.ClearButton = styled(IconButton)`
  --button-backgroundColor: transparent;
  --button-border: none;

  svg {
    font-size: 0.625em;
  }
`;

Styled.HighlightedText = styled.span`
  color: var(--color-text-2);
`;

Styled.TableTitle = styled.div`
  font: var(--font-mini-book);

  span {
    ${layoutMixins.inlineRow}

    color: var(--color-text-0);

    @media ${breakpoints.mobile} {
      ${layoutMixins.column}
    }

    output {
      color: var(--color-text-1);
    }
  }
`;

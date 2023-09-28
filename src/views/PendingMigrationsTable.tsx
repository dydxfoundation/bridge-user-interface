import { useEffect, useState } from "react";
import styled, { css, type AnyStyledComponent } from "styled-components";

import { STRING_KEYS, StringGetterFunction } from "@/constants/localization";

import {
  DYDX_CHAIN_ESTIMATED_BLOCK_TIME_MS,
  PendingMigrationData,
  PendingMigrationFilter,
} from "@/constants/migrate";

import {
  useStringGetter,
  usePendingMigrationsData,
  useAccounts,
} from "@/hooks";

import breakpoints from "@/styles/breakpoints";
import { layoutMixins } from "@/styles/layoutMixins";

import { CopyButton } from "@/components/CopyButton";
import { Icon, IconName } from "@/components/Icon";
import { IconButton } from "@/components/IconButton";
import { Input, InputType } from "@/components/Input";
import { Output, OutputType } from "@/components/Output";
import { ToggleGroup } from "@/components/ToggleGroup";
import { type ColumnDef, Table, TableCell } from "@/components/Table";
import { VerticalSeparator } from "@/components/Separator";
import { WithLabel } from "@/components/WithLabel";

import { truncateAddress } from "@/lib/wallet";
import { formatRelativeTimeFromMs } from "@/lib/dateTime";

export enum PendingMigrationsTableColumnKey {
  Address = "Address",
  Amount = "Amount",
  BlockHeight = "BlockHeight",
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
  ((
    {
      [PendingMigrationsTableColumnKey.Address]: {
        columnKey: PendingMigrationsTableColumnKey.Address,
        getCellValue: (row) => row.address,
        label: stringGetter({ key: STRING_KEYS.DYDX_CHAIN_ADDRESS }),
        renderCell: ({ address }) => (
          <CopyButton shownAsText value={address}>
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
            <Icon iconName={IconName.DYDX} />
          </Styled.InlineRow>
        ),
      },
      [PendingMigrationsTableColumnKey.BlockHeight]: {
        columnKey: PendingMigrationsTableColumnKey.BlockHeight,
        getCellValue: (row) => row.blockHeight,
        label: "Estimated time left",
        renderCell: ({ blockHeight }) => (
          <TableCell stacked>
            {latestBlockHeight && blockHeight - latestBlockHeight > 0 && (
              <Output
                type={OutputType.Text}
                value={formatRelativeTimeFromMs(
                  (blockHeight - latestBlockHeight) *
                    DYDX_CHAIN_ESTIMATED_BLOCK_TIME_MS,
                  {
                    locale: undefined,
                    format: "short",
                  }
                )}
              />
            )}
            <Styled.InlineRow>
              Available block
              <Output type={OutputType.Number} value={blockHeight} />
            </Styled.InlineRow>
          </TableCell>
        ),
      },
    } as Record<
      PendingMigrationsTableColumnKey,
      ColumnDef<PendingMigrationData>
    >
  )[key]);

export const PendingMigrationsTable = ({
  columnKeys = Object.values(PendingMigrationsTableColumnKey),
  className,
}: {
  columnKeys?: PendingMigrationsTableColumnKey[];
  className?: string;
}) => {
  const stringGetter = useStringGetter();
  const { dydxAddress } = useAccounts();

  const {
    pendingMigrations,
    filter,
    setFilter,
    addressSearchFilter,
    setAddressSearchFilter,
    latestBlockHeight,
  } = usePendingMigrationsData();

  return (
    <Styled.Container className={className}>
      <Styled.Header showFilters={!!dydxAddress}>
        <h3>Pending Migrations</h3>
        <Styled.InputContainer
          label={<Icon iconName={IconName.Search} />}
          inputId="search"
        >
          <Input
            id="search"
            placeholder="Search dYdX Chain address"
            type={InputType.Search}
            value={addressSearchFilter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setAddressSearchFilter(e.target.value);
            }}
          />
          {addressSearchFilter !== "" && (
            <Styled.ClearButton
              iconName={IconName.Close}
              onClick={() => setAddressSearchFilter("")}
            />
          )}
        </Styled.InputContainer>

        {dydxAddress && (
          <>
            <Styled.VerticalSeparator />
            <Styled.ToggleGroup
              items={[
                {
                  value: PendingMigrationFilter.Mine,
                  label: "Mine",
                },
                {
                  value: PendingMigrationFilter.All,
                  label: "All",
                },
              ]}
              value={filter}
              onValueChange={(val: string) =>
                setFilter(val as PendingMigrationFilter)
              }
            />
          </>
        )}
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
            {filter === PendingMigrationFilter.Mine ? (
              "There are no pending migrations with your dYdX chain address currently."
            ) : addressSearchFilter !== "" ? (
              <span>
                There are no pending migrations with address matching{" "}
                <Styled.HighlightedText>
                  "{addressSearchFilter}"
                </Styled.HighlightedText>{" "}
                currently.
              </span>
            ) : (
              "There are no pending migrations currently."
            )}
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

Styled.Header = styled.div<{ showFilters: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr var(--border-width) auto;
  align-items: center;
  gap: 1rem;

  justify-content: end;
  width: 100%;
  height: 4rem;
  padding: 1rem 1.5rem;

  background-color: var(--color-layer-3);
  border-bottom: var(--border-width) solid var(--border-color);
  border-radius: 0.625rem 0.625rem 0 0;

  h3 {
    font: var(--font-medium-book);
  }

  ${({ showFilters }) =>
    !showFilters &&
    css`
      grid-template-columns: 1fr 1fr;
    `}

  @media ${breakpoints.mobile} {
    grid-template-columns: 1fr var(--border-width) auto;
    border-radius: 0;

    h3 {
      display: none;
    }

    ${({ showFilters }) =>
      !showFilters &&
      css`
        grid-template-columns: 1fr;
      `}
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

  font: var(--font-small-book);

  thead {
    font: var(--font-base-book);
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
`;

Styled.ToggleGroup = styled(ToggleGroup)`
  --button-toggle-off-backgroundColor: var(--color-layer-4);
`;

Styled.VerticalSeparator = styled(VerticalSeparator)`
  && {
    height: 1.5rem;
  }
`;

Styled.InputContainer = styled(WithLabel)`
  ${layoutMixins.inlineRow}
  --border-color: var(--color-layer-6);
  --input-backgroundColor: var(--color-layer-4);
  --input-font: var(--font-mini-book);
  --input-height: 1.75rem;

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

  label {
    cursor: text;
  }

  input {
    font: var(--input-font);
  }

  svg {
    font-size: 1.125rem;
    color: var(--color-text-0);
  }
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

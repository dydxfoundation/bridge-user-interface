import React, { Key, useEffect } from 'react';
import styled, { type AnyStyledComponent } from 'styled-components';

import {
  useTable,
  useTableCell,
  useTableColumnHeader,
  useTableRow,
  useTableHeaderRow,
  useTableRowGroup,
  useCollator,
} from 'react-aria';

import { TriangleDownIcon } from '@radix-ui/react-icons';

import { type TableCollection } from '@react-types/table';
import type { Node, SortDescriptor, SortDirection, CollectionChildren } from '@react-types/shared';

import {
  Cell,
  Column,
  Row,
  TableBody,
  TableHeader,
  type TableState,
  useTableState,
} from '@react-stately/table';

import { useAsyncList } from 'react-stately';

import breakpoints from '@/styles/breakpoints';
import { layoutMixins } from '@/styles/layoutMixins';

import { Icon, IconName } from './Icon';
import { Tag } from './Tag';

export { TableCell } from './Table/TableCell';
export { TableColumnHeader } from './Table/TableColumnHeader';

export type TableItem<TableRowData> = {
  value: TableRowData;

  slotBefore?: () => React.ReactNode;
  label: string;
  tag?: React.ReactNode;
  slotAfter?: () => React.ReactNode;
};

export type ColumnDef<TableRowData extends object> = {
  columnKey: string;
  label: React.ReactNode;
  tag?: React.ReactNode;
  colspan?: number;
  childColumns?: ColumnDef<TableRowData>[];
  getCellValue: (row: TableRowData) => string | number;
  allowsSorting?: boolean;
  renderCell: (row: TableRowData) => React.ReactNode;
};

type ElementProps<TableRowData extends object, TableRowKey extends Key> = {
  label?: string;
  columns: ColumnDef<TableRowData>[];
  data: TableRowData[];
  getRowKey: (rowData: TableRowData, rowIndex?: number) => TableRowKey;
  defaultSortDescriptor?: SortDescriptor;
  slotEmpty?: React.ReactNode;
};

type StyleProps = {
  className?: string;
};

export type TableConfig<TableRowData> = TableItem<TableRowData>[];

export const Table = <TableRowData extends object, TableRowKey extends Key>({
  label = '',
  columns,
  data = [],
  getRowKey,
  defaultSortDescriptor,
  slotEmpty,
  className,
}: ElementProps<TableRowData, TableRowKey> & StyleProps) => {
  const collator = useCollator();

  const sortFn = (
    a: TableRowData,
    b: TableRowData,
    sortColumn?: Key,
    sortDirection?: SortDirection
  ) => {
    if (!sortColumn) return 0;

    const column = columns.find((column) => column.columnKey === sortColumn);
    const first = column?.getCellValue(a);
    const second = column?.getCellValue(b);

    return (
      // Compare the items by the sorted column
      (isNaN(first as number)
        ? // String
          collator.compare(first as string, second as string)
        : // Number
          Math.sign(
            (parseInt(first as string) || (first as number)) -
              (parseInt(second as string) || (second as number))
          )) *
      // Flip the direction if descending order is specified.
      (sortDirection === 'descending' ? -1 : 1)
    );
  };

  const list = useAsyncList<TableRowData>({
    getKey: getRowKey,
    load: async ({ sortDescriptor }) => ({
      items: sortDescriptor?.column
        ? data.sort((a, b) => sortFn(a, b, sortDescriptor?.column, sortDescriptor?.direction))
        : data,
    }),

    initialSortDescriptor: defaultSortDescriptor,

    sort: async ({ items, sortDescriptor }) => ({
      items: items.sort((a, b) => sortFn(a, b, sortDescriptor?.column, sortDescriptor?.direction)),
    }),
  });

  const isEmpty = data.length === 0;

  useEffect(() => {
    if (isEmpty) return;
    list.reload();
  }, [data]);

  return (
    <Styled.TableWrapper className={className}>
      {!isEmpty ? (
        <TableRoot aria-label={label} sortDescriptor={list.sortDescriptor} onSortChange={list.sort}>
          <TableHeader columns={columns}>
            {(column) => (
              <Column
                key={column.columnKey}
                childColumns={column.childColumns}
                allowsSorting={column.allowsSorting ?? true}
              >
                {column.label}
                {column.tag && <Tag>{column.tag}</Tag>}
              </Column>
            )}
          </TableHeader>

          <TableBody items={list.items}>
            {(item) => (
              <Row key={getRowKey(item)}>
                {(columnKey) => (
                  <Cell key={`${getRowKey(item)}-${columnKey}`}>
                    {columns.find((column) => column.columnKey === columnKey)?.renderCell?.(item)}
                  </Cell>
                )}
              </Row>
            )}
          </TableBody>
        </TableRoot>
      ) : (
        <Styled.Empty>{slotEmpty}</Styled.Empty>
      )}
    </Styled.TableWrapper>
  );
};

const TableRoot = <TableRowData extends object>(props: {
  'aria-label'?: string;
  sortDescriptor?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => void;
  children: CollectionChildren<TableRowData>;
}) => {
  const state = useTableState<TableRowData>(props);
  const ref = React.useRef<HTMLTableElement>(null);
  const { collection } = state;
  const { gridProps } = useTable({ 'aria-label': props['aria-label'] }, state, ref);

  return (
    <Styled.Table ref={ref} {...gridProps}>
      <TableHeadRowGroup>
        {collection.headerRows.map((headerRow) => (
          <TableHeaderRow key={headerRow.key} item={headerRow} state={state}>
            {[...headerRow.childNodes].map((column) => (
              <TableColumnHeader key={column.key} column={column} state={state} />
            ))}
          </TableHeaderRow>
        ))}
      </TableHeadRowGroup>

      <TableBodyRowGroup>
        {[...collection.body.childNodes].map((row) => (
          <TableRow key={row.key} item={row} state={state}>
            {[...row.childNodes].map((cell) => (
              <TableCell key={cell.key} cell={cell} state={state} />
            ))}
          </TableRow>
        ))}
      </TableBodyRowGroup>
    </Styled.Table>
  );
};

const TableHeadRowGroup = ({
  children,
}: { children: React.ReactNode } & {
  hidden?: boolean;
}) => {
  const { rowGroupProps } = useTableRowGroup();
  return <Styled.Thead {...rowGroupProps}>{children}</Styled.Thead>;
};

const TableBodyRowGroup = ({ children }: { children: React.ReactNode } & StyleProps) => {
  const { rowGroupProps } = useTableRowGroup();
  return <Styled.Tbody {...rowGroupProps}>{children}</Styled.Tbody>;
};

const TableHeaderRow = <TableRowData extends object>({
  item,
  state,
  children,
}: {
  item: TableCollection<TableRowData>['headerRows'][number];
  state: TableState<TableRowData>;
  children: React.ReactNode;
}) => {
  const ref = React.useRef<HTMLTableRowElement>(null);
  const { rowProps } = useTableHeaderRow({ node: item }, state, ref);
  return (
    <Styled.Tr ref={ref} {...rowProps}>
      {children}
    </Styled.Tr>
  );
};

const TableColumnHeader = <TableRowData extends object>({
  column,
  state,
}: {
  column: Node<TableRowData>;
  state: TableState<TableRowData>;
}) => {
  const ref = React.useRef<HTMLTableCellElement>(null);
  const { columnHeaderProps } = useTableColumnHeader({ node: column }, state, ref);

  return (
    <Styled.Th
      {...columnHeaderProps}
      colSpan={column.props.colspan}
      style={{ width: column.props?.width }}
      ref={ref}
    >
      <Styled.Row>
        {column.rendered}
        {column.props.allowsSorting && (
          <Styled.SortArrow
            aria-hidden="true"
            sortDirection={
              state.sortDescriptor?.column === column.key && state.sortDescriptor?.direction
            }
          >
            <TriangleDownIcon />
          </Styled.SortArrow>
        )}
      </Styled.Row>
    </Styled.Th>
  );
};

export const TableRow = <TableRowData extends object>({
  item,
  children,
  state,
  ...attrs
}: {
  item: TableCollection<TableRowData>['rows'][number];
  children: React.ReactNode;
  state: TableState<TableRowData>;
}) => {
  const ref = React.useRef<HTMLTableRowElement>(null);
  const { rowProps } = useTableRow({ node: item }, state, ref);
  return (
    <Styled.Tr ref={ref} {...rowProps} {...attrs}>
      {children}
    </Styled.Tr>
  );
};

const TableCell = <TableRowData extends object>({
  cell,
  state,
}: {
  cell: Node<TableRowData>;
  state: TableState<TableRowData>;
}) => {
  const ref = React.useRef<HTMLTableCellElement>(null);
  const { gridCellProps } = useTableCell({ node: cell }, state, ref);

  return (
    <Styled.Td {...gridCellProps} ref={ref}>
      {cell.rendered}
    </Styled.Td>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.TableWrapper = styled.div`
  // Params
  --tableHeader-textColor: var(--color-text-0, inherit);
  --tableHeader-backgroundColor: inherit;
  --table-header-height: 2rem;

  --tableRow-hover-backgroundColor: var(--color-layer-3);
  --tableRow-backgroundColor: ;

  --table-cell-align: start; // start | center | end
  --table-firstColumn-cell-align: start; // start | center | end | var(--table-cell-align)
  --table-lastColumn-cell-align: end; // start | center | end | var(--table-cell-align)
  --tableCell-padding: 0 1rem;

  // Rules

  flex: 1;

  scroll-snap-align: none;

  ${layoutMixins.stack}

  overflow: clip;
  ${layoutMixins.withOuterBorderClipped}
`;

Styled.Empty = styled.div`
  ${layoutMixins.column}
  height: 100%;

  justify-items: center;
  align-content: center;
  padding: 2rem;
  gap: 0.75em;

  color: var(--color-text-0);
  font: var(--font-base-book);
`;

Styled.Table = styled.table`
  align-self: start;
  border-collapse: separate;
  border-spacing: 0 var(--border-width);
  margin: calc(-1 * var(--border-width)) 0;

  @media ${breakpoints.tablet} {
    min-height: 6.25rem;
  }
`;

Styled.Tr = styled.tr`
  --tableRow-currentBackgroundColor: var(--tableRow-backgroundColor);
  background-color: var(--tableRow-currentBackgroundColor);
`;

Styled.Th = styled.th`
  --table-cell-currentAlign: var(--table-cell-align);

  &:first-of-type {
    --table-cell-currentAlign: var(--table-firstColumn-cell-align, var(--table-cell-align));
  }
  &:last-of-type {
    --table-cell-currentAlign: var(--table-lastColumn-cell-align, var(--table-cell-align));
  }

  white-space: nowrap;
  text-align: var(--table-cell-currentAlign);
`;

Styled.Td = styled.td`
  --table-cell-currentAlign: var(--table-cell-align);

  &:first-of-type {
    --table-cell-currentAlign: var(--table-firstColumn-cell-align, var(--table-cell-align));
  }
  &:last-of-type {
    --table-cell-currentAlign: var(--table-lastColumn-cell-align, var(--table-cell-align));
  }

  padding: var(--tableCell-padding);
  text-align: var(--table-cell-currentAlign);

  > * {
    vertical-align: middle;
  }
`;

Styled.SortArrow = styled.span<{ sortDirection: 'ascending' | 'descending' }>`
  float: right;
  margin-left: auto;

  display: inline-flex;
  transition:
    transform 0.3s var(--ease-out-expo),
    font-size 0.3s var(--ease-out-expo);

  font-size: 0.375em;

  ${Styled.Th}[aria-sort="none"] & {
    visibility: hidden;
  }

  ${Styled.Th}[aria-sort="ascending"] & {
    transform: scaleY(-1);
  }
`;

Styled.Thead = styled.thead`
  color: var(--tableHeader-textColor);
  background-color: var(--tableHeader-backgroundColor);
  ${layoutMixins.withInnerHorizontalBorders}
`;

Styled.Tbody = styled.tbody`
  ${layoutMixins.withInnerHorizontalBorders}
`;

Styled.Row = styled.div`
  ${layoutMixins.inlineRow}
  padding: var(--tableCell-padding);
`;

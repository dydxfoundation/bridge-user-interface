import BigNumber from 'bignumber.js';
import { DydxAddress } from './wallets';

export const DYDX_CHAIN_ESTIMATED_BLOCK_TIME_MS = 1_500;
export const TOKEN_DECIMAL_SHIFT = 18;

export enum MigrateTabs {
  Migrate = 'Migrate',
  PendingMigrations = 'PendingMigrations',
}

export enum MigrateFormSteps {
  Edit = 'Edit',
  Preview = 'Preview',
  Confirmed = 'Confirmed',
}

export enum TransactionStatus {
  NotStarted = 0,
  Pending = 1, // ETH transaction kicked off
  Unfinalized = 2, // ETH transaction mined, not finalized
  Finalized = 3, // ETH block finalized
  Acknowledged = 4, // V4 acknowledged bridge transaction
}

export enum DestinationAddressOptions {
  Account = 'Account',
  Other = 'Other',
}

export type PendingMigrationData = {
  id: number;
  blockHeight: number;
  address: DydxAddress;
  amount: BigNumber;
};

export enum PendingMigrationFilter {
  Mine = 'Mine',
  All = 'All',
}

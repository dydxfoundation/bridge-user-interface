export enum MigrateTabs {
  Migrate = "Migrate",
  PendingMigrations = "PendingMigrations",
}

export enum MigrateFormSteps {
  Edit = "Edit",
  Preview = "Preview",
  Confirmed = "Confirmed",
}

export enum TransactionStatus {
  NotStarted = 0,
  Pending = 1, // ETH transaction kicked off
  Unfinalized = 2, // ETH transaction mined, not finalized
  Finalized = 3, // ETH block finalized
  Acknowledged = 4, // V4 acknowledged bridge transaction
}

export enum DestinationAddressOptions {
  Account = "Account",
  Other = "Other",
}


import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';

import {
  PendingMigrationData,
  PendingMigrationFilter,
  TOKEN_DECIMAL_SHIFT,
} from '@/constants/migrate';

import { DydxAddress } from '@/constants/wallets';

import { MustBigNumber } from '@/lib/numbers';

import { useAccounts } from './useAccounts';
import { useDydxClient } from './useDydxClient';

const PENDING_MIGRATIONS_POLLING_INTERVAL = 600_000;

export const usePendingMigrationsData = ({
  interval = PENDING_MIGRATIONS_POLLING_INTERVAL,
}: {
  interval?: number;
} = {}) => {
  const { dydxAddress } = useAccounts();
  const { compositeClient } = useDydxClient();

  const [filter, setFilter] = useState(
    dydxAddress ? PendingMigrationFilter.Mine : PendingMigrationFilter.All
  );
  const [addressSearchFilter, setAddressSearchFilter] = useState<string>('');

  const { data: pendingMigrations, refetch: refetchPendingMigrations } = useQuery({
    enabled: !!compositeClient,
    queryKey: ['pollPendingMigrations'],
    queryFn: async () =>
      await compositeClient?.validatorClient.get.getDelayedCompleteBridgeMessages(),
    select: (data) =>
      (data?.messages ?? []).map(({ blockHeight, message }) => ({
        blockHeight,
        id: message?.event?.id,
        address: message?.event?.address as DydxAddress,
        amount: MustBigNumber(message?.event?.coin?.amount).shiftedBy(TOKEN_DECIMAL_SHIFT * -1),
      })) as PendingMigrationData[],
    refetchInterval: interval,
    staleTime: interval,
  });

  const filteredPendingMigrations = useMemo(
    () =>
      (pendingMigrations ?? []).filter(({ address }) =>
        address.includes(
          dydxAddress && filter === PendingMigrationFilter.Mine
            ? dydxAddress
            : addressSearchFilter.trim().toLowerCase()
        )
      ),
    [pendingMigrations, addressSearchFilter, filter, dydxAddress]
  );

  const { data: latestBlockHeight } = useQuery({
    enabled: !!compositeClient && Boolean(pendingMigrations?.length),
    queryKey: ['pollLatestBlockHeight'],
    queryFn: async () => await compositeClient?.validatorClient.get.latestBlockHeight(),
    refetchInterval: interval,
    staleTime: interval,
  });

  return {
    filter,
    setFilter,
    addressSearchFilter,
    setAddressSearchFilter,

    latestBlockHeight,
    pendingMigrations: filteredPendingMigrations,
    refetchPendingMigrations,
  };
};

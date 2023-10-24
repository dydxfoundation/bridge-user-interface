import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { fromBech32, toHex } from '@cosmjs/encoding';
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import BigNumber from 'bignumber.js';

import { bridgeContractAbi } from '@/constants/abi';
import { TOKEN_DECIMAL_SHIFT, TransactionStatus } from '@/constants/migrate';
import { DydxAddress, EthereumAddress } from '@/constants/wallets';

import { useTrackTransactionFinalized } from './useTrackTransactionFinalized';
import { useIsDydxAddressValid } from '../useIsDydxAddressValid';
import { useDydxClient } from '../useDydxClient';

export const useBridgeTransaction = ({
  amountBN,
  destinationAddress,
}: {
  amountBN?: BigNumber;
  destinationAddress?: string;
}) => {
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(
    TransactionStatus.NotStarted
  );
  const [bridgeTxHash, setBridgeTxHash] = useState<EthereumAddress | undefined>();
  const [bridgeTxMinedBlockNumber, setBridgeTxMinedBlockNumber] = useState<bigint | undefined>();

  const { isTransactionFinalized, numBlocksTillFinalized } = useTrackTransactionFinalized({
    bridgeTxMinedBlockNumber,
  });

  const isDestinationAddressValid = useIsDydxAddressValid(destinationAddress);

  useEffect(() => {
    if (isTransactionFinalized) setTransactionStatus(TransactionStatus.Finalized);
  }, [isTransactionFinalized]);

  // Warn user before resfresh / leaving page if transaction has not been acknowledged
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (transactionStatus && transactionStatus < TransactionStatus.Finalized) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [transactionStatus]);

  const clearStatus = () => {
    setTransactionStatus(TransactionStatus.NotStarted);
    setBridgeTxHash(undefined);
    setBridgeTxMinedBlockNumber(undefined);
  };

  const { writeAsync: bridge, isLoading: isBridgePending } = useContractWrite({
    address: import.meta.env.VITE_BRIDGE_CONTRACT_ADDRESS,
    abi: bridgeContractAbi,
    functionName: 'bridge',
    args: [
      amountBN?.shiftedBy(TOKEN_DECIMAL_SHIFT)?.toFixed() ?? '0',
      isDestinationAddressValid
        ? `0x${toHex(fromBech32(destinationAddress as DydxAddress).data)}`
        : '',
      '', // memo
    ],
    chainId: Number(import.meta.env.VITE_ETH_CHAIN_ID),
  });

  const startBridge = async () => {
    setTransactionStatus(TransactionStatus.Pending);
    try {
      const result = await bridge();
      setBridgeTxHash(result.hash);
    } catch (error) {
      setTransactionStatus(TransactionStatus.NotStarted);
      throw error;
    }
  };

  const { error: bridgeTxError } = useWaitForTransaction({
    enabled: bridgeTxHash !== undefined && transactionStatus === TransactionStatus.Pending,
    hash: bridgeTxHash,
    onSuccess({ blockNumber }) {
      setTransactionStatus(TransactionStatus.Unfinalized);
      setBridgeTxMinedBlockNumber(blockNumber);
    },
    onError() {
      setTransactionStatus(TransactionStatus.NotStarted);
    },
  });

  const { compositeClient } = useDydxClient();

  useQuery({
    enabled:
      transactionStatus === TransactionStatus.Finalized &&
      !!compositeClient &&
      bridgeTxMinedBlockNumber !== undefined &&
      isDestinationAddressValid,
    queryKey: [
      'pollIsCurrentTransactionAcknowledged',
      {
        dydxAddress: destinationAddress,
        ethBlockHeight: Number(bridgeTxMinedBlockNumber),
      },
    ],
    queryFn: async () =>
      await compositeClient?.validatorClient.get.getDelayedCompleteBridgeMessages(
        destinationAddress
      ),
    select: (data) =>
      (data?.messages ?? []).some(
        (migration) =>
          migration.message?.event?.address === destinationAddress &&
          Number(migration.message?.event?.ethBlockHeight) === Number(bridgeTxMinedBlockNumber)
      ),
    onSuccess: (isAcknowledged) => {
      if (isAcknowledged) setTransactionStatus(TransactionStatus.Acknowledged);
    },
    refetchInterval: 5_000,
    staleTime: 5_000,
  });

  return {
    transactionStatus,
    setTransactionStatus,
    clearStatus,

    startBridge,
    bridgeTxError,
    isBridgePending,
    bridgeTxHash,
    bridgeTxMinedBlockNumber,

    numBlocksTillFinalized,
  };
};

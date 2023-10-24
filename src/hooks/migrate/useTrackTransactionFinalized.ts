import { useEffect, useRef, useState } from 'react';
import { usePublicClient } from 'wagmi';

export const useTrackTransactionFinalized = ({
  bridgeTxMinedBlockNumber,
}: {
  bridgeTxMinedBlockNumber: bigint | undefined;
}) => {
  const [numBlocksTillFinalized, setNumBlocksTillFinalized] = useState<bigint | undefined>();

  const unwatchRef = useRef<(() => void) | undefined>();

  const publicClient = usePublicClient({
    chainId: Number(import.meta.env.VITE_ETH_CHAIN_ID),
  });

  const fetchLatestFinalizedBlock = async () => {
    if (!bridgeTxMinedBlockNumber || !publicClient) return;
    const { number } = await publicClient.getBlock({
      blockTag: 'finalized',
    });

    setNumBlocksTillFinalized(bridgeTxMinedBlockNumber - number);
  };

  useEffect(() => {
    // get the latest finalized block number once to set the initial timer,
    // since watchBlocks's doesn't always emits at the start
    if (bridgeTxMinedBlockNumber) {
      fetchLatestFinalizedBlock();

      unwatchRef.current = publicClient.watchBlocks({
        blockTag: 'finalized',
        emitOnBegin: true,
        poll: true,
        onBlock: ({ number }) => setNumBlocksTillFinalized(bridgeTxMinedBlockNumber - number),
      });
    }

    // reset / new transaction incoming
    return () => {
      unwatchRef.current?.();
      unwatchRef.current = undefined;
      setNumBlocksTillFinalized(undefined);
    };
  }, [bridgeTxMinedBlockNumber]);

  useEffect(() => {
    if (numBlocksTillFinalized !== undefined && numBlocksTillFinalized <= 0) {
      unwatchRef.current?.();
      unwatchRef.current = undefined;
    }
  }, [numBlocksTillFinalized]);

  return {
    numBlocksTillFinalized: Number(numBlocksTillFinalized),
    isTransactionFinalized:
      bridgeTxMinedBlockNumber !== undefined &&
      numBlocksTillFinalized !== undefined &&
      numBlocksTillFinalized <= 0,
  };
};

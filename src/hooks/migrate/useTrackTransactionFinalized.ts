import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";

import { SEPOLIA_ETH_CHAIN_ID } from "@/constants/wallets";

export const useTrackTransactionFinalized = ({
  bridgeTxMinedBlockNumber,
}: {
  bridgeTxMinedBlockNumber: bigint | undefined;
}) => {
  const [numBlocksTillFinalized, setNumBlocksTillFinalized] = useState<
    bigint | undefined
  >();

  const publicClient = usePublicClient({
    chainId: SEPOLIA_ETH_CHAIN_ID,
  });

  const fetchLatestFinalizedBlock = async () => {
    if (!bridgeTxMinedBlockNumber || !publicClient) return;
    const { number } = await publicClient.getBlock({
      blockTag: "finalized",
    });

    setNumBlocksTillFinalized(bridgeTxMinedBlockNumber - number);
  };

  const unwatch = publicClient.watchBlocks({
    blockTag: "finalized",
    emitOnBegin: true,
    poll: true,
    onBlock: ({ number }) => {
      if (!bridgeTxMinedBlockNumber) return;
      setNumBlocksTillFinalized(bridgeTxMinedBlockNumber - number);
    },
  });

  useEffect(() => {
    // get the latest finalized block number once to set the initial timer,
    // since watchBlocks's doesn't always emits at the start
    fetchLatestFinalizedBlock();
  }, [bridgeTxMinedBlockNumber]);

  useEffect(() => {
    if (numBlocksTillFinalized !== undefined && numBlocksTillFinalized <= 0)
      unwatch();
  }, [numBlocksTillFinalized]);

  return {
    numBlocksTillFinalized: Number(numBlocksTillFinalized),
    isTransactionFinalized:
      bridgeTxMinedBlockNumber !== undefined &&
      numBlocksTillFinalized !== undefined &&
      numBlocksTillFinalized <= 0,
  };
};

import { useState, useEffect } from "react";
import styled, { type AnyStyledComponent } from "styled-components";

import { AVG_ETH_BLOCK_TIME_SECONDS } from "@/constants/migrate";

import { useTrackTransactionFinalized } from "@/hooks";

import { Tag } from "@/components/Tag";

export const FinalizingCountdownTimer = ({
  bridgeTxMinedBlockNumber,
}: {
  bridgeTxMinedBlockNumber?: bigint;
}) => {
  const { numBlocksTillFinalized, isTransactionFinalized } =
    useTrackTransactionFinalized({ bridgeTxMinedBlockNumber });

  const [secondsRemaining, setSecondsRemaining] = useState(
    numBlocksTillFinalized * AVG_ETH_BLOCK_TIME_SECONDS
  );

  useEffect(() => {
    setSecondsRemaining(numBlocksTillFinalized * AVG_ETH_BLOCK_TIME_SECONDS);

    const intervalId = setInterval(() => {
      if (secondsRemaining <= 0) return; // prevent negative seconds
      setSecondsRemaining((secondsRemaining) => secondsRemaining - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [numBlocksTillFinalized]);

  const minutes = Math.floor(secondsRemaining / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsRemaining % 60).toString().padStart(2, "0");

  return (
    <Styled.Tag>
      Finalizing
      {!isTransactionFinalized &&
        secondsRemaining > 0 &&
        ` ${minutes}:${seconds}`}
    </Styled.Tag>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Tag = styled(Tag)`
  color: #ffcc48;
  background-color: #ffcc4816;
`;

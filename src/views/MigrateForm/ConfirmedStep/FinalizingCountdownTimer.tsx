import { useState, useEffect } from 'react';
import styled, { type AnyStyledComponent } from 'styled-components';

import { STRING_KEYS } from '@/constants/localization';

import { useStringGetter } from '@/hooks';

import { Tag } from '@/components/Tag';

const NUM_EPOCH_BLOCKS = 32;
const ETH_BLOCK_TIME_SECONDS = 12;

export const FinalizingCountdownTimer = ({
  numBlocksTillFinalized,
}: {
  numBlocksTillFinalized: number;
}) => {
  const stringGetter = useStringGetter();

  const getEstimate = (blockDifference: number) =>
    Math.ceil(blockDifference / NUM_EPOCH_BLOCKS) * NUM_EPOCH_BLOCKS * ETH_BLOCK_TIME_SECONDS;

  const [secondsRemaining, setSecondsRemaining] = useState(getEstimate(numBlocksTillFinalized));

  useEffect(() => {
    setSecondsRemaining(getEstimate(numBlocksTillFinalized));

    const intervalId = setInterval(
      () => setSecondsRemaining((secondsRemaining) => secondsRemaining - 1),
      1000
    );

    return () => clearInterval(intervalId);
  }, [numBlocksTillFinalized]);

  const minutes = Math.floor(secondsRemaining / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (secondsRemaining % 60).toString().padStart(2, '0');

  return (
    <Styled.Tag>
      {stringGetter({ key: STRING_KEYS.FINALIZING })}
      {secondsRemaining > 0 ? ` ${minutes}:${seconds}` : '...'}
    </Styled.Tag>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Tag = styled(Tag)`
  color: #ffcc48;
  background-color: #ffcc4816;
`;

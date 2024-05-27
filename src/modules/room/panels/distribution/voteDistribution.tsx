import React, { useMemo } from 'react';


import { useTickets } from '../../hooks';
import { getPointOptions } from '../../utils';
import styled from 'styled-components';
import { VARIATIONS } from '../../../../utils/styles';
import Consensus from './consensus';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 1rem 0 0.5rem;
`;

const StatContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const StatLabel = styled.div`
  font-size: 1rem;
`;

const StatDisplayWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: flex-end;
  
  height: 100%;
  width: 12px;
  border-radius: 8px;

  background-color: ${VARIATIONS.structure.borderElement};
  overflow: hidden;
`;

const StatDisplay = styled.div<{ percentage: number, revealVotes: boolean }>`
  display: flex;
  position: absolute;
  bottom: 0;
  flex: 1;
  background-color: ${VARIATIONS.info.solidBg};
  width: 100%;
  height: ${({ percentage, revealVotes }) => revealVotes ? percentage : 0}%;

  transition: height 500ms ease-out;
`;

const VoteDistribution = () => {
  const { currentTicket, shouldShowVotes, voteData } = useTickets();
  const { sequence, exclusions } = getPointOptions(currentTicket?.pointOptions);

  const hasConsensus = useMemo(
    () => (
      shouldShowVotes
        && voteData.length > 0
        && voteData.every(({ vote }) => !!vote && vote === voteData[0].vote)
    ),
    [voteData],
  );

  const voteCounts = useMemo(
    () => voteData.reduce(
      (acc: { [key: string]: number }, { vote }) => {
        if (vote) {
          acc[vote] = acc[vote] ? acc[vote] + 1 : 1;
        }
        return acc;
      },
      {},
    ),
    [voteData],
  );

  const voteStats = useMemo(
    () => sequence.map((point) => {
      const votes = voteCounts[point] || 0;
      const votePercentage = (votes / voteData.length) * 100;

      if (exclusions.includes(point) && votePercentage === 0) {
        return null;
      }

      return (
        <StatContainer key={point}>
          <StatDisplayWrapper>
            <StatDisplay revealVotes={shouldShowVotes} percentage={votePercentage} />
          </StatDisplayWrapper>
          <StatLabel>{point}</StatLabel>
        </StatContainer>
      );
    }),
    [voteCounts, voteData, shouldShowVotes],
  );

  const component = hasConsensus ? <Consensus /> : voteStats;

  return <Wrapper>{component}</Wrapper>;
};

export default VoteDistribution;

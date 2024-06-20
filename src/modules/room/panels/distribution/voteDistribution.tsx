import React, { useMemo } from 'react';


import { useTickets } from '../../hooks';
import { getPointOptions } from '../../utils';
import styled, { css } from 'styled-components';
import Consensus from './consensus';
import { ThemedProps } from '../../../../utils/styles/colors/colorSystem';

type StatDisplayProps = {
  percentage: number;
  revealVotes: boolean;
  animationDuration: number;
};

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
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const StatLabel = styled.div`
  ${({ theme }: ThemedProps) => css`
    border-top: 1px solid ${theme.greyscale.borderElement};
  `}

  display: flex;
  justify-content: center;
  width: 100%;
  font-size: 1rem;
  padding-top: 0.25rem;
`;

const StatDisplayWrapper = styled.div`
  ${({ theme }: ThemedProps) => css`
    background-color: ${theme.greyscale.borderElement};
  `}

  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: flex-end;
  
  height: 100%;
  width: 1.5rem;
  border-top-left-radius: 0.125rem;
  border-top-right-radius: 0.125rem;

  overflow: hidden;
`;

const StatDisplay = styled.div<StatDisplayProps>`
  ${({ animationDuration, percentage, revealVotes, theme }: StatDisplayProps & ThemedProps) => css`
    background-color: ${theme.info.solidBg};
    height: ${revealVotes ? percentage : 0}%;
    transition: height ${animationDuration}ms ease-out;
  `}

  display: flex;
  position: absolute;
  bottom: 0;
  flex: 1;
  width: 100%;
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
            <StatDisplay
              revealVotes={shouldShowVotes}
              percentage={votePercentage}
              animationDuration={votes * 250}
            />
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

import React, { useMemo } from 'react';

import styled, { css } from 'styled-components';

import { GridPanel } from '@components/common';
import { GridPanelProps } from '@components/common/gridPanel';
import { ThemedProps } from '@utils/styles/colors/types';

import { useTickets } from '../../hooks';
import { getPointOptions, isVoteCast } from '../../utils';
import Consensus from './Consensus';


const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 1rem 0 0;
`;


type StatDisplayProps = {
  percentage: number;
  revealVotes: boolean;
  animationDuration: number;
};

const StatContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const StatLabel = styled.div`
  ${ ({ theme }: ThemedProps) => css`
    border-top: 1px solid ${ theme.greyscale.accent7 };
  `}

  display: flex;
  justify-content: center;
  width: 100%;
  font-size: 1rem;
  padding-top: 0.25rem;
`;

const StatDisplayWrapper = styled.div`
  ${ ({ theme }: ThemedProps) => css`
    background-color: ${ theme.greyscale.accent7 };
    border-top: 2px solid ${ theme.greyscale.accent6 };
    border-left: 1px solid ${ theme.greyscale.accent6 };
    border-right: 1px solid ${ theme.greyscale.accent6 };
  `}

  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: flex-end;
  
  height: 100%;
  width: 1.5rem;
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;

  overflow: hidden;
`;

const StatDisplay = styled.div<StatDisplayProps>`
  ${ ({
    animationDuration,
    percentage,
    revealVotes,
    theme,
  }: StatDisplayProps & ThemedProps) => css`
    background-color: ${ theme.info.accent9 };
    height: ${ revealVotes ? percentage : 0 }%;
    transition: height ${ animationDuration }ms ease-out;
    border-top: ${ revealVotes && percentage ? 2 : 0 }px solid ${ theme.info.accent10 };
  `}

  display: flex;
  position: absolute;
  bottom: 0;
  flex: 1;
  width: 100%;
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
`;


const DistributionPanel = (props: GridPanelProps) => {
  const {
    currentTicket,
    shouldShowVotes,
    voteData,
  } = useTickets();
  const { sequence, exclusions } = getPointOptions(currentTicket?.pointOptions);

  const hasConsensus = useMemo(() => (
    shouldShowVotes
      && voteData.length > 0
      && voteData.every(({ vote }) => !!vote && vote === voteData[ 0 ].vote)
  ), [voteData]);

  const voteCounts = useMemo(() => voteData.reduce((acc: { [key: string]: number }, { vote }) => {
    if (isVoteCast(vote)) {

      acc[vote!] = acc[vote!] ? acc[vote!] + 1 : 1;
    }
    return acc;
  }, {}), [voteData]);

  const voteStats = useMemo(() => sequence.map((point) => {
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
            animationDuration={votes ? votes * 250 : 250}
          />
        </StatDisplayWrapper>
        <StatLabel>{point}</StatLabel>
      </StatContainer>
    );
  }), [
    voteCounts,
    voteData,
    shouldShowVotes,
  ]);

  const component = hasConsensus ? <Consensus /> : voteStats;
  return (
    <GridPanel config={props.config} title='distribution'>
      <Wrapper>
        {component}
      </Wrapper>
    </GridPanel>
  );
};

export default DistributionPanel;

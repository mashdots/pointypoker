import React from 'react';
import styled, { css } from 'styled-components';

import {
  DistributionPanel,
  Tickets,
  TimerPanel,
  VoteDisplay,
  VoteResults,
  VotingPanel,
} from './panels';
import { useMobile } from '@utils/hooks/mobile';
import TicketController from '@modules/room/panels/ticketController';

type RoomDataContainerProps = {
  showNarrow: boolean;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const RoomDataContainer = styled.div<RoomDataContainerProps>`
  ${({ showNarrow }) => css`
    grid-template-columns: repeat(${showNarrow ? 8 : 9}, 1fr); 
  `}

  grid-template-rows: repeat(9, 1fr);
  display: grid;
  width: 100%;
  height: 100%;
  padding: 1rem;
  grid-row-gap: 1.25rem;
  grid-column-gap: 1.25rem;
`;

const getGridConfig = (showNarrow: boolean) => {
  if (showNarrow) {
    return {
      timer: { columnStart: 1, columnEnd: 4, rowStart: 1, rowEnd: 3 },
      voteResults: { columnStart: 4, columnEnd: 9, rowStart: 1, rowEnd: 3 },
      voting: { columnStart: 1, columnEnd: 9, rowStart: 3, rowEnd: 4 },
      history: { columnStart: 1, columnEnd: 5, rowStart: 4, rowEnd: 8 },
      voteDisplay: { columnStart: 5, columnEnd: 9, rowStart: 4, rowEnd: 8 },
      distribution: { columnStart: 1, columnEnd: 9, rowStart: 8, rowEnd: 10 },
    };
  }

  return {
    voting: { columnStart: 4, columnEnd: 10, rowStart: 1, rowEnd: 1 },
    timer: { columnStart: 1, columnEnd: 4, rowStart: 1, rowEnd: 1 },
    voteDisplay: { columnStart: 1, columnEnd: 3, rowStart: 2, rowEnd: 7 },
    voteResults: { columnStart: 3, columnEnd: 7, rowStart: 2, rowEnd: 4 },
    distribution: { columnStart: 3, columnEnd: 7, rowStart: 4, rowEnd: 7 },
    history: { columnStart: 7, columnEnd: 10, rowStart: 2, rowEnd: 7 },
  };
};

const RoomPresenter = () => {
  const { isMobile } = useMobile();

  const gridConfigs = getGridConfig(isMobile);

  return (
    <Wrapper>
      <TicketController />
      <RoomDataContainer showNarrow={isMobile}>
        <TimerPanel gridConfig={gridConfigs.timer} />
        <VotingPanel gridConfig={gridConfigs.voting} />
        <VoteDisplay gridConfig={gridConfigs.voteDisplay} />
        <VoteResults gridConfig={gridConfigs.voteResults} />
        <Tickets gridConfig={gridConfigs.history} />
        <DistributionPanel gridConfig={gridConfigs.distribution} />
      </RoomDataContainer>
    </Wrapper>
  );
};

export default RoomPresenter;

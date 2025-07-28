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
import useJiraScopeCheck from '@modules/integrations/jira/hooks';
import TicketController from '@modules/room/panels/TicketController';
import { useMobile } from '@utils/hooks/mobile';

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
  const { isNarrow } = useMobile();
  useJiraScopeCheck();

  const gridConfigs = getGridConfig(isNarrow);

  return (
    <Wrapper>
      <TicketController />
      <RoomDataContainer showNarrow={isNarrow}>
        <TimerPanel config={gridConfigs.timer}>{null}</TimerPanel>
        <VotingPanel config={gridConfigs.voting}>{null}</VotingPanel>
        <VoteDisplay config={gridConfigs.voteDisplay}>{null}</VoteDisplay>
        <VoteResults config={gridConfigs.voteResults}>{null}</VoteResults>
        <Tickets config={gridConfigs.history}>{null}</Tickets>
        <DistributionPanel config={gridConfigs.distribution}>{null}</DistributionPanel>
      </RoomDataContainer>
    </Wrapper>
  );
};

export default RoomPresenter;

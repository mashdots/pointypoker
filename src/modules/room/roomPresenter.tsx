import React from 'react';
import styled from 'styled-components';
import { Distribution, TicketHistory, TimerPanel, TitleControl, VoteResults, VotingPanel } from './panels';
import { VoteDisplay } from './components';
import { useMobile } from '../../utils/mobile';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const RoomDataContainer = styled.div<{ showNarrow: boolean }>`
  display: grid;
  width: 100%;
  height: 100%;
  padding: 1rem;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: repeat(9, 1fr);
  grid-row-gap: 1.25rem;
  grid-column-gap: 1.25rem;
  overflow: scroll;
`;

const RoomPresenter = () => {
  const { isMobile } = useMobile();

  const gridConfigs = {
    voting: { columnStart: 4, columnEnd: 10, rowStart: 1, rowEnd: 1 },
    timer: { columnStart: 1, columnEnd: 4, rowStart: 1, rowEnd: 1 },
    voteDisplay: { columnStart: 1, columnEnd: 3, rowStart: 2, rowEnd: 7 },
    voteResults: { columnStart: 3, columnEnd: 7, rowStart: 2, rowEnd: 4 },
    distribution: { columnStart: 3, columnEnd: 7, rowStart: 4, rowEnd: 7 },
    history: { columnStart: 7, columnEnd: 10, rowStart: 2, rowEnd: 6 },
  };

  return (
    <Wrapper>
      <TitleControl />
      <RoomDataContainer showNarrow={isMobile}>
        <TimerPanel gridConfig={gridConfigs.timer} />
        <VotingPanel gridConfig={gridConfigs.voting} />
        <VoteDisplay gridConfig={gridConfigs.voteDisplay} />
        <VoteResults gridConfig={gridConfigs.voteResults} />
        <TicketHistory gridConfig={gridConfigs.history} />
        <Distribution gridConfig={gridConfigs.distribution} />
      </RoomDataContainer>
    </Wrapper>
  );
};

export default RoomPresenter;

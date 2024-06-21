import React from 'react';
import styled, { css } from 'styled-components';
import {
  DistributionPanel,
  TicketHistory,
  TimerPanel,
  TitleControl,
  VoteDisplay,
  VoteResults,
  VotingPanel,
} from './panels';
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
  ${({ showNarrow }) => showNarrow
    ? css`
      grid-auto-rows: 1fr;
    `
    : css`
      grid-template-rows: repeat(9, 1fr);
    `
}
  display: grid;
  width: 100%;
  height: 100%;
  padding: 1rem;
  grid-template-columns: repeat(9, 1fr);
  grid-row-gap: 1.25rem;
  grid-column-gap: 1.25rem;
  overflow: scroll;
`;

const getGridConfig = (showNarrow: boolean) => {
  if (showNarrow) {
    return {
      timer: { columnStart: 1, columnEnd: 10, rowStart: 1, rowEnd: 1 },
      voting: { columnStart: 1, columnEnd: 10, rowStart: 2, rowEnd: 3 },
      voteResults: { columnStart: 1, columnEnd: 10, rowStart: 4, rowEnd: 6 },
      voteDisplay: { columnStart: 1, columnEnd: 10, rowStart: 6, rowEnd: 12 },
      distribution: { columnStart: 1, columnEnd: 10, rowStart: 12, rowEnd: 18 },
      history: { columnStart: 1, columnEnd: 10, rowStart: 18, rowEnd: 22 },
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
      <TitleControl />
      <RoomDataContainer showNarrow={isMobile}>
        <TimerPanel gridConfig={gridConfigs.timer} />
        <VotingPanel gridConfig={gridConfigs.voting} />
        <VoteDisplay gridConfig={gridConfigs.voteDisplay} />
        <VoteResults gridConfig={gridConfigs.voteResults} />
        <TicketHistory gridConfig={gridConfigs.history} />
        <DistributionPanel gridConfig={gridConfigs.distribution} />
      </RoomDataContainer>
    </Wrapper>
  );
};

export default RoomPresenter;

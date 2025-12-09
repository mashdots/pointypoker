import {
  useFeatureFlagEnabled,
  useFeatureFlagPayload,
  useFeatureFlagVariantKey,
} from 'posthog-js/react';
import React from 'react';

import styled, { css } from 'styled-components';

import useJiraScopeCheck from '@modules/integrations/jira/hooks';
import TicketController from '@modules/room/panels/TicketController';
import TicketFlow from '@modules/room/TicketFlow';
import flags from '@utils/flags';
import { useMobile } from '@utils/hooks/mobile';

import {
  DistributionPanel,
  Tickets,
  TimerPanel,
  VoteDisplay,
  VoteResults,
  VotingPanel,
} from './panels';

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
      distribution: {
        columnEnd: 9,
        columnStart: 1,
        rowEnd: 10,
        rowStart: 8,
      },
      history: {
        columnEnd: 5,
        columnStart: 1,
        rowEnd: 8,
        rowStart: 4,
      },
      timer: {
        columnEnd: 4,
        columnStart: 1,
        rowEnd: 3,
        rowStart: 1,
      },
      voteDisplay: {
        columnEnd: 9,
        columnStart: 5,
        rowEnd: 8,
        rowStart: 4,
      },
      voteResults: {
        columnEnd: 9,
        columnStart: 4,
        rowEnd: 3,
        rowStart: 1,
      },
      voting: {
        columnEnd: 9,
        columnStart: 1,
        rowEnd: 4,
        rowStart: 3,
      },
    };
  }

  return {
    distribution: {
      columnEnd: 7,
      columnStart: 3,
      rowEnd: 7,
      rowStart: 4,
    },
    history: {
      columnEnd: 10,
      columnStart: 7,
      rowEnd: 7,
      rowStart: 2,
    },
    timer: {
      columnEnd: 4,
      columnStart: 1,
      rowEnd: 1,
      rowStart: 1,
    },
    voteDisplay: {
      columnEnd: 3,
      columnStart: 1,
      rowEnd: 7,
      rowStart: 2,
    },
    voteResults: {
      columnEnd: 7,
      columnStart: 3,
      rowEnd: 4,
      rowStart: 2,
    },
    voting: {
      columnEnd: 10,
      columnStart: 4,
      rowEnd: 1,
      rowStart: 1,
    },
  };
};

const RoomPresenter = () => {
  const { isNarrow } = useMobile();
  const flagEnabled = useFeatureFlagEnabled(flags.REDESIGN);
  useJiraScopeCheck();

  console.log('Feature Flag - Monocard:', flagEnabled);
  const gridConfigs = getGridConfig(isNarrow);

  if (flagEnabled) {
    return (
      <Wrapper>
        <TicketFlow />
      </Wrapper>
    );
  }


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

import React, { useEffect } from 'react';

import styled from 'styled-components';

import GridPanel, { GridPanelProps } from '@components/common/gridPanel';

import { Timer } from '../components';
import { useTickets } from '../hooks';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const TimerPanel = ({ config }: GridPanelProps) => {
  const {
    currentTicket, shouldShowVotes, handleUpdateCurrentTicket,
  } = useTickets();

  useEffect(() => {
    if (shouldShowVotes && !currentTicket?.votesShownAt) {
      handleUpdateCurrentTicket('votesShownAt', Date.now());
    }
  }, [shouldShowVotes]);

  return (
    <GridPanel config={config}>
      <Wrapper>
        <Timer
          startTime={currentTicket?.createdAt}
          endTime={currentTicket?.votesShownAt}
        />
      </Wrapper>
    </GridPanel>
  );
};

export default TimerPanel;

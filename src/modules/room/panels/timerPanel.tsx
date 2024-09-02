import React, { useEffect } from 'react';
import styled from 'styled-components';

import { Timer } from '../components';
import { useTickets } from '../hooks';
import GridPanel, { GridPanelProps } from '@components/common/gridPanel';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const TimerPanel = (props: GridPanelProps) => {
  const { currentTicket, shouldShowVotes, handleUpdateCurrentTicket } = useTickets();

  useEffect(() => {
    if (shouldShowVotes && !currentTicket?.votesShownAt) {
      handleUpdateCurrentTicket('votesShownAt', Date.now());
    }
  }, [ shouldShowVotes ]);

  return (
    <GridPanel config={props.gridConfig}>
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

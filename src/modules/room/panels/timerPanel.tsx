import React, { useEffect } from 'react';
import styled from 'styled-components';

import { Timer } from '../components';
import GridPanel, { GridPanelProps } from '../../../components/common/gridPanel';
import { useTickets } from '../hooks';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const TimerPanel = (props: GridPanelProps) => {
  const { currentTicket, shouldShowVotes, handleUpdateLatestTicket } = useTickets();

  useEffect(() => {
    if (shouldShowVotes && !currentTicket?.votesShownAt) {
      handleUpdateLatestTicket('votesShownAt', Date.now());
    }
  }, [ shouldShowVotes ]);

  return (
    <GridPanel config={props.gridConfig}>
      <Wrapper>
        <Timer
          startTime={currentTicket?.timerStartAt}
          endTime={currentTicket?.votesShownAt}
        />
      </Wrapper>
    </GridPanel>
  );
};

export default TimerPanel;

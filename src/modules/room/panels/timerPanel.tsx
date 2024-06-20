import React from 'react';
import styled from 'styled-components';

import Timer from '../components/timer';
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
  const { currentTicket } = useTickets();

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

import React from 'react';

import styled from 'styled-components';

import { useTickets } from '@modules/room/hooks';
import TicketCard from '@modules/room/TicketFlow/components/TicketCard';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 1rem;
`;

const FlowContainer = () => {
  const {
    currentTicket,
    queue,
    completedTickets,
  } = useTickets();

  return <Wrapper>{currentTicket ? <TicketCard {...currentTicket} /> : 'FlowContainer'}</Wrapper>;
};

export default FlowContainer;

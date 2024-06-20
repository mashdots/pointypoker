import React from 'react';
import { GridPanel } from '../../../components/common';
import { GridPanelProps } from '../../../components/common/gridPanel';
import { useTickets } from '../hooks';
import TicketHistory from './ticketHistory';

const History = (props: GridPanelProps) => {
  const { sortedTickets } = useTickets();

  return (
    <GridPanel config={props.gridConfig}><TicketHistory previousTickets={sortedTickets.slice(1)} /></GridPanel>
  );
};

export default History;

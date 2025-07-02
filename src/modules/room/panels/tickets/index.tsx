import React from 'react';

import History from './history';
import MultiPanel from '@modules/room/panels/multiPanel';
import GridPanel, { GridPanelProps } from '@components/common/gridPanel';
import Queue from './queue';
import { useTickets } from '@modules/room/hooks';

const Tickets = ({ config }: GridPanelProps) => {
  const { queue } = useTickets();
  const panels = [
    { title: 'history', component: <History /> },
  ];

  if (queue.length && !panels.find((panel) => panel.title === 'queue')) {
    panels.push({ title: 'queue', component: <Queue /> });
  }

  return (
    <GridPanel config={config}>
      <MultiPanel panels={panels} forcePanelChange={panels.length - 1} />
    </GridPanel>
  );
};

export default Tickets;

import React from 'react';

import GridPanel, { GridPanelProps } from '@components/common/gridPanel';
import { useTickets } from '@modules/room/hooks';
import MultiPanel from '@modules/room/panels/multiPanel';

import History from './history';
import Queue from './queue';

const Tickets = ({ config }: GridPanelProps) => {
  const { queue } = useTickets();
  const panels = [
    {
      component: <History />,
      title: 'history',
    },
  ];

  if (queue.length && !panels.find((panel) => panel.title === 'queue')) {
    panels.push({
      component: <Queue />,
      title: 'queue',
    });
  }

  return (
    <GridPanel config={config}>
      <MultiPanel panels={panels} forcePanelChange={panels.length - 1} />
    </GridPanel>
  );
};

export default Tickets;

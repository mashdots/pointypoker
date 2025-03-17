import React, { useState } from 'react';
import styled from 'styled-components';

import Controller from './controller';
import FilterableList, { SelectedTab } from './filterableList';
import { useTickets } from '@modules/room/hooks';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TicketList = () => {
  const { currentTicket, completedTickets: history, queue } = useTickets();
  const [search, setSearch] = useState('');
  const [selectedTab, setSelectedTab] = useState(SelectedTab.HISTORY);

  const ticketLists = {
    history,
    queue,
  };

  return (
    <Wrapper>
      <Controller
        tabs={Object.keys(ticketLists) as SelectedTab[]}
        selectedTab={selectedTab}
        setSearch={setSearch}
        setTab={setSelectedTab}
      />
      <FilterableList
        currentTicket={currentTicket?.id}
        search={search}
        selectedTab={selectedTab}
        ticketLists={ticketLists}
      />
    </Wrapper>
  );
};

export default TicketList;

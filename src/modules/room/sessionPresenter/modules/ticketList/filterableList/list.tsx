import React from 'react';
import styled from 'styled-components';

import { SelectedTab } from './';
import ListItem, { Props as ListItemProps } from './listItems';

type Props = {
  currentTicket?: string;
  tickets: Array<ListItemProps['item']>;
  type: SelectedTab;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

const List = ({ currentTicket, tickets = [], type }: Props) => {
  return (
    <Container>
      {
        tickets.map((ticket, index) => {
          return (
            <ListItem
              isCurrentTicket={currentTicket === ticket.id}
              key={index}
              item={ticket}
              type={type}
            />
          );
        })
      }
    </Container>
  );
};

export default List;

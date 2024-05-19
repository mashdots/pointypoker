import React, { useMemo } from 'react';
import styled from 'styled-components';

import { VARIATIONS } from '../../../utils/styles';
import { Ticket } from '../../../types';

type Props = {
  previousTickets?: Ticket[];
}

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;

  border: none;
  border-radius: 8px;

  color: ${VARIATIONS.structure.textLowContrast};
`;

const TicketCell = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
`;

const TicketHistory = ({ previousTickets }: Props) => {

  const ticketRows = useMemo(() => previousTickets?.map(({
    id,
    name,
    averagePoints,
    suggestedPoints,
  }) => {
    return (
      <TicketCell key={id}>
        <div>{name?.length ? name : '(no title)'}</div>
        <div>avg: {averagePoints}</div>
        <div>sugg: {suggestedPoints}</div>
      </TicketCell>
    );
  }), [previousTickets],
  );

  return <Wrapper>{ticketRows}</Wrapper>;
};

export default TicketHistory;

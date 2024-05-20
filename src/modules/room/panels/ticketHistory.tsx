import React, { useMemo } from 'react';
import styled from 'styled-components';

import { VARIATIONS } from '../../../utils/styles';
import { Ticket } from '../../../types';
import { getIcon } from '../components/icons';

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

const TicketRow = styled.div<{shouldHighlight?: boolean}>`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;

  ${({ shouldHighlight }) => shouldHighlight && `
    background-color: ${VARIATIONS.structure.bgElementActive};
  `}
`;

const NameCell = styled.div`
  display: flex;
  flex: 2;
  align-items: center;
`;

const PointCell = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
`;

const TicketHistory = ({ previousTickets }: Props) => {

  const ticketRows = useMemo(() => previousTickets?.map(({
    id,
    name,
    averagePoints,
    suggestedPoints,
  }, i) => {
    return (
      <TicketRow key={id} shouldHighlight={i % 2 === 0}>
        <NameCell>{name?.length ? name : '(no title)'}</NameCell>
        <PointCell>{suggestedPoints}</PointCell>
        <PointCell>{averagePoints}</PointCell>
      </TicketRow>
    );
  }), [previousTickets],
  );

  const header = (
    <TicketRow>
      <NameCell>ticket</NameCell>
      <PointCell>{getIcon('suggest')}</PointCell>
      <PointCell>{getIcon('average')}</PointCell>
    </TicketRow>
  );

  return <Wrapper>{header}{ticketRows}</Wrapper>;
};

export default TicketHistory;

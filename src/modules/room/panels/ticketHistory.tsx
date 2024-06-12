import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { parseURL } from 'whatwg-url';

import { getTicketNumberFromUrl } from '../utils';
import { getIcon } from '../../../components/icons';
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
  padding: 1rem 0 0.5rem;

  border: none;
  border-radius: 8px;

  color: ${VARIATIONS.structure.textLow};
`;

const TicketRow = styled.div<{shouldHighlight?: boolean}>`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;

  ${({ shouldHighlight }) => shouldHighlight && `
    background-color: ${VARIATIONS.structure.componentBgActive};
  `}
`;

const NameCell = styled.div`
  flex: 3 ;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  white-space: nowrap;
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
    const parsedUrl = parseURL(name ?? '');
    const title = parsedUrl ? getTicketNumberFromUrl(parsedUrl) : null;
    const nameComponent = title ? <Link to={name!} target='_blank'>{title}</Link> : name;

    return (
      <TicketRow key={id} shouldHighlight={i % 2 === 0}>
        <NameCell>{nameComponent ?? '(no title)'}</NameCell>
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

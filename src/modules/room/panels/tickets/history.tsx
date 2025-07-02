import React, { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { parseURL } from 'whatwg-url';

import { useTickets } from '../../hooks';
import { getTicketNumberFromUrl } from '../../utils';
import { ThemedProps } from '@utils/styles/colors/colorSystem';
import { fadeDownEntrance } from '@components/common/animations';

type TicketRowProps = {
  showBottomBorder?: boolean,
} & ThemedProps;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  width: 100%;
`;

const TicketRowList = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  overflow: auto;
`;

const TicketHeader = styled.div`
  ${({ theme }: ThemedProps) => css`
    color: ${ theme.primary.accent12 };
    background-color: ${ theme.greyscale.accent3 };
  `}

    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 0.25rem;
    flex-shrink: 0;
    padding: 0.75rem 2rem 0.75rem 1rem;
    margin: 0.25rem 0;
`;

const TicketRow = styled.div <TicketRowProps>`
  ${({ showBottomBorder, theme }: TicketRowProps) => css`
    color: ${ theme.primary.accent12 };
    border-color: ${ theme.primary.accent6 };
    border-bottom-width: ${ showBottomBorder ? 1 : 0 }px !important;
  `}

  padding: 0.75rem 2rem 0.75rem 1rem;
  display: flex;
  align-items: center;
  border-style: solid;
  border-width: 0px;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  animation: ${fadeDownEntrance} 300ms;
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
  ${({ theme }: ThemedProps) => css`
    color: ${ theme.primary.accent11 };
  `}

  display: flex;
  font-size: 0.9rem;
  width: 1rem;
  justify-content: center;
  align-items: center;
  margin-left: 0.5rem;
`;

const History = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const { completedTickets } = useTickets();
  const ticketRows = useMemo(() => completedTickets?.map(({
    id,
    name,
    suggestedPoints,
  }, i) => {
    const parsedUrl = parseURL(name ?? '');
    const title = parsedUrl ? getTicketNumberFromUrl(parsedUrl) : null;
    const nameComponent = title ? <Link to={name!} target='_blank'>{title}</Link> : name;
    const isLast = i === completedTickets.length - 1;

    return (
      <TicketRow key={id} showBottomBorder={!isLast}>
        <NameCell title={title ?? name}>{nameComponent || '(no title)'}</NameCell>
        <PointCell>{suggestedPoints}</PointCell>
      </TicketRow>
    );
  }), [completedTickets],
  );

  const header = (
    <TicketHeader ref={headerRef}>
      <NameCell>ticket</NameCell>
      <PointCell title="Suggested points">suggested</PointCell>
    </TicketHeader>
  );

  return (
    <Wrapper>
      {header}
      <TicketRowList>
        {ticketRows}
      </TicketRowList>
    </Wrapper>
  );
};

export default History;

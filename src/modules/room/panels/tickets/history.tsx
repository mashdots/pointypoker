import { div as TicketRow } from 'motion/react-client';
import { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';

import styled, { css } from 'styled-components';
import { parseURL } from 'whatwg-url';

import useTheme from '@utils/styles/colors';
import { ThemedProps } from '@utils/styles/colors/types';

import { useTickets } from '../../hooks';
import { getTicketNumberFromUrl } from '../../utils';

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

const IDCell = styled.div`
  ${({ theme }: ThemedProps) => css`
    color: ${ theme.info.accent11 };
    background-color: ${ theme.greyscale.accent3 };
    border: 1px solid ${ theme.primary.accent6 };
  `}

  flex: 1 ;
  align-items: center;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  text-align: center;
  margin-right: 0.5rem;
   
  a {
    text-decoration: none;
    color: inherit;
  }
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
  margin-left: 1rem;
`;

const History = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const { completedTickets } = useTickets();
  const { theme } = useTheme();

  const ticketRows = useMemo(() => completedTickets?.map(({
    id,
    name,
    suggestedPoints,
    url,
  }, i) => {
    const parsedUrl = url ?? parseURL(name ?? '');
    const idElement = id ? <IDCell><Link to={url} target='_blank'>{id}</Link></IDCell> : null;
    const title = parsedUrl ? getTicketNumberFromUrl(parsedUrl) : null;
    const nameComponent = title ? <Link to={name!} target='_blank'>{title}</Link> : name;
    const isLast = i === completedTickets.length - 1;

    return (
      <TicketRow
        key={id}
        initial={{
          opacity: 0,
          y: -10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: 10,
        }}
        transition={{ duration: 0.25 }}
        style={{
          alignItems: 'center',
          borderBottomWidth: isLast ? 0 : '1px',
          borderColor: theme.primary.accent6,
          borderStyle: 'solid',
          borderWidth: '0px',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0.75rem 2rem 0.75rem 1rem',
          width: '100%',
        }}
      >
        {idElement}
        <NameCell title={title ?? name}>{nameComponent || '(no title)'}</NameCell>
        <PointCell>{suggestedPoints}</PointCell>
      </TicketRow>
    );
  }), [completedTickets] );

  return (
    <Wrapper>
      <TicketHeader ref={headerRef}>
        <NameCell>ticket</NameCell>
        <PointCell title="Suggested points">suggested</PointCell>
      </TicketHeader>
      <TicketRowList>
        {ticketRows}
      </TicketRowList>
    </Wrapper>
  );
};

export default History;

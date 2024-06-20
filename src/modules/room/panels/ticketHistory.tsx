import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import { parseURL } from 'whatwg-url';

import { getTicketNumberFromUrl } from '../utils';
import { getIcon } from '../../../components/icons';
import { Ticket } from '../../../types';
import GridPanel, { GridPanelProps } from '../../../components/common/gridPanel';
import { useTickets } from '../hooks';
import { ThemedProps } from '../../../utils/styles/colors/colorSystem';

type Props = GridPanelProps & {
  previousTickets?: Ticket[];
}

type TicketRowProps = {
  showBottomBorder?: boolean,
} & ThemedProps;

const TicketRowList = styled.div<{ calculatedHeight: number }>`
  ${({ calculatedHeight }: { calculatedHeight: number }) => css`
    height: ${calculatedHeight}px;
  `}

  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
`;

const enterAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const TicketHeader = styled.div`
  ${({ theme }: ThemedProps) => css`
    color: ${ theme.primary.textHigh };
  `}

    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    padding: 0.75rem 2rem 0.75rem 1rem;
`;

const TicketRow = styled.div <TicketRowProps>`
  ${({ showBottomBorder, theme }: TicketRowProps) => css`
    color: ${ theme.primary.textHigh };
    border-color: ${ theme.primary.border };
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
  animation: ${enterAnimation} 300ms;
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

const TicketHistory = ({ gridConfig }: Props) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [scrollableHeight, setScrollableHeight] = useState(0);
  const { sortedTickets } = useTickets();
  const previousTickets = sortedTickets.slice(1);
  const ticketRows = useMemo(() => previousTickets?.map(({
    id,
    name,
    averagePoints,
    suggestedPoints,
  }, i) => {
    const parsedUrl = parseURL(name ?? '');
    const title = parsedUrl ? getTicketNumberFromUrl(parsedUrl) : null;
    const nameComponent = title ? <Link to={name!} target='_blank'>{title}</Link> : name;
    const isLast = i === previousTickets.length - 1;

    return (
      <TicketRow key={id} showBottomBorder={!isLast}>
        <NameCell>{nameComponent ?? '(no title)'}</NameCell>
        <PointCell>{suggestedPoints}</PointCell>
        <PointCell>{averagePoints}</PointCell>
      </TicketRow>
    );
  }), [previousTickets],
  );

  const header = (
    <TicketHeader ref={headerRef}>
      <NameCell>ticket</NameCell>
      <PointCell>{getIcon('suggest')}</PointCell>
      <PointCell>{getIcon('average')}</PointCell>
    </TicketHeader>
  );

  useEffect(() => {
    if (headerRef.current) {
      /**
       * This is over-engineered but the only way I can figure out how to get
       * the scroll to fit in the parent container
       */
      const headerHeight = headerRef.current.clientHeight;
      const parentHeight = headerRef.current.parentElement?.clientHeight ?? 0;
      setScrollableHeight(parentHeight - headerHeight);
    }
  }, [headerRef]);

  return (
    <GridPanel config={gridConfig} title='history'>
      {header}
      <TicketRowList calculatedHeight={scrollableHeight}>
        {ticketRows}
      </TicketRowList>
    </GridPanel>
  );
};

export default TicketHistory;

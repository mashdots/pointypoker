import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

import { VARIATIONS } from '../../../utils/styles';
import { useTickets } from '../hooks';
import TicketHistory from './ticketHistory';
import { useMobile } from '../../../utils/mobile';
import MultiPanel from './multiPanel';
import { VoteDistribution } from './distribution';
import { GridPanel } from '../../../components/common';
import { GridPanelProps } from '../../../components/common/gridPanel';

type ContainerProps = {
  orientation?: 'row' | 'column';
};

type MobileProps = {
  isMobile: boolean;
};

const Wrapper = styled.div<MobileProps>`
  display: flex;
  flex: 1;
  flex-direction: column;
  
  border: none;
  border-radius: 8px;
  overflow: hidden;
  
  color: ${ VARIATIONS.structure.textLow };
  background-color: ${ VARIATIONS.structure.componentBg };
  
  ${({ isMobile }) => css`
    width: ${isMobile ? 70 : 100}%;
  `}
`;

const ContainerRow = styled.div<ContainerProps>`
  display: flex;
  width: 100%;

  ${({ orientation }) => css`
    flex-direction: ${orientation || 'row'};
  `}
`;

const RowWithBorder = styled(ContainerRow)<{ height?: number}>`
  border-top: 2px solid ${ VARIATIONS.structure.border };

  ${({ height }) => css`
    height: ${height}px;
  `}
`;

const VoteStatistics = (props: GridPanelProps) => {
  const { isMobile } = useMobile();
  const wrapperRef = useRef(null);
  const [cellHeight, setCellHeight] = useState(0);
  const {
    currentTicket,
    shouldShowVotes,
    sortedTickets,
    handleUpdateLatestTicket,
  } = useTickets();

  useEffect(() => {
    const wrapperElement = wrapperRef.current;

    if (!wrapperElement) {
      return;
    }

    const obs = new ResizeObserver((e) => {
      setCellHeight(e[0].contentRect.width/2);
    });

    obs.observe(wrapperElement);

    return () => {
      obs.disconnect();
    };
  }, []);

  useEffect(() => {
    if (shouldShowVotes && !currentTicket?.votesShownAt) {
      handleUpdateLatestTicket('votesShownAt', Date.now());
    }
  }, [shouldShowVotes]);



  return (
    <GridPanel config={props.gridConfig}>
      <Wrapper isMobile={isMobile} ref={wrapperRef}>
        <TicketHistory previousTickets={sortedTickets.slice(1)} />
      </Wrapper>
    </GridPanel>
  );
};

export default VoteStatistics;

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

import Button from '../../../components/common/button';
import { VARIATIONS } from '../../../utils/styles';
import { useTickets } from '../hooks';
import { calculateAverage, calculateSuggestedPoints } from '../utils';
import { InfoCell } from './infoCells';
import TicketHistory from './ticketHistory';
import Timer from '../components/timer';
import { useMobile } from '../../../utils/mobile';
import MultiPanel from './multiPanel';
import { VoteDistribution } from './distribution';

type CellProps = {
  calcHeight: number;
};

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
  
  color: ${ VARIATIONS.structure.textLowContrast };
  background-color: ${ VARIATIONS.structure.bgElement };
  
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

const TopCellWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem 1rem 0.5rem;

  height: 100%;
`;

const Cell = styled.div <CellProps>`
  display: flex;
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  padding: 1rem;

  height: ${({ calcHeight }) => calcHeight}px;
`;

const CellWithBorder = styled(Cell)`
  border-left: 2px solid ${ VARIATIONS.structure.border };
`;

const VoteStatistics = () => {
  const { isMobile } = useMobile();
  const wrapperRef = useRef(null);
  const [cellHeight, setCellHeight] = useState(0);
  const {
    currentTicket,
    shouldShowVotes,
    sortedTickets,
    handleUpdateLatestTicket,
  } = useTickets();

  const averagePointValue = useMemo(
    () => calculateAverage(currentTicket),
    [currentTicket],
  );

  const pointSuggestion = useMemo(
    () => calculateSuggestedPoints(currentTicket),
    [currentTicket],
  );

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

  const panels = [
    { title: 'Distribution', component: <VoteDistribution /> },
    {
      title: 'History',
      component: <TicketHistory previousTickets={sortedTickets.slice(1)} />,
      shouldScroll: true,
    },
  ];

  return (
    <Wrapper isMobile={isMobile} ref={wrapperRef}>
      <ContainerRow orientation='column'>
        <TopCellWrapper>
          <Timer startTime={currentTicket?.timerStartAt} endTime={currentTicket?.votesShownAt} />
          <Button
            variation='info'
            width='full'
            onClick={() => {
              handleUpdateLatestTicket('shouldShowVotes', true);
              handleUpdateLatestTicket('votesShownAt', Date.now());
            }}
            isDisabled={shouldShowVotes}
            textSize='small'
          >
        show votes
          </Button>
        </TopCellWrapper>
      </ContainerRow>
      <RowWithBorder>
        <Cell calcHeight={cellHeight}>
          <InfoCell icon="suggest" value={shouldShowVotes ? pointSuggestion.suggestedPoints : '?'} label='suggested' />
        </Cell>
        <CellWithBorder calcHeight={cellHeight}>
          <InfoCell value={shouldShowVotes ? averagePointValue.average : '?'} label='average' />
        </CellWithBorder>
      </RowWithBorder>
      <RowWithBorder height={cellHeight + 32}>
        <MultiPanel panels={panels} width={cellHeight*2} />
      </RowWithBorder>
    </Wrapper>
  );
};

export default VoteStatistics;

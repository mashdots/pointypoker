import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

import Button from '../../../components/common/button';
import { VARIATIONS } from '../../../utils/styles';
import { useTickets } from '../hooks';
import { InfoCell } from './infoCells';
import useStore from '../../../utils/store';
import getPointOptions from '../utils';
import Timer from './timer';

type CellProps = {
  calcHeight: number;
};

type ContainerProps = {
  orientation?: 'row' | 'column';
};

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;

  border: none;
  border-radius: 8px;
  
  color: ${ VARIATIONS.structure.textLowContrast };
  background-color: ${ VARIATIONS.structure.bgElement };
`;

const ContainerRow = styled.div<ContainerProps>`
  display: flex;
  width: 100%;

  ${({ orientation }) => css`
    flex-direction: ${orientation || 'row'};
  `}
`;
const RowWithBorder = styled(ContainerRow)`
  border-top: 2px solid ${ VARIATIONS.structure.border };
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
  const wrapperRef = useRef(null);
  const [cellHeight, setCellHeight] = useState(0);
  const room = useStore((state) => state.room);
  const {
    areAllVotesCast,
    currentTicket,
    voteData,
    handleUpdateLatestTicket,
  } = useTickets();
  const shouldShowVotes = useMemo(
    () => areAllVotesCast || currentTicket?.shouldShowVotes,
    [ areAllVotesCast, currentTicket ],
  );

  const averagePointValue = useMemo(() => {
    let stringVotes = 0;
    const total = voteData.reduce(
      (acc, { vote = 0 }) => {
        if (typeof vote === 'string') {
          stringVotes += 1;
          return acc;
        }
        return acc + vote;
      }, 0,
    );

    const average = total / (voteData.length - stringVotes);

    return Object.is(average, NaN) ? 'Oops!' : average;
  }, [voteData]);

  const pointSuggestion = useMemo(() => {
    // Based on the average point value, suggest a point value that is one of the options available
    const pointOptions = getPointOptions(room?.pointOptions);
    const suggestedPoint = pointOptions.find(
      (point) => point >= averagePointValue,
    );

    return suggestedPoint || averagePointValue;
  }, [averagePointValue, room]);

  // const pointSuggestion = useMemo(() => {
  // // Based on the average point value, suggest a point value that is one of the options available
  //   const


  /**
   * TO DOs:
   * 1. Point suggestion
   * 3. Point with the most votes
   * 4. Point distribution
   * 5. Breakdown of points
   * 6. Support for string votes like T Shirt sizes
   */


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
    <Wrapper ref={wrapperRef}>
      <ContainerRow orientation='column'>
        <TopCellWrapper>
          <Timer startTime={currentTicket?.createdAt || 0} endTime={currentTicket?.votesShownAt} />
          <Button
            variation='info'
            width='full'
            onClick={() => {
              handleUpdateLatestTicket('shouldShowVotes', true);
              handleUpdateLatestTicket('votesShownAt', Date.now());
            }}
            textSize='small'
          >
        show votes
          </Button>
        </TopCellWrapper>
      </ContainerRow>
      <RowWithBorder>
        <Cell calcHeight={cellHeight}>
          <InfoCell icon="suggest" value={shouldShowVotes ? pointSuggestion : '?'} label='suggested' />
        </Cell>
        <CellWithBorder calcHeight={cellHeight}>
          <InfoCell value={shouldShowVotes ? averagePointValue : '?'} label='average' />
        </CellWithBorder>
      </RowWithBorder>
    </Wrapper>
  );
};

export default VoteStatistics;

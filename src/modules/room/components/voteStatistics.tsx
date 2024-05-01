import React, { useMemo } from 'react';
import styled from 'styled-components';

import Button from '../../../components/common/button';
import { VARIATIONS } from '../../../utils/styles';
import { useTickets } from '../hooks';

const Wrapper = styled.div`
  display: flex;
  flex: 2;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  width: 100%;
  
  border: none;
  border-radius: 8px;
  
  color: ${ VARIATIONS.structure.textLowContrast };
  background-color: ${ VARIATIONS.structure.bgElement };
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
  padding: 1rem;
`;

const StatisticsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
  border-top: 2px solid ${ VARIATIONS.structure.border };
`;

const VoteStatistics = () => {
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


  return (
    <Wrapper>
      <ButtonContainer>
        <Button
          variation='info'
          width='full'
          onClick={() => handleUpdateLatestTicket('shouldShowVotes', true)}
          textSize='small'
        >
        show votes
        </Button>
      </ButtonContainer>
      <StatisticsContainer>
        {shouldShowVotes ? averagePointValue : '?'}
      </StatisticsContainer>
    </Wrapper>
  );
};

export default VoteStatistics;

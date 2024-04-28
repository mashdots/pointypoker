import React, { useMemo } from 'react';
import styled from 'styled-components';

import Button from '../../../components/common/button';
import useStore from '../../../utils/store';
import { VoteDisplayProps } from './voteDisplay';
import { VARIATIONS } from '../../../utils/styles';
import { useTickets } from '../hooks';
import { Room } from '../../../types';

const Wrapper = styled.div`
  display: flex;
  flex: 2;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  color: ${ VARIATIONS.structure.textLowContrast };

  border: none;
  border-radius: 8px;

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
  const { tickets } = useStore(({ room }) => room as Room);
  const {
    areAllVotesCast,
    handleCreateTicket,
    voteData,
    handleUpdateLatestTicket,
  } = useTickets();
  const shouldShowVotes = useMemo(
    () => areAllVotesCast || tickets[ 0 ]?.shouldShowVotes, [ areAllVotesCast, tickets ],
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
    return total / (voteData.length - stringVotes);
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
   */


  return (
    <Wrapper>
      <ButtonContainer>
        <Button
          margin='right'
          variation='info'
          width='half'
          onClick={handleCreateTicket}
          textSize='small'
        >
        next ticket
        </Button>
        <Button
          margin='left'
          variation='info'
          width='half'
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

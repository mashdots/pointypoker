import React, { useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';

import { Vote } from '../../../types';
import useStore from '../../../utils/store';
import { useTickets } from '../hooks';
import { VARIATIONS } from '../../../utils/styles';

export type VoteDisplayProps = {
  name: string;
  vote?: Vote;
}

type VoteRowProps = {
  voteData: VoteDisplayProps;
  isEven: boolean;
  showVote: boolean;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 1rem;
  margin-top: 1rem;
  overflow: hidden;
`;

const StyledVoteRow = styled.div<{isEven: boolean}>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0.5rem;
  width: 75%;
  border-radius: 0.5rem;
  background-color: ${({ isEven }) => isEven ? VARIATIONS.transparent.bg : VARIATIONS.structure.bgElement};
`;

const VoteName = styled.div`
  display: flex;
  flex: 1;
  font-size: 1rem;
  margin-left: 2rem;
`;

const VoteResultWrapper = styled.div<{animateVote: boolean}>`
  display: flex;
  flex: 3;
  flex-direction: row;
  width: 2rem;
  height: 1rem;
  border-radius: 0.5rem;
  width: 2rem;

  transition: all 200ms ease-in-out;

  ${({ animateVote }) => animateVote && css`
    margin-bottom: 1rem;
  `}
`;

const VoteResult = styled.div`
  display: flex;
  flex-direction: row;
  width: 4rem;
  height: 1rem;
  border-radius: 0.5rem;
  background-color: ${VARIATIONS.structure.solidBg};
`;

const VoteRow = ({ voteData, isEven, showVote }: VoteRowProps) => {
  let timeout: number;
  const [shouldAnimateVote, setShouldAnimateVote] = useState(false);
  useEffect(() => {
    if (voteData.vote) {
      setShouldAnimateVote(true);
      timeout = setTimeout(() => {
        setShouldAnimateVote(false);
      }, 100);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [voteData.vote]);

  return (
    <StyledVoteRow isEven={isEven}>
      <VoteName>{voteData.name}</VoteName>
      <VoteResultWrapper animateVote={shouldAnimateVote}>{showVote ? voteData.vote : <VoteResult />}</VoteResultWrapper>
    </StyledVoteRow>
  );
};

/**
 * TO DOs:
 * 1. Redesign this into a more visually appealing component, with individual vote cards per person and animations
 * 2. Figure out if you want to use hashing
 */

const VoteDisplay = () => {
  const user = useStore(({ user }) => user);
  const { areAllVotesCast, currentTicket, voteData } = useTickets();
  const shouldShowVotes = useMemo(
    () => areAllVotesCast || currentTicket?.shouldShowVotes,
    [areAllVotesCast, currentTicket?.shouldShowVotes],
  );

  const voteNodes = voteData.map((vote, i) => {
    const name = vote.name === user?.name ? 'You' : vote.name;
    const displayVote = shouldShowVotes || (vote.name === user?.name && vote.vote !== undefined);

    return (
      <VoteRow
        key={i}
        isEven={i % 2 === 0}
        showVote={displayVote}
        voteData={{ name, vote: vote.vote }}
      />
    );
  });

  return (
    <Wrapper>
      {voteNodes}
    </Wrapper>
  );
};

export default VoteDisplay;

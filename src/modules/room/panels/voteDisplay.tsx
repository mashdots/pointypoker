import React, { useEffect, useState } from 'react';
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
  background-color: ${({ isEven }) => isEven ? VARIATIONS.transparent.bg : VARIATIONS.structure.componentBg};
`;

const VoteName = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  font-size: 1rem;
  padding-right: 1rem;
`;

const VoteResultWrapper = styled.div`
  display: flex;
  flex: 1;
  padding-left: 1rem;
`;

const BlockedVoteResult = styled.div<{ animateVote: boolean }>`
  display: flex;
  flex-direction: row;
  width: 4rem;
  height: 1rem;
  border-radius: 0.5rem;
  background-color: ${VARIATIONS.structure.solidBg};

  transition: background-color 0.25s ease-in-out;

  ${({ animateVote }) => animateVote && css`
    background-color: ${VARIATIONS.info.solidBg};
  `}
`;

const VoteRow = ({ voteData, isEven, showVote }: VoteRowProps) => {
  const [shouldAnimateVote, setShouldAnimateVote] = useState(false);
  const { name, vote } = voteData;
  let timeout: number;
  let voteResult = null;

  if (vote) {
    voteResult = showVote ? vote : <BlockedVoteResult animateVote={shouldAnimateVote} />;
  }

  useEffect(() => {
    if (vote) {
      setShouldAnimateVote(true);

      timeout = setTimeout(() => {
        setShouldAnimateVote(false);
      }, 250);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [vote]);

  return (
    <StyledVoteRow isEven={isEven}>
      <VoteName>{name}</VoteName>
      <VoteResultWrapper>{voteResult}</VoteResultWrapper>
    </StyledVoteRow>
  );
};

const VoteDisplay = () => {
  const user = useStore(({ user }) => user);
  const { shouldShowVotes, voteData } = useTickets();

  const voteNodes = voteData.map((vote, i) => {
    const name = vote.name === user?.name ? 'you' : vote.name;
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

import React, { useMemo } from 'react';
import { Vote } from '../../../types';
import useStore from '../../../utils/store';
import { useTickets } from '../hooks';

export type VoteDisplayProps = {
  name: string;
  vote: Vote;
}

/**
 * TO DOs:
 * 1. Redesign this into a more visually appealing component, with individual vote cards per person and animations
 * 2. Figure out if you want to use hashing
 */

const VoteDisplay = () => {
  const { user, room } = useStore(({ user, room }) => ({ user, room }));
  const { areAllVotesCast, voteData } = useTickets();
  const shouldShowVotes = useMemo(() => areAllVotesCast || room?.tickets[0]?.shouldShowVotes, [areAllVotesCast, room]);

  const voteNodes = voteData.map((vote, i) => {
    const name = vote.name === user?.name ? 'You' : vote.name;
    const displayVote = shouldShowVotes || vote.name === user?.name;

    return (
      <li key={`${ vote.name }+${ i }`}>
        {name}: {displayVote ? vote.vote : '...'}
      </li>
    );
  });

  return (
    <div>
      <h1>Votes</h1>
      <ul>
        {voteNodes}
      </ul>
    </div>
  );
};

export default VoteDisplay;

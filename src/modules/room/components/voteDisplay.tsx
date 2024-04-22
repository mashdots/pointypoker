import React from 'react';
import { Vote } from '../../../types/room';
import { User } from '../../../types';

export type VoteDisplayProps = {
  name: string;
  vote: Vote;
}

type Props = {
  currentUser: User | null;
  voteData: VoteDisplayProps[];
  shouldShowVotes: boolean;
}


/**
 * TO DOs:
 * 1. Redesign this into a more visually appealing component, with individual vote cards per person and animations
 * 2. Figure out if you want to use hashing
 */

const VoteDisplay = ({ currentUser, voteData = [], shouldShowVotes = false }: Props) => {
  const voteNodes = voteData.map((vote, i) => {
    const name = vote.name === currentUser?.name ? 'You' : vote.name;
    const displayVote = shouldShowVotes || vote.name === currentUser?.name;

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

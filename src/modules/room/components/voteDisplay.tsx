import React from 'react';
import { Vote } from '../../../types/room';

export type VoteDisplayProps = {
  name: string;
  vote: Vote;
}

type Props = {
  voteData: VoteDisplayProps[];
  shouldShowVotes: boolean;
}


/**
 * TO DOs:
 * 1. Redesign this into a more visually appealing component, with individual vote cards per person and animations
 * 2. Figure out if you want to use hashing
 */

const VoteDisplay = ({ voteData = [], shouldShowVotes = false }: Props) => {
  return (
    <div>
      <h1>Votes</h1>
      <ul>
        {voteData.map((vote, i) => {
          return (
            <li key={`${vote.name}+${i}`}>
              {vote.name}: {vote.vote}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default VoteDisplay;

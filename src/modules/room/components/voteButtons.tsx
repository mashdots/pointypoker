import React from 'react';
import styled from 'styled-components';
import useStore from '../../../utils/store';
import { Vote } from '../../../types/room';


type Props = {
  handleVote: (field: string, value: Vote) => void;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 80%;
  margin-top: 16px;
  justify-content: space-between;
`;

const VoteButtons = ({ handleVote }: Props) => {
  const user = useStore((state) => state.user);

  const voteOptions = [1, 2, 3, 5, 8, '?', '∞'];

  const generateVoteButtons = (voteOptions: Array<number | string>) => {
    return voteOptions.map((option) => (
      <button
        key={option}
        onClick={(e) => {
          e.preventDefault();
          if (user) {
            handleVote(`votes.${user.id}`, option);
          }
        }}
      >
        {option}
      </button>
    ));
  };

  return (
    <Wrapper>
      {generateVoteButtons(voteOptions)}
    </Wrapper>
  );
};

export default VoteButtons;

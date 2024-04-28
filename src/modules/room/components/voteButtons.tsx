import React from 'react';
import styled from 'styled-components';
import useStore from '../../../utils/store';
import { Vote } from '../../../types';
import { VARIATIONS } from '../../../utils/styles';


type Props = {
  handleVote: (field: string, value: Vote) => void;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 16px;
  justify-content: space-around;
`;

const VoteButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 16px;
  height: 64px;
  width: 64px;
  background-color: ${VARIATIONS.structure.bgElement};
  cursor: pointer;
  transition: background-color 300ms;

  font-size: 1.5rem;
  :hover {
    background-color: ${VARIATIONS.structure.bgElementHover};
  }
`;

const VoteButtons = ({ handleVote }: Props) => {
  const user = useStore((state) => state.user);

  const voteOptions = [1, 2, 3, 5, 8, '?', '∞'];

  const generateVoteButtons = (voteOptions: Array<number | string>) => {
    return voteOptions.map((option) => (
      <VoteButton
        key={option}
        onClick={(e) => {
          e.preventDefault();
          if (user) {
            handleVote(`votes.${user.id}`, option);
          }
        }}
      >
        {option}
      </VoteButton>
    ));
  };

  return (
    <Wrapper>
      {generateVoteButtons(voteOptions)}
    </Wrapper>
  );
};

export default VoteButtons;

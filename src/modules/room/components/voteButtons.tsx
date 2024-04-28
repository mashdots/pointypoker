import React from 'react';
import styled from 'styled-components';
import useStore from '../../../utils/store';
import { PointOptions } from '../../../types';
import { VARIATIONS } from '../../../utils/styles';
import getPointOptions from '../utils';
import { useTickets } from '../hooks';

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

const VoteButtons = () => {
  const { user, room } = useStore((state) => ({
    user: state.user,
    room: state.room,
  }));
  const { handleUpdateLatestTicket } = useTickets();

  const voteOptions = getPointOptions(room?.pointOptions);

  const generateVoteButtons = (voteOptions: PointOptions) => {
    return voteOptions ? voteOptions.map((option) => (
      <VoteButton
        key={option}
        onClick={(e) => {
          e.preventDefault();
          if (user) {
            handleUpdateLatestTicket(`votes.${user.id}`, option);
          }
        }}
      >
        {option}
      </VoteButton>
    )) : [];
  };

  return (
    <Wrapper>
      {generateVoteButtons(voteOptions)}
    </Wrapper>
  );
};

export default VoteButtons;

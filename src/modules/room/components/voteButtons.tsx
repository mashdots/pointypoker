import React from 'react';
import styled, { css } from 'styled-components';
import useStore from '../../../utils/store';
import { PointOptions } from '../../../types';
import { VARIATIONS } from '../../../utils/styles';
import { getPointOptions } from '../utils';
import { useTickets } from '../hooks';

const ButtonSetWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 16px;
  justify-content: space-around;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const VoteButton = styled.button<{ selected: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 16px;
  height: 64px;
  width: 64px;
  cursor: pointer;

  transition: 
    outline-color 300ms,
    outline-offset 300ms,
    outline-width 300ms,
    width 300ms,
    height 300ms,
    font-size 300ms,
    background-color 500ms;

  outline-color: ${VARIATIONS.structure.borderElementHover};
  outline-offset: 0px;  
  outline-width: 0px;
  outline-style: solid;
  
  font-size: 1.5rem;

  ${({ selected }) => css`
    background-color: ${selected ? VARIATIONS.success.borderElementHover : VARIATIONS.structure.componentBg};
  `}

  :hover {
    outline-color: ${VARIATIONS.structure.textLow};
    outline-offset: -8px;  
    outline-width: 2px;
    ${({ selected }) => css`
      background-color: ${ selected ? VARIATIONS.success.borderElementHover : VARIATIONS.structure.componentBgHover };
    `}
    font-size: 1.75rem;
  }

  :active {
    ${({ selected }) => !selected && css`
      background-color: ${VARIATIONS.structure.textLow};
    `}

    color: ${VARIATIONS.structure.componentBg};
    outline-offset: -16px;
    width: 56px;
    height: 56px;
  }
`;

const VoteButtons = () => {
  const user = useStore(({ user }) => user);
  const { currentTicket, handleUpdateLatestTicket, voteData } = useTickets();
  const myVote = voteData.find((vote) => vote.name === user?.name)?.vote;

  const voteOptions = getPointOptions(currentTicket?.pointOptions).sequence;

  const generateVoteButtons = (voteOptions: PointOptions['sequence']) => {
    return voteOptions ? voteOptions.map((option) => (
      <ButtonWrapper key={option}>
        <VoteButton
          selected={myVote === option}
          onClick={(e) => {
            e.preventDefault();
            if (user) {
              handleUpdateLatestTicket(`votes.${user.id}`, option);
            }
          }}
        >
          {option}
        </VoteButton>
      </ButtonWrapper>
    )) : [];
  };

  return (
    <ButtonSetWrapper>
      {generateVoteButtons(voteOptions)}
    </ButtonSetWrapper>
  );
};

export default VoteButtons;

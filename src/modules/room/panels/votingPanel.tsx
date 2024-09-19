import React, { useCallback, useEffect } from 'react';
import styled, { css } from 'styled-components';

import { useTickets } from '../hooks';
import { getPointOptions } from '../utils';
import { GridPanel } from '@components/common';
import { GridPanelProps } from '@components/common/gridPanel';
import useStore from '@utils/store';
import { ThemedProps } from '@utils/styles/colors/colorSystem';
import { PointOptions } from '@yappy/types';

const VoteButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 0.25rem;
  min-width: 4rem;
`;

const VoteButton = styled.button<ThemedProps & { selected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-style: solid;
  border-width: 2px;
  border-color: transparent;
  border-radius: 0.25rem;
  height: 2rem;
  width: 100%;
  font-size: 1.25rem;
  
  transition: 
  border-color 250ms ease-out,
  background-color 250ms ease-out;
  
  ${({ selected, theme, disabled }) => css`
      background-color: ${selected ? theme.primary.solidBg : theme.greyscale.componentBg};
      color: ${selected ? theme.primary.textHigh : theme.greyscale.textHigh};
      cursor: ${disabled ? 'not-allowed' : 'pointer'};
  `}

  :hover {
    ${({ selected, theme, disabled }) => !disabled && css`
      background-color: ${ theme.primary[selected ? 'borderElementHover' : 'componentBgHover'] };
      border-color: ${ theme.primary[selected ? 'transparent' : 'borderElementHover'] };
    `}
  }

  :active {
    ${({ selected, theme }) => !selected && css`
      background-color: ${ theme.primary.textLow };
    `}
  }
`;

const DisabledContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;

  > p {
    ${({ theme }) => css`
      color: ${theme.greyscale.textLow};
    `}

    font-size: 1.25rem;
  }
  
`;

const VotingPanel = ({ gridConfig }: GridPanelProps) => {
  const { user, isModalOpen, isTitleInputFocused, isObserver } = useStore(
    ({ preferences, isTitleInputFocused, currentModal }) => (
      { user: preferences?.user, isTitleInputFocused, isModalOpen: !!currentModal, isObserver: preferences?.isObserver }
    ));
  const { currentTicket, handleUpdateCurrentTicket, voteData } = useTickets();
  const myVote = voteData.find((vote) => vote.name === user?.name)?.vote;
  const voteOptions = getPointOptions(currentTicket?.pointOptions);

  const generateVoteButtons = (voteOptions: PointOptions['sequence']) => voteOptions.map(
    (option) => (
      <ButtonWrapper key={option}>
        <VoteButton
          selected={myVote === option}
          onClick={() => {
            if (user) {
              handleUpdateCurrentTicket(`votes.${user.id}`, option);
            }
          }}
          disabled={!currentTicket || isObserver}
        >
          {option}
        </VoteButton>
      </ButtonWrapper>
    ));

  const handleKeyPress = useCallback(({ key }: KeyboardEvent) => {
    if (currentTicket && !isTitleInputFocused && !isModalOpen) {
      if (voteOptions.sequence.includes(parseInt(key))) {
        handleUpdateCurrentTicket(`votes.${user?.id}`, parseInt(key));
      }
      if (voteOptions.exclusions.includes(key)) {
        handleUpdateCurrentTicket(`votes.${user?.id}`, key);
      }
    }
  }, [ currentTicket, isModalOpen, isTitleInputFocused, voteOptions ]);

  useEffect(() => {
    if (currentTicket) {
      document.onkeydown = handleKeyPress;
    }
  }, [currentTicket, isTitleInputFocused]);

  return (
    <GridPanel config={gridConfig}>
      {isObserver ? (
        <DisabledContainer><p>voting is disabled when you are observing</p></DisabledContainer>
      ) : (
        <>
          <VoteButtonsContainer>
            {generateVoteButtons(voteOptions.sequence)}
          </VoteButtonsContainer>
          <VoteButtonsContainer>
            {generateVoteButtons(voteOptions.exclusions)}
          </VoteButtonsContainer>
        </>
      )
      }
    </GridPanel>
  );
};

export default VotingPanel;

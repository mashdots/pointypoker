import React, { useCallback, useEffect, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { div as ProgressBar, button } from 'motion/react-client';

import useStore from '@utils/store';
import useTheme from '@utils/styles/colors/colorSystem';
import { getPointOptions } from '@modules/room/utils';
import { useTickets } from '@modules/room/hooks';
import { Vote } from '@yappy/types';

type Props = {
  postVoteCallback?: () => void;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const VoteButtonSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const VoteButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-wrap: wrap;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  min-width: 4rem;
  margin: 0.5rem;
`;

const VoteButton = styled(button)`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  width: 100%;
  border-radius: 0.5rem;
  border-width: 1px;
  border-style: solid;
  padding: 0;
  font-size: 1rem;
`;

const VoteProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  padding: 0 0.5rem;

  > p {
    ${({ theme }) => css`
      color: ${ theme.greyscale.accent10 };
    `}
    text-align: center;
    width: 100%;
    font-size: 0.75rem;
  }
`;

const YourVote = ({ postVoteCallback }: Props) => {
  const { user, isModalOpen, isTitleInputFocused, isObserver } = useStore(
    ({ preferences, isTitleInputFocused, currentModal }) => (
      { user: preferences?.user, isTitleInputFocused, isModalOpen: !!currentModal, isObserver: preferences?.isObserver }
    ));
  const { theme } = useTheme();
  const { activeParticipants, currentTicket, handleUpdateCurrentTicket, voteData } = useTickets();
  const myVote = voteData.find((vote) => vote.name === user?.name)?.vote;
  const voteOptions = getPointOptions(currentTicket?.pointOptions);

  const activeParticipantNum = activeParticipants.length;

  const votedParticipantNum = useMemo(
    () => voteData.filter(
      (participant) => (
        voteOptions.exclusions.includes(participant.vote!)
        || voteOptions.sequence.includes(participant.vote!)
      ),
    ).length,
    [ voteData, voteOptions ],
  );

  const generateVoteButtons = useCallback(
    (voteOptions: Vote[]) => voteOptions.map(
      (option) => {
        const isSelected = myVote === option;
        const finalBgColor = theme[ isSelected ? 'primary' : 'greyscale' ].accent5;
        const finalBorderColor = theme[ isSelected ? 'primary' : 'greyscale' ][ isSelected ? 'accent8' : 'accent6' ];

        return (
          <ButtonWrapper key={option}>
            <VoteButton
              onClick={() => {
                if (user) {
                  handleUpdateCurrentTicket(`votes.${ user.id }`, option);
                  setTimeout(() => {
                    postVoteCallback?.();
                  }, 2000);
                }
              }}
              disabled={!currentTicket || isObserver}
              whileTap={!isSelected ? { backgroundColor: theme.primary.accent4 } : {}}
              whileHover={{
                backgroundColor: theme.primary.accent6,
                borderColor: theme.primary.accent8,
                boxShadow: `0 0 0.25rem ${ theme.greyscale.accent1 }`,
              }}
              style={{
                backgroundColor: finalBgColor,
                borderColor: finalBorderColor,
                boxShadow: `0 0 0.125rem ${ theme.greyscale.accent1 }`,
                color: theme.greyscale[ isSelected ? 'accent12' : 'accent11' ],
              }}
              transition={{
                type: 'tween',
                duration: 0.2,
              }}
            >
              {option}
            </VoteButton>
          </ButtonWrapper>
        );
      }), [ currentTicket, isObserver, myVote, theme ],
  );


  const getProgressText = (votedNum: number, activeNum: number) => {
    if (!currentTicket) {
      return 'waiting for a ticket';
    }

    let voterDescription = 'nobody';

    if (votedNum === 1) {
      voterDescription = 'one person';
    } else if (votedNum === activeNum) {
      voterDescription = 'everyone';
    } else {
      voterDescription = `${ votedNum } people`;
    }

    const participle = votedNum > 2 || votedNum === activeNum ? 'has' : 'have';

    return `${ voterDescription } ${ participle } voted`;
  };


  const handleKeyPress = useCallback(({ key }: KeyboardEvent) => {
    if (currentTicket && !isTitleInputFocused && !isModalOpen) {
      if (voteOptions.sequence.includes(parseInt(key))) {
        handleUpdateCurrentTicket(`votes.${ user?.id }`, parseInt(key));
      }
    }
  }, [ currentTicket, isModalOpen, isTitleInputFocused, voteOptions ]);

  useEffect(() => {
    if (currentTicket) {
      document.onkeydown = handleKeyPress;
    }
  }, [ currentTicket, isTitleInputFocused ]);

  return (
    <Wrapper>
      <VoteButtonSection>
        <VoteButtonsContainer>
          {generateVoteButtons(voteOptions.sequence)}
        </VoteButtonsContainer>
        <VoteButtonsContainer>
          {generateVoteButtons(voteOptions.exclusions)}
        </VoteButtonsContainer>
      </VoteButtonSection>
      <VoteProgressContainer>
        <p>{getProgressText(votedParticipantNum, activeParticipantNum)}</p>
        <ProgressBar
          initial={false}
          animate={{ width: `${(votedParticipantNum / activeParticipantNum) * 100}%` }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'flex',
            alignSelf: 'flex-start',
            height: '0.5rem',
            backgroundColor: theme[votedParticipantNum === activeParticipantNum ? 'success' : 'primary'].accent7,
            borderRadius: '0.25rem',
          }}
        />
      </VoteProgressContainer>
    </Wrapper>
  );
};

export default YourVote;

import React, { useEffect, useMemo, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

import { useTickets } from '../hooks';
import { Button, GridPanel } from '../../../components/common';
import { GridPanelProps } from '../../../components/common/gridPanel';
import { Vote } from '../../../types';
import useStore from '../../../utils/store';
import { ThemedProps } from '../../../utils/styles/colors/colorSystem';
import CircleCheckIcon from '../../../assets/icons/circle-check.svg?react';

enum PARTICIPANT_MODES {
  DEFAULT = 'default',
  VOTED = 'voted',
  REVEALED = 'revealed',
}

export type VoteDisplayProps = {
  name: string;
  vote?: Vote;
}

type VoteCellProps = {
  isLast: boolean;
  cellMode: PARTICIPANT_MODES;
  voteData: VoteDisplayProps;
}

type StyledVoteCellProps = {
  showBottomBorder: boolean;
} & ThemedProps;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  overflow: auto;
`;

const enterAnimation = keyframes`
  0% {
    opacity: 0;
    filter: blur(0.125rem);
    transform: translateY(-0.5rem);
  }

  100% {
    opacity: 1;
    filter: blur(0rem);
    transform: translateY(0rem);
  }
`;

const StyledVoteCell = styled.div<StyledVoteCellProps>`
  ${({ showBottomBorder, theme }: StyledVoteCellProps) => css`
    color: ${theme.primary.textHigh};
    border-color: ${theme.primary.border};
    border-bottom-width: ${showBottomBorder ? 1 : 0}px !important;
    padding: 0.75rem 2rem 0.75rem 0.75rem;
  `}
    
  align-items: center;
  border-style: solid;
  border-width: 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  animation: ${enterAnimation} 300ms;
`;

const DisplayElementWrapper = styled.div<{ isVisible: boolean }>`
  ${({ isVisible }) => css`
    opacity: ${isVisible ? 1 : 0};
    transform: scale(${isVisible ? 1 : 0.5});
  `}

  display: flex;
  transition: all 250ms;
`;

const Check = styled(CircleCheckIcon) <ThemedProps>`
  width: 1.5rem;

  > polyline, line, path, circle {
    stroke: ${ ({ theme }) => theme.success.textLow };
  }
`;

const VoteCell = ({ voteData, cellMode, isLast }: VoteCellProps) => {
  const [displayElement, setDisplayElement] = useState<null | JSX.Element | Vote>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { name, vote } = voteData;
  let timeout: number;

  useEffect(() => {
    setIsTransitioning(true);
    timeout = setTimeout(() => {
      switch (cellMode) {
      case PARTICIPANT_MODES.VOTED:
        setDisplayElement(<Check />);
        break;
      case PARTICIPANT_MODES.REVEALED:
        setDisplayElement(vote as Vote);
        break;
      default:
        setDisplayElement(null);
        break;
      }
      setIsTransitioning(false);
    }, 250);

    return () => {
      clearTimeout(timeout);
    };
  }, [cellMode]);

  return (
    <StyledVoteCell
      showBottomBorder={!isLast}
    >
      {name}
      <DisplayElementWrapper isVisible={!isTransitioning}>
        {displayElement}
      </DisplayElementWrapper>
    </StyledVoteCell>
  );
};

const VoteDisplay = (props: GridPanelProps) => {
  const user = useStore(({ user }) => user);
  const { shouldShowVotes, voteData, handleUpdateLatestTicket } = useTickets();

  const hasAnyoneVoted = voteData.some(({ vote }) => vote !== undefined && vote !== '');

  const voteNodes = useMemo(
    () => voteData.map(({ name: participantName, vote }, i) => {
      const userIsParticipant = participantName === user?.name;
      const hasVoted = vote !== undefined && vote !== '';
      const name = userIsParticipant ? 'you' : participantName;
      const displayVote = shouldShowVotes || (userIsParticipant && hasVoted);
      const isLast = i === voteData.length - 1;
      let mode = PARTICIPANT_MODES.DEFAULT;

      if (hasVoted) {
        if (!displayVote) {
          mode = PARTICIPANT_MODES.VOTED;
        } else {
          mode = PARTICIPANT_MODES.REVEALED;
        }
      }

      return (
        <VoteCell
          key={i}
          cellMode={mode}
          isLast={isLast}
          voteData={{ name, vote }}
        />
      );
    }),
    [shouldShowVotes, user, voteData],
  );


  const showVotesButton = (
    <Button
      variation='info'
      width='full'
      onClick={() => {
        handleUpdateLatestTicket('shouldShowVotes', true);
        handleUpdateLatestTicket('votesShownAt', Date.now());
      }}
      isDisabled={shouldShowVotes || !hasAnyoneVoted}
      textSize='small'
    >
      show votes
    </Button>
  );

  return (
    <GridPanel
      config={props.gridConfig}
      headingElement={showVotesButton}
      title='votes'
    >
      <Wrapper>
        {voteNodes}
      </Wrapper>
    </GridPanel>
  );
};

export default VoteDisplay;

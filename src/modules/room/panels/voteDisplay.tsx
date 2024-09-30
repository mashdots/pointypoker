import React, { useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';

import { useTickets } from '../hooks';
import { isVoteCast } from '../utils';
import CircleCheckSvg from '@assets/icons/circle-check.svg?react';
import CoffeeSvg from '@assets/icons/coffee.svg?react';
import IdleSvg from '@assets/icons/idle.svg?react';
import InactiveSvg from '@assets/icons/inactive.svg?react';
import { Button, GridPanel } from '@components/common';
import { fadeDownEntrance } from '@components/common/animations';
import { GridPanelProps } from '@components/common/gridPanel';
import useStore from '@utils/store';
import { ThemedProps } from '@utils/styles/colors/colorSystem';
import { Participant, Vote } from '@yappy/types';

enum NON_PARTICIPANT_MODES {
  ABSENT = 'absent',
  INACTIVE = 'inactive',
  OBSERVER = 'observer',
}

enum PARTICIPANT_MODES {
  DEFAULT = 'default',
  VOTED = 'voted',
  REVEALED = 'revealed',
}

type userModes = NON_PARTICIPANT_MODES | PARTICIPANT_MODES;

export type VoteDisplayProps = {
  name: string;
  vote?: Vote;
} & Pick<Participant, 'inactive' | 'consecutiveMisses' | 'isObserver'>;

type VoteCellProps = {
  isLast: boolean;
  cellMode: userModes;
  voteData: Omit<VoteDisplayProps, 'inactive' | 'consecutiveMisses' | 'isObserver'>;
}

type StyledVoteCellProps = {
  showBottomBorder: boolean;
  isIdle?: boolean;
  isInactive?: boolean;
} & ThemedProps;

const ICON_SIZE = 1.5;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  overflow: auto;
`;

const StyledVoteCell = styled.div<StyledVoteCellProps>`
  ${({ isIdle, isInactive, showBottomBorder, theme }: StyledVoteCellProps) => {
    let color = theme.primary.accent12;

    if (isIdle) {
      color = theme.warning.accent11;
    } else if (isInactive) {
      color = theme.greyscale.accent11;
    }

    return css`
      color: ${color};
      border-color: ${ theme.primary.accent6 };
      border-bottom-width: ${ showBottomBorder ? 1 : 0 }px !important;
      `;
  }}

  align-items: center;
  border-style: solid;
  border-width: 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  width: 100%;
  animation: ${fadeDownEntrance} 300ms;
`;

const VoteNameWrapper = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DisplayElementWrapper = styled.span<{ isVisible: boolean }>`
  ${({ isVisible }) => css`
    opacity: ${isVisible ? 1 : 0};
    transform: scale(${isVisible ? 1 : 0.5});
  `}

  display: flex;
  justify-content: center;
  transition: all 250ms;
  width: ${ICON_SIZE}rem;
  margin-left: 1rem;
`;

const CheckIcon = styled(CircleCheckSvg)<ThemedProps>`
  width: ${ICON_SIZE}rem;

  > polyline, line, path, circle {
    stroke: ${ ({ theme }: ThemedProps) => theme.success.accent11 };
  }
`;

const CoffeeIcon = styled(CoffeeSvg)<ThemedProps>`
  width: ${ICON_SIZE}rem;

  > line, path {
    stroke: ${ ({ theme }: ThemedProps) => theme.info.accent11 };
  }
`;

const IdleIcon = styled(IdleSvg)<ThemedProps>`
  width: ${ICON_SIZE}rem;

  > polyline, line, path, circle {
    stroke: ${ ({ theme }: ThemedProps) => theme.warning.accent11 };
  }
`;

const InactiveIcon = styled(InactiveSvg)<ThemedProps>`
  width: ${ICON_SIZE}rem;

  > polyline, line, path, circle {
    stroke: ${ ({ theme }: ThemedProps) => theme.greyscale.accent11 };
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
        setDisplayElement(<CheckIcon title={`${name} voted!`} />);
        break;
      case PARTICIPANT_MODES.REVEALED:
        setDisplayElement(vote as Vote);
        break;
      case NON_PARTICIPANT_MODES.OBSERVER:
        setDisplayElement(<CoffeeIcon title={`${name} is just watching`} />);
        break;
      case NON_PARTICIPANT_MODES.ABSENT:
        setDisplayElement(<IdleIcon title={`${name} hasn't voted in a bit`} />);
        break;
      case NON_PARTICIPANT_MODES.INACTIVE:
        setDisplayElement(<InactiveIcon title={`${name} has left the room`} />);
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
  }, [cellMode, vote]);

  return (
    <StyledVoteCell
      showBottomBorder={!isLast}
      isInactive={cellMode === NON_PARTICIPANT_MODES.INACTIVE}
      isIdle={cellMode === NON_PARTICIPANT_MODES.ABSENT}
    >
      <VoteNameWrapper>
        {name}
      </VoteNameWrapper>
      <DisplayElementWrapper isVisible={!isTransitioning}>
        {displayElement}
      </DisplayElementWrapper>
    </StyledVoteCell>
  );
};

const VoteDisplay = (props: GridPanelProps) => {
  const user = useStore(({ preferences }) => preferences?.user);
  const { shouldShowVotes, voteData, handleUpdateCurrentTicket } = useTickets();

  const hasAnyoneVoted = voteData.some(({ vote }) => vote !== undefined && vote !== '');

  const voteNodes = useMemo(
    () => voteData.map(
      ({ name: participantName, vote, inactive, consecutiveMisses, isObserver }, i) => {
        const userIsParticipant = participantName === user?.name;
        const hasVoted = isVoteCast(vote);
        const name = userIsParticipant ? 'you' : participantName;
        const displayVote = shouldShowVotes || (userIsParticipant && hasVoted);
        const isLast = i === voteData.length - 1;
        let mode: userModes = PARTICIPANT_MODES.DEFAULT;

        if (isObserver) {
          mode = NON_PARTICIPANT_MODES.OBSERVER;
        } else if (inactive) {
          mode = NON_PARTICIPANT_MODES.INACTIVE;
        } else if (consecutiveMisses > 2) {
          mode = NON_PARTICIPANT_MODES.ABSENT;
        } else if (hasVoted) {
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
      },
    ),
    [shouldShowVotes, user, voteData],
  );


  const showVotesButton = (
    <Button
      variation='info'
      width='full'
      onClick={() => {
        handleUpdateCurrentTicket('shouldShowVotes', true);
      }}
      disabled={shouldShowVotes || !hasAnyoneVoted}
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

import { AnimatePresence } from 'motion/react';
import { div as NewDisplayElementWrapper } from 'motion/react-client';
import { useMemo, JSX } from 'react';

import styled, { css } from 'styled-components';

import CircleCheckSvg from '@assets/icons/circle-check.svg?react';
import CoffeeSvg from '@assets/icons/coffee.svg?react';
import IdleSvg from '@assets/icons/idle.svg?react';
import InactiveSvg from '@assets/icons/inactive.svg?react';
import { Button, GridPanel } from '@components/common';
import { fadeDownEntrance } from '@components/common/animations';
import { GridPanelProps } from '@components/common/gridPanel';
import { useAuth } from '@modules/user';
import { usePrevious } from '@utils';
import { ThemedProps } from '@utils/styles/colors/types';
import { Participant, Vote } from '@yappy/types';

import { useTickets } from '../hooks';
import { isVoteCast } from '../utils';

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
};

type StyledVoteCellProps = {
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

  & > div:last-child {
    border-bottom-width: 0px !important;
  }
`;

const StyledVoteCell = styled.div<StyledVoteCellProps>`
  ${({
    isIdle,
    isInactive,
    theme,
  }: StyledVoteCellProps) => {
    let color = theme.primary.accent12;

    if (isIdle) {
      color = theme.warning.accent11;
    } else if (isInactive) {
      color = theme.greyscale.accent11;
    }

    return css`
      color: ${color};
      border-color: ${ theme.primary.accent6 };
      border-bottom-width: 1px !important;
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

const VoteCell = ({ voteData, cellMode }: VoteCellProps) => {
  const { name, vote = 0 } = voteData;
  const previousVote = usePrevious(vote ?? 0);

  const displayElement = useMemo(() => {
    switch (cellMode) {
      case PARTICIPANT_MODES.VOTED:
        return <CheckIcon title={`${ name } voted!`} />;
      case PARTICIPANT_MODES.REVEALED:
        return vote as Vote;
      case NON_PARTICIPANT_MODES.OBSERVER:
        return <CoffeeIcon title={`${ name } is just watching`} />;
      case NON_PARTICIPANT_MODES.ABSENT:
        return <IdleIcon title={`${ name } hasn't voted in a bit`} />;
      case NON_PARTICIPANT_MODES.INACTIVE:
        return <InactiveIcon title={`${ name } has left the room`} />;
      default:
        return null;
    }
  }, [
    cellMode,
    name,
    vote,
  ]);

  const presenceAnimation = cellMode === PARTICIPANT_MODES.REVEALED ? {
    opacity: 0,
    translateY: vote > (previousVote ?? 0) ? -12 : 12,
  } : {
    opacity: 0,
    scale: 0.5,
  };
  const animateAnimation = cellMode === PARTICIPANT_MODES.REVEALED ? {
    opacity: 0,
    translateY: -12,
  } : {
    opacity: 0,
    scale: 0.5,
  };

  return (
    <StyledVoteCell
      isInactive={cellMode === NON_PARTICIPANT_MODES.INACTIVE}
      isIdle={cellMode === NON_PARTICIPANT_MODES.ABSENT}
    >
      <VoteNameWrapper>
        {name}
      </VoteNameWrapper>
      <AnimatePresence mode='wait'>
        <NewDisplayElementWrapper
          key={`${cellMode}${cellMode === PARTICIPANT_MODES.REVEALED ? `-${vote}` : ''}`}
          initial={{
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0.5,
          }}
          transition={{ duration: 0.25 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginLeft: '1rem',
            width: `${ICON_SIZE}rem`,
          }}
        >
          {displayElement}
        </NewDisplayElementWrapper>
      </AnimatePresence>
    </StyledVoteCell>
  );
};

const VoteDisplay = ({ config }: GridPanelProps) => {
  const { user } = useAuth();
  const {
    shouldShowVotes,
    voteData,
    handleUpdateCurrentTicket,
  } = useTickets();

  const hasAnyoneVoted = voteData.some(({ vote }) => vote !== undefined && vote !== '');

  // const voteNodes = useMemo(
  //   () => voteData.map(
  //     ({ name: participantName, vote, inactive, consecutiveMisses, isObserver }, i) => {
  //       const userIsParticipant = participantName === user?.name;
  //       const hasVoted = isVoteCast(vote);
  //       const name = userIsParticipant ? 'you' : participantName;
  //       const displayVote = shouldShowVotes || (userIsParticipant && hasVoted);
  //       const isLast = i === voteData.length - 1;
  //       let mode: userModes = PARTICIPANT_MODES.DEFAULT;

  //       if (isObserver) {
  //         mode = NON_PARTICIPANT_MODES.OBSERVER;
  //       } else if (inactive) {
  //         mode = NON_PARTICIPANT_MODES.INACTIVE;
  //       } else if (consecutiveMisses > 2) {
  //         mode = NON_PARTICIPANT_MODES.ABSENT;
  //       } else if (hasVoted) {
  //         if (!displayVote) {
  //           mode = PARTICIPANT_MODES.VOTED;
  //         } else {
  //           mode = PARTICIPANT_MODES.REVEALED;
  //         }
  //       }

  //       return (
  //         <VoteCell
  //           key={i}
  //           cellMode={mode}
  //           isLast={isLast}
  //           voteData={{ name, vote }}
  //         />
  //       );
  //     },
  //   ),
  //   [shouldShowVotes, user, voteData],
  // );
  const voteNodes = useMemo(() => voteData.reduce((
    nodes,
    {
      name: participantName,
      vote,
      inactive,
      consecutiveMisses,
      isObserver,
    },
    i,
  ) => {
    const userIsParticipant = participantName === user?.name;
    const hasVoted = isVoteCast(vote);
    const name = userIsParticipant ? 'you' : participantName;
    const displayVote = shouldShowVotes || (userIsParticipant && hasVoted);
    const isLast = false;
    // const isLast = userIsParticipant ? nodes.length === 0 : i === voteData.length - 1;
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

    const node = (
      <VoteCell
        key={i}
        cellMode={mode}
        isLast={isLast}
        voteData={{
          name,
          vote,
        }}
      />
    );

    if (userIsParticipant) {
      nodes.unshift(node);
    } else {
      nodes.push(node);
    }

    return nodes;
  }, [] as JSX.Element[]), [
    shouldShowVotes,
    user,
    voteData,
  ]);


  const showVotesButton = (
    <Button
      variation='info'
      width='full'
      onClick={() => {
        handleUpdateCurrentTicket('shouldShowVotes', true);
      }}
      disabled={shouldShowVotes || !hasAnyoneVoted}
      textSize='small'
      refresh
    >
      show votes
    </Button>
  );

  return (
    <GridPanel
      config={config}
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

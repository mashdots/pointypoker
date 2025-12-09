import { useCallback, useMemo } from 'react';

import { arrayRemove, arrayUnion } from 'firebase/firestore';
import cloneDeep from 'lodash/cloneDeep';
import { v4 as uuid } from 'uuid';

import { JiraTicket } from '@modules/integrations/jira/types';
import { useAuth } from '@modules/user';
import { updateRoom } from '@services/firebase';
import useStore from '@utils/store';
import { RoomUpdateObject, Ticket } from '@yappy/types';
import { PossibleQueuedTicket } from '@yappy/types/legacy/room';

import { VoteDisplayProps } from '../panels/voteDisplay';
import {
  calculateAverage, calculateSuggestedPoints, isVoteCast, PointingTypes,
} from '../utils';

export enum TICKET_ACTIONS {
  SKIP,
  NEW,
  POINT,
  NEXT,
  REPORT_PII,
}

const useTickets = () => {
  const { user } = useAuth();
  const {
    completedTickets,
    currentTicket,
    participants,
    roomName,
    queue,
  } = useStore(({ room }) => (
    {
      completedTickets: room?.completedTickets,
      currentTicket: room?.currentTicket,
      participants: Object.values(room?.participants || {}),
      queue: room?.ticketQueue ?? [],
      roomName: room?.name,
    }
  ));

  const nextTicket = useMemo(() => {
    const currentTicketIndex = queue.findIndex((ticket) => ticket.id === currentTicket?.id);
    return queue?.[currentTicketIndex + 1] ?? null;
  }, [
    queue,
    currentTicket,
  ]);

  const voteData = useMemo(() => participants
    .sort((a, b) => a.joinedAt - b.joinedAt)
    .map(({
      name, id, inactive, consecutiveMisses, isObserver,
    }): VoteDisplayProps => ({
      consecutiveMisses,
      inactive,
      isObserver,
      name: name,
      vote: currentTicket?.votes[id] ?? '',
    })),
  [
    participants,
    currentTicket,
  ],
  );

  const areAllVotesCast = useMemo(
    () => participants
      .filter(({
        inactive, consecutiveMisses, isObserver,
      }) => !inactive && consecutiveMisses < 3 && !isObserver)
      .every(({ id }) => isVoteCast(currentTicket?.votes[id])),
    [
      participants,
      currentTicket?.votes,
    ],
  );

  const shouldShowVotes = useMemo(
    () => areAllVotesCast || !!currentTicket?.shouldShowVotes,
    [
      areAllVotesCast,
      currentTicket,
    ],
  );

  const handleUpdateCurrentTicket = useCallback((field: string, value: any, callback?: () => void) => {
    if (roomName && user && currentTicket) {
      const updateObj: RoomUpdateObject = {};
      updateObj[`currentTicket.${field}`] = value;

      if (field.includes('votes.')) {
        updateObj[`participants.${user.id}.consecutiveMisses`] = 0;
      }

      if (field === 'shouldShowVotes' && value) {
        updateObj['currentTicket.votesShownAt'] = Date.now();
      }

      if (currentTicket.fromQueue) {
        const clonedQueue = cloneDeep(queue);
        const indexInQueue = clonedQueue.findIndex((ticket) => ticket.id === currentTicket.id);

        if (indexInQueue !== -1) {
          // @ts-expect-error - indexInQueue at this point will always be a valid index. If the field doesn't exist, it will be created.
          clonedQueue[indexInQueue][field] = value;
          updateObj['ticketQueue'] = clonedQueue;
        }
      }

      updateRoom(roomName, updateObj, callback);
    }
  }, [
    roomName,
    currentTicket,
    queue,
  ]);

  const handleCreatePredefinedTicket = (
    preDefinedTicket: Partial<Ticket | JiraTicket | PossibleQueuedTicket>,
    isFromQueue = false,
    keepCurrentInQueue = false,
  ) => {
    handleCreateTicket(preDefinedTicket.name, preDefinedTicket, isFromQueue, keepCurrentInQueue);
  };

  /**
   * Creates a new ticket with the provided name.
   *
   * Any new ticket will be written to the `currentTicket` in the room. If there
   * is already a ticket in the `currentTicket`, the average and suggested
   * points will be calculated, and the ticket will be moved to the
   * `completedTickets` array.
   */
  const handleCreateTicket = useCallback((newTicketName = '', preDefinedTicket?: Partial<Ticket | JiraTicket | PossibleQueuedTicket>, fromQueue = false, keepCurrentInQueue = false) => {
    if (roomName && user) {
      const updateObj: RoomUpdateObject = {};
      updateObj['currentTicket'] = {
        createdAt: Date.now(),
        createdBy: user.id,
        fromQueue: fromQueue,
        id: uuid(),
        name: newTicketName,
        pointOptions: PointingTypes.fibonacci,
        shouldShowVotes: false,
        votes: {},
        votesShownAt: null,
        ...(preDefinedTicket || {}) ,
      } as Ticket;

      if (currentTicket) {
        const completedTicket = cloneDeep(currentTicket);

        if (shouldShowVotes) {
        // If any users did not vote, increment their consecutive misses
          participants.forEach(({ id }) => {
            if (!isVoteCast(currentTicket.votes[id])) {
              const currentConsecutiveMisses = participants.find((participant) => participant.id === id)?.consecutiveMisses || 0;
              updateObj[`participants.${ id }.consecutiveMisses`] = currentConsecutiveMisses + 1;
            }
          });

          // Calculate average and suggested points of current ticket and write to averagePoints of current ticket
          completedTicket.averagePoints = calculateAverage(currentTicket).average;

          if (!completedTicket.suggestedPoints) {
            completedTicket.suggestedPoints = calculateSuggestedPoints(currentTicket).suggestedPoints;
          }
        } else {
          completedTicket.suggestedPoints = 'skip';
        }

        if (!keepCurrentInQueue) {
          // Move the current ticket to the completed tickets array
          updateObj['completedTickets'] = arrayUnion(completedTicket);

          // If the ticket is in the queue, remove it from the queue
          if (currentTicket?.fromQueue) {
            const currentTicketFromQueue = queue.find((ticket) => ticket.id === currentTicket.id);
            updateObj['ticketQueue'] = arrayRemove(currentTicketFromQueue);
          }
        }
      }

      updateRoom(roomName, updateObj);
    }
  }, [
    roomName,
    currentTicket,
    participants,
    user,
    queue,
    shouldShowVotes,
  ]);

  const handleGoToNextTicket = useCallback(() => {
    if (roomName && user && nextTicket) {
      handleCreatePredefinedTicket(nextTicket, true);
    }
  }, [
    roomName,
    queue,
    nextTicket,
  ]);

  return {
    areAllVotesCast,
    completedTickets,
    currentTicket,
    handleCreatePredefinedTicket,
    handleCreateTicket,
    handleGoToNextTicket,
    handleUpdateCurrentTicket,
    nextTicket,
    queue,
    shouldShowVotes,
    voteData,
  };
};

export default useTickets;

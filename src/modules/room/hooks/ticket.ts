import { useCallback, useMemo } from 'react';
import { arrayRemove, arrayUnion } from 'firebase/firestore';
import cloneDeep from 'lodash/cloneDeep';
import { v4 as uuid } from 'uuid';

import { VoteDisplayProps } from '../panels/voteDisplay';
import { calculateAverage, calculateSuggestedPoints, isVoteCast, PointingTypes } from '../utils';
import { updateRoom } from '@services/firebase';
import useStore from '@utils/store';
import { RoomUpdateObject, Ticket } from '@yappy/types';
import { PossibleQueuedTicket } from '@yappy/types/room';
import { JiraTicket } from '@modules/integrations/jira/types';

export enum TICKET_ACTIONS {
  SKIP,
  NEW,
  POINT,
  NEXT,
}

const useTickets = () => {
  const {
    completedTickets,
    currentTicket,
    participants,
    roomName,
    queue,
    user,
  } = useStore(({ preferences, room }) => (
    {
      completedTickets: room?.completedTickets,
      currentTicket: room?.currentTicket,
      participants: Object.values(room?.participants || {}),
      queue: room?.ticketQueue ?? [],
      roomName: room?.name,
      user: preferences?.user,
    }
  ));

  const nextTicket = useMemo(() => {
    const currentTicketIndex = queue.findIndex((ticket) => ticket.id === currentTicket?.id);
    return queue?.[currentTicketIndex + 1] ?? null;
  }, [queue, currentTicket]);

  const voteData = useMemo(() => participants
    .sort((a, b) => a.joinedAt - b.joinedAt)
    .map(({ name, id, inactive, consecutiveMisses, isObserver }): VoteDisplayProps => ({
      name: name,
      vote: currentTicket?.votes[id] ?? '',
      inactive,
      isObserver,
      consecutiveMisses,
    })),
  [participants, currentTicket],
  );

  const areAllVotesCast = useMemo(
    () => participants
      .filter(({ inactive,consecutiveMisses }) => !inactive && consecutiveMisses < 3)
      .every(({ id }) => isVoteCast(currentTicket?.votes[id])),
    [participants, currentTicket?.votes],
  );

  const shouldShowVotes = useMemo(
    () => areAllVotesCast || !!currentTicket?.shouldShowVotes,
    [areAllVotesCast, currentTicket],
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

      updateRoom(roomName, updateObj, callback);
    }
  }, [roomName, currentTicket]);

  const handleCreatePredefinedTicket = (
    preDefinedTicket: Partial<Ticket | JiraTicket | PossibleQueuedTicket>,
    isFromQueue = false,
  ) => {
    handleCreateTicket(preDefinedTicket.name, preDefinedTicket, isFromQueue);
  };

  /**
   * Creates a new ticket with the provided name.
   *
   * Any new ticket will be written to the `currentTicket` in the room. If there
   * is already a ticket in the `currentTicket`, the average and suggested
   * points will be calculated, and the ticket will be moved to the
   * `completedTickets` array.
   */
  const handleCreateTicket = useCallback((newTicketName = '', preDefinedTicket?: Partial<Ticket | JiraTicket | PossibleQueuedTicket>, fromQueue = false) => {
    if (roomName && user) {
      const updateObj: RoomUpdateObject = {};
      updateObj['currentTicket'] = {
        name: newTicketName,
        createdBy: user.id,
        id: uuid(),
        shouldShowVotes: false,
        votes: {},
        createdAt: Date.now(),
        pointOptions: PointingTypes.fibonacci,
        votesShownAt: null,
        fromQueue: fromQueue,
        ...(preDefinedTicket || {}) ,
      } as Ticket;

      if (currentTicket && shouldShowVotes) {
        const completedTicket = cloneDeep(currentTicket);

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

        // Move the current ticket to the completed tickets array
        updateObj['completedTickets'] = arrayUnion(completedTicket);

        // If the ticket is in the queue, remove it from the queue
        if (currentTicket?.fromQueue) {
          const currentTicketFromQueue = queue.find((ticket) => ticket.id === currentTicket.id);
          updateObj['ticketQueue'] = arrayRemove(currentTicketFromQueue);
        }
      }

      updateRoom(roomName, updateObj);
    }
  }, [roomName, currentTicket, participants, user, queue, shouldShowVotes]);

  const handleGoToNextTicket = useCallback(() => {
    if (roomName && user && nextTicket) {
      handleCreatePredefinedTicket(nextTicket, true);
    }
  }, [roomName, queue, nextTicket]);

  return {
    areAllVotesCast,
    currentTicket,
    completedTickets,
    nextTicket,
    queue,
    shouldShowVotes,
    voteData,
    handleUpdateCurrentTicket,
    handleCreateTicket,
    handleCreatePredefinedTicket,
    handleGoToNextTicket,
  };
};

export default useTickets;

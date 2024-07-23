import { useCallback, useMemo } from 'react';
import { arrayUnion } from 'firebase/firestore';
import cloneDeep from 'lodash/cloneDeep';
import { v4 as uuid } from 'uuid';

import { VoteDisplayProps } from '../panels/voteDisplay';
import { calculateAverage, calculateSuggestedPoints, isVoteCast, PointingTypes } from '../utils';
import { updateRoom } from '@services/firebase';
import useStore from '@utils/store';
import { RoomUpdateObject, Ticket } from '@yappy/types';

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
      queue: room?.ticketQueue,
      roomName: room?.name,
      user: preferences?.user,
    }
  ));

  const voteData = useMemo(() => participants
    .sort((a, b) => a.joinedAt - b.joinedAt)
    .map(({ name, id, inactive, consecutiveMisses }): VoteDisplayProps => ({
      name: name,
      vote: currentTicket?.votes[id] ?? '',
      inactive,
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

  /**
   * Creates a new ticket with the provided name.
   *
   * Any new ticket will be written to the `currentTicket` in the room. If there
   * is already a ticket in the `currentTicket`, the average and suggested
   * points will be calculated, and the ticket will be moved to the
   * `completedTickets` array.
   */
  const handleCreateTicket = useCallback((newTicketName: string) => {
    if (roomName && user) {
      const updateObj: RoomUpdateObject = {};
      updateObj['currentTicket'] = {
        name: newTicketName,
        createdBy: user.id,
        id: uuid(),
        shouldShowVotes: false,
        votes: {},
        createdAt: Date.now(),
        timerStartAt: Date.now(),
        pointOptions: PointingTypes.fibonacci,
        votesShownAt: null,
      } as Ticket;

      if (currentTicket) {
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
        completedTicket.suggestedPoints = calculateSuggestedPoints(currentTicket).suggestedPoints;

        // Move the current ticket to the completed tickets array
        updateObj['completedTickets'] = arrayUnion(completedTicket);

        updateRoom(roomName, updateObj);
      }
    }
  }, [roomName, currentTicket, participants]);

  return {
    areAllVotesCast,
    currentTicket,
    completedTickets,
    queue,
    shouldShowVotes,
    voteData,
    handleUpdateCurrentTicket,
    handleCreateTicket,
  };
};

export default useTickets;

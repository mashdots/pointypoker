import { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';

import { Room, Ticket } from '../../../types';
import { VoteDisplayProps } from '../panels/voteDisplay';
import { updateRoom } from '../../../services/firebase';
import useStore from '../../../utils/store';
import { calculateAverage, calculateSuggestedPoints } from '../utils';

const useTickets = () => {
  const {
    participants = [],
    roomName,
    tickets,
    user,
  } = useStore(({ user, room }) => (
    {
      user,
      participants: Object.values(room?.participants || {}),
      tickets: room?.tickets ?? {},
      roomName: room?.name,
    }
  ));

  const sortedTickets = useMemo(() =>
    Object.values(tickets).sort((a, b) => b?.createdAt - a?.createdAt),
  [tickets],
  );

  const currentTicket = useMemo(() => sortedTickets[0], [sortedTickets]);

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
      .every(({ id }) => currentTicket?.votes[ id ]),
    [participants, currentTicket?.votes],
  );

  const shouldShowVotes = useMemo(
    () => areAllVotesCast || currentTicket?.shouldShowVotes,
    [areAllVotesCast, currentTicket],
  );

  const handleUpdateLatestTicket = useCallback((field: string, value: any, callback?: () => void) => {
    if (roomName && user && currentTicket) {
      const updateObj: Record<string, any> = {};
      updateObj[`tickets.${currentTicket.id}.${field}`] = value;

      if (field.includes('votes.')) {
        updateObj[`participants.${user.id}.consecutiveMisses`] = 0;
      }

      updateRoom(roomName, updateObj, callback);
    }
  }, [roomName, currentTicket]);

  const handleCreateTicket = useCallback((newTicketName?: string) => {
    if (roomName && user && currentTicket) {
      const updateObj: Record<string, any> = {};
      // If any users did not vote, increment their consecutive misses
      participants.forEach(({ id }) => {
        if (!currentTicket.votes[id]) {
          const currentConsecutiveMisses = participants.find((participant) => participant.id === id)?.consecutiveMisses || 0;
          updateObj[`participants.${ id }.consecutiveMisses`] = currentConsecutiveMisses + 1;
        }
      });

      // Calculate average and suggested points of current ticket and write to averagePoints of current ticket
      updateObj[`tickets.${currentTicket.id}.averagePoints`] = calculateAverage(currentTicket).average;
      updateObj[`tickets.${currentTicket.id}.suggestedPoints`] = calculateSuggestedPoints(currentTicket).suggestedPoints;

      const newTicket: Ticket = {
        createdAt: Date.now(),
        id: uuid(),
        createdBy: user.id,
        name: newTicketName || '',
        pointOptions: currentTicket?.pointOptions,
        shouldShowVotes: false,
        votes: {},
        votesShownAt: null,
      };

      if (newTicketName) {
        newTicket.timerStartAt = Date.now();
      }

      updateObj[`tickets.${newTicket.id}`] = newTicket;

      updateRoom(roomName, updateObj);
    }
  }, [roomName, currentTicket, participants]);

  return {
    areAllVotesCast,
    currentTicket,
    sortedTickets,
    shouldShowVotes,
    voteData,
    handleUpdateLatestTicket,
    handleCreateTicket,
  };
};

export default useTickets;

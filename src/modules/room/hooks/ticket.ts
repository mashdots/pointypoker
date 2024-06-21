import { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';

import { Ticket } from '../../../types';
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
    .map(({ name, id }): VoteDisplayProps => ({
      name: name,
      vote: currentTicket?.votes[id] ?? '',
    })),
  [participants, currentTicket],
  );

  const areAllVotesCast = useMemo(
    () => participants.every(({ id }) => currentTicket?.votes[id]),
    [participants, currentTicket?.votes],
  );

  const shouldShowVotes = useMemo(
    () => areAllVotesCast || currentTicket?.shouldShowVotes,
    [areAllVotesCast, currentTicket],
  );

  const handleUpdateLatestTicket = useCallback((field: string, value: any, callback?: () => void) => {
    if (roomName && user && currentTicket) {
      const roomObjPath = `tickets.${ currentTicket.id }.${field}`;

      updateRoom(roomName, roomObjPath, value, callback);
    }
  }, [roomName, currentTicket]);

  const handleCreateTicket = useCallback((newTicketName?: string) => {
    if (roomName && user && currentTicket) {
      // Calculate average and suggested points of current ticket and write to averagePoints of current ticket
      const { average } = calculateAverage(currentTicket);
      const { suggestedPoints } = calculateSuggestedPoints(currentTicket);
      handleUpdateLatestTicket('averagePoints', average);
      handleUpdateLatestTicket('suggestedPoints', suggestedPoints);

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

      updateRoom(roomName, `tickets.${newTicket.id}`, newTicket);
    }
  }, [roomName, currentTicket]);

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

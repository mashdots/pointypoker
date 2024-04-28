import { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';

import { Ticket, Vote } from '../../../types';
import { VoteDisplayProps } from '../components/voteDisplay';
import { updateRoom } from '../../../services/firebase';
import useStore from '../../../utils/store';

const useTickets = () => {
  const { room, user } = useStore(({ user, room }) => ({ user, room }));

  const currentTicket = useMemo(() =>
    room?.tickets
      ? Object.values(room?.tickets).sort((a, b) => b?.createdAt - a?.createdAt)[0]
      : null, [ room ]);

  const voteData = useMemo(() => {
    const { participants } = room || { participants: [] };
    const { votes }: { votes: {[ key: string ]: Vote} } = currentTicket || { votes: {} };

    return participants
      .sort((a, b) => a.joinedAt - b.joinedAt)
      .map(({ name, id }): VoteDisplayProps => ({
        name: name,
        vote: votes ? votes[ id ] : '',
      }));
  }, [ room?.participants, currentTicket?.votes ]);

  const areAllVotesCast = useMemo(() => {
    const { participants } = room || { participants: [] };
    const { votes }: { votes: {[ key: string ]: Vote} } = currentTicket || { votes: {} };

    return participants.every(({ id }) => votes[ id ]);
  }, [ room?.participants, currentTicket?.votes ]);

  const handleUpdateLatestTicket = useCallback((field: string, value: any, callback?: () => void) => {
    if (room && user && currentTicket) {
      let roomObjPath = `tickets.${ currentTicket.id }.${field}`;
      let resolvedValue = value;

      if (field === 'votes') {
        resolvedValue = {
          participantId: user.id,
          vote: value,
        };

        roomObjPath += `.${user.id}`;
      }

      updateRoom(room.name, roomObjPath, resolvedValue, callback);
    }
  }, [ room, currentTicket ]);

  const handleCreateTicket = useCallback((newTicketName?: string) => {
    if (room && user) {
      const newTicket: Ticket = {
        name: newTicketName || '',
        id: uuid(),
        shouldShowVotes: false,
        votes: {},
        createdAt: Date.now(),
      };

      updateRoom(room.name, `tickets.${newTicket.id}`, newTicket);
    }
  }, [ room ]);

  return {
    currentTicket,
    voteData,
    areAllVotesCast,
    handleUpdateLatestTicket,
    handleCreateTicket,
  };
};

export default useTickets;

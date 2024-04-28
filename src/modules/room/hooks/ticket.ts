import { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';

import useRoom from './room';
import { Ticket, Vote } from '../../../types';
import { VoteDisplayProps } from '../components/voteDisplay';
import { updateRoom } from '../../../services/firebase';
import useStore from '../../../utils/store';

const useTickets = () => {
  const roomData = useRoom();
  const user = useStore(({ user }) => user);

  const currentTicket = useMemo(() =>
    roomData?.tickets
      ? Object.values(roomData?.tickets).sort((a, b) => b?.createdAt - a?.createdAt)[0]
      : null, [ roomData ]);

  const voteData = useMemo(() => {
    const { participants } = roomData || { participants: [] };
    const { votes }: { votes: {[ key: string ]: Vote} } = currentTicket || { votes: {} };

    return participants
      .sort((a, b) => a.joinedAt - b.joinedAt)
      .map(({ name, id }): VoteDisplayProps => ({
        name: name,
        vote: votes ? votes[ id ] : '',
      }));
  }, [ roomData?.participants, currentTicket?.votes ]);

  const areAllVotesCast = useMemo(() => {
    const { participants } = roomData || { participants: [] };
    const { votes }: { votes: {[ key: string ]: Vote} } = currentTicket || { votes: {} };

    return participants.every(({ id }) => votes[ id ]);
  }, [ roomData?.participants, currentTicket?.votes ]);

  const handleUpdateLatestTicket = useCallback((field: string, value: any, callback?: () => void) => {
    if (roomData && user && currentTicket) {
      let roomObjPath = `tickets.${ currentTicket.id }.${field}`;
      let resolvedValue = value;

      if (field === 'votes') {
        resolvedValue = {
          participantId: user.id,
          vote: value,
        };

        roomObjPath += `.${user.id}`;
      }

      updateRoom(roomData.name, roomObjPath, resolvedValue, callback);
    }
  }, [ roomData ]);

  const handleCreateTicket = useCallback((newTicketName?: string) => {
    if (roomData && user) {
      const newTicket: Ticket = {
        name: newTicketName || '',
        id: uuid(),
        shouldShowVotes: false,
        votes: {},
        createdAt: Date.now(),
      };

      updateRoom(roomData.name, `tickets.${newTicket.id}`, newTicket);
    }
  }, [ roomData ]);

  return {
    currentTicket,
    voteData,
    areAllVotesCast,
    handleUpdateLatestTicket,
    handleCreateTicket,
  };
};

export default useTickets;

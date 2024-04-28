import { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';

import { Ticket } from '../../../types';
import { VoteDisplayProps } from '../components/voteDisplay';
import { updateRoom } from '../../../services/firebase';
import useStore from '../../../utils/store';

const useTickets = () => {
  const {
    participants = [],
    roomName,
    tickets,
    user,
  } = useStore(({ user, room }) => (
    {
      user,
      participants: room?.participants,
      tickets: room?.tickets,
      roomName: room?.name,
    }
  ));

  const currentTicket = useMemo(() =>
    tickets
      ? Object.values(tickets).sort((a, b) => b?.createdAt - a?.createdAt)[0]
      : null,
  [ tickets ],
  );

  const voteData = useMemo(() => participants
    .sort((a, b) => a.joinedAt - b.joinedAt)
    .map(({ name, id }): VoteDisplayProps => ({
      name: name,
      vote: currentTicket?.votes[ id ] ?? '',
    })),
  [ participants, currentTicket ],
  );

  const areAllVotesCast = useMemo(
    () => participants.every(({ id }) => currentTicket?.votes[ id ]),
    [ participants, currentTicket?.votes ],
  );

  const handleUpdateLatestTicket = useCallback((field: string, value: any, callback?: () => void) => {
    if (roomName && user && currentTicket) {
      let roomObjPath = `tickets.${ currentTicket.id }.${field}`;
      let resolvedValue = value;

      if (field === 'votes') {
        resolvedValue = {
          participantId: user.id,
          vote: value,
        };

        roomObjPath += `.${user.id}`;
      }

      updateRoom(roomName, roomObjPath, resolvedValue, callback);
    }
  }, [ roomName, currentTicket ]);

  const handleCreateTicket = useCallback((newTicketName?: string) => {
    if (roomName && user) {
      const newTicket: Ticket = {
        name: newTicketName || '',
        id: uuid(),
        shouldShowVotes: false,
        votes: {},
        createdAt: Date.now(),
      };

      updateRoom(roomName, `tickets.${newTicket.id}`, newTicket);
    }
  }, [ roomName ]);

  return {
    currentTicket,
    voteData,
    areAllVotesCast,
    handleUpdateLatestTicket,
    handleCreateTicket,
  };
};

export default useTickets;

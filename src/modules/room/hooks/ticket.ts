import { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';

import { Ticket } from '../../../types';
import { VoteDisplayProps } from '../components/voteDisplay';
import { updateRoom } from '../../../services/firebase';
import useStore from '../../../utils/store';
import { calculateAverage } from '../utils';

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
    if (roomName && user && currentTicket) {
      // Calculate average points of current ticket and write to averagePoints of current ticket
      const currentAverage = calculateAverage(currentTicket);
      handleUpdateLatestTicket('averagePoints', currentAverage);

      const newTicket: Ticket = {
        createdAt: Date.now(),
        id: uuid(),
        name: newTicketName || '',
        pointOptions: currentTicket?.pointOptions,
        shouldShowVotes: false,
        votes: {},
        votesShownAt: null,
      };

      updateRoom(roomName, `tickets.${newTicket.id}`, newTicket);
    }
  }, [ roomName ]);

  return {
    areAllVotesCast,
    currentTicket,
    handleUpdateLatestTicket,
    handleCreateTicket,
    // previousTickets,
    voteData,
  };
};

export default useTickets;

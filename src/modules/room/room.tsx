import React, { useCallback, useEffect, useMemo } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';

import useStore from '../../utils/store';
import { updateRoom } from '../../services/firebase';
import { Ticket, Participant } from '../../types';
import withUserSetup from '../user/userSetup';
import { TitleInput, VoteButtons, VoteDisplay, VoteStatistics } from './components';
import { Vote } from '../../types';
import { VoteDisplayProps } from './components/voteDisplay';
import useRoom from './hooks/room';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  height: 100%;
  width: 100%;
  align-items: center;
  padding: 1rem;
`;

const VoteDataWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-top: 1rem;
  flex-direction: row;
  align-self: flex-start;
  align-items: flex-start;
`;

const VoteParticipationWrapper = styled.div`
  display: flex;
  flex: 2;
  padding: 0.5rem;
  flex-direction: column;
  align-self: flex-start;
  align-items: flex-start;
`;

/**
 * TO DOs:
 * 1. Simplify and abstract the logic in this component
 * 2. Add room timer
 *
 * === Tickets ===
 * 1. The previous ticket name appears in a separate section with the average vote
 * 2. Whenever a new ticket is created, start a timer that stops whenever the votes are shown
 *
 * === Pointing ===
 * 1. Style the pointing interface
 * 2. Whenever votes are forced to be shown, anyone who hasn't voted will have consecutiveMisses incremented by 1. If consecutiveMisses is 3, set inactive to true. Have the UI reflect this.
 * 3. If a user votes, it resets their consecutiveMisses to 0.
 *
 * === Participant Section ===
 * 3. If the user is inactive, then their lack of vote will not be counted towards the total votes needed to show votes, and won't affect the average score calculation.
 * 4. If the user leaves the room, or if the user closes the window or navigates to another website, set their inactive to true.
 * 5. Differentiate between inactivity and leaving.
 *
 * === Final Results Section ===
 * 1. When there is consensus, show a message that there is consensus. See if you can show confetti
 *
 * === Completed Tickets section ===
 * 1. Show all tickets that have been completed, including the average vote.
 */

const Room = withUserSetup(() => {
  // Room Setup
  const roomData = useRoom();
  const user = useStore(({ user }) => user);

  // Ticket Setup
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
      let roomObjPath = `tickets.${ currentTicket.id }.${ field}`;
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

  // When a room loads, update the page title
  useEffect(() => {
    if (roomData) {
      document.title = `pointy poker - ${ roomData.name}`;

      if (user && !roomData.participants.find((participant) => participant.id === user.id)) {
        const selfAsParticipant: Participant = {
          id: user.id,
          name: user.name,
          consecutiveMisses: 0,
          inactive: false,
          isHost: false,
          joinedAt: Date.now(),
        };

        const updatedRoomData = cloneDeep(roomData);
        updatedRoomData.participants.push(selfAsParticipant);
        updateRoom(roomData.name, 'participants', updatedRoomData.participants);
      }
    }
  }, [roomData]);

  return (
    <Wrapper>
      <TitleInput />
      <VoteDataWrapper>
        <VoteParticipationWrapper>
          <VoteButtons handleVote={handleUpdateLatestTicket} />
          <VoteDisplay currentUser={user} voteData={voteData} shouldShowVotes={currentTicket?.shouldShowVotes || areAllVotesCast} />
        </VoteParticipationWrapper>
        <VoteStatistics
          createTicket={handleCreateTicket}
          updateTicket={handleUpdateLatestTicket}
          voteData={voteData}
          shouldShowVotes={currentTicket?.shouldShowVotes || areAllVotesCast}
        />
      </VoteDataWrapper>
    </Wrapper>
  );
});

export default Room;

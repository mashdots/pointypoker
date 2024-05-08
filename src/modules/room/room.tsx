import React, { useEffect, useRef } from 'react';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';

import useStore from '../../utils/store';
import { updateRoom, watchRoom } from '../../services/firebase';
import { Participant, Room as RoomType } from '../../types';
import withUserSetup from '../user/userSetup';
import { VoteButtons, VoteDisplay, VoteStatistics } from './components';
import { useMobile } from '../../utils/mobile';
import { TitleControl } from './components/titleControl';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  height: 100%;
  width: 100%;
  align-items: center;
  padding: 1rem;
`;

const VoteDataWrapper = styled.div<{ showNarrow: boolean}>`
  display: flex;
  width: 100%;
  margin-top: 1rem;
  align-self: flex-start;
  align-items: flex-start;

  ${({ showNarrow }) => css`
    flex-direction: ${showNarrow ? 'column' : 'row'};
    align-items: center;
  `};
`;

const VoteParticipationWrapper = styled.div`
  display: flex;
  flex: 2;
  padding: 0.5rem;
  flex-direction: column;
  align-self: flex-start;
  align-items: flex-start;
  width: 100%;
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
  const navigate = useNavigate();
  const { isMobile } = useMobile();
  const { roomData, setRoom, user } = useStore(({ room, setRoom, user }) => ({
    roomData: room,
    setRoom,
    user,
  }));
  const roomFromPath = window.location.pathname.slice(1);
  const subscribedRoomRef = useRef<ReturnType<typeof watchRoom>>();

  useEffect(() => {
    if (roomData || roomFromPath) {
      const roomToJoin = roomData?.name || roomFromPath;

      subscribedRoomRef.current = watchRoom(roomToJoin, (result) => {
        if (!result.error) {
          if (!isEqual(result.data, roomData)) {
            setRoom(result.data as RoomType);
          }
        } else {
          navigate('/');
          console.error(result);
        }
      });
    } else {
      navigate('/');
    }

    return () => {
      subscribedRoomRef.current?.();
    };
  }, [ roomData, roomFromPath ]);

  useEffect(() => {
    if (roomData) {
      document.title = `pointy poker - ${ roomData.name}`;

      if (user && !Object.values(roomData.participants).find((participant) => participant.id === user.id)) {
        const selfAsParticipant: Participant = {
          id: user.id,
          name: user.name,
          consecutiveMisses: 0,
          inactive: false,
          isHost: false,
          joinedAt: Date.now(),
        };

        const updatedRoomData = cloneDeep(roomData);
        updatedRoomData.participants[selfAsParticipant.id] = selfAsParticipant;
        updateRoom(roomData.name, 'participants', updatedRoomData.participants);
      }
    }
  }, [roomData]);

  return (
    <Wrapper>
      <TitleControl />
      <VoteDataWrapper showNarrow={isMobile}>
        <VoteParticipationWrapper>
          <VoteButtons />
          <VoteDisplay />
        </VoteParticipationWrapper>
        <VoteStatistics />
      </VoteDataWrapper>
    </Wrapper>
  );
});

export default Room;

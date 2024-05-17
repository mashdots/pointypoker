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
      console.log('HIT');
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
  }, []);

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

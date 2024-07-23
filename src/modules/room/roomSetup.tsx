import React, { useEffect, useMemo, useRef, useState } from 'react';
import isEqual from 'lodash/isEqual';
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';

import RoomPresenter from './roomPresenter';
import Button from '../../components/common/button';
import { useHeaderHeight } from '../../routes/root';
import { createRoom, updateRoom, watchRoom } from '../../services/firebase';
import { Participant, Room as RoomType, RoomUpdateObject } from '../../types';
import { generateRoomName, usePrevious } from '../../utils';
import useStore from '../../utils/store';

type HeightAdjusted = {
  heightDiff: number;
}

type RoomControl = {
  isRoomOpen: boolean;
}

const Container = styled.div<HeightAdjusted>`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: ${({ heightDiff }) => `calc(100vh - ${heightDiff || 0}px)`};
  width: 100%;
  overflow: hidden;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SetupWrapper = styled.div<RoomControl>`
  ${({ isRoomOpen }) => css`
    opacity: ${ isRoomOpen ? 0 : 1 };
  `}

  transition: opacity 250ms ease-out;
  text-align: center;
`;

const RoomWrapper = styled.div<RoomControl>`
  align-items: center;
  height: 100%;
  width: 100%;

  transition: all 250ms ease-out;
  
  ${({ isRoomOpen }) => css`
    opacity: ${isRoomOpen ? 1 : 0};
  `}
`;

let timeout: number | undefined;

const RoomSetup = () => {
  const { refHeight } = useHeaderHeight();
  const { roomData, user, setRoom } = useStore(
    ({ preferences, room, setRoom }) => ({
      user: preferences?.user,
      roomData: room,
      setRoom,
    }),
  );
  const subscribedRoomRef = useRef<ReturnType<typeof watchRoom>>();
  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [isRoomRendered, setIsRoomRendered] = useState(false);
  const wasRendered = usePrevious(isRoomRendered);
  const wasOpen = usePrevious(isRoomOpen);
  const navigate = useNavigate();
  const roomFromPath = useMemo(() => window.location.pathname.slice(1), [window.location.pathname]);

  const handleCreateRoom = async () => {
    if (!user) {
      return;
    }

    const roomName = generateRoomName();
    const self: Participant = {
      name: user.name,
      id: user.id,
      isHost: true,
      consecutiveMisses: 0,
      inactive: false,
      joinedAt: Date.now(),
    };
    const newRoom: RoomType = {
      name: roomName,
      createdAt: Date.now(),
      participants: {
        [self.id]: self,
      },
      ticketQueue: [],
      currentTicket: null,
      completedTickets: [],
    };

    await createRoom(newRoom, (result) => {
      if (!result.error) {
        const resolvedRoom = result.data as RoomType;
        navigate(`/${resolvedRoom.name}`);
      } else {
        console.error(result);
      }
    });
  };

  useEffect(() => {
    const roomToJoin = roomData || roomFromPath;

    if (roomToJoin && !subscribedRoomRef.current) {
      const roomToJoin = roomData?.name || roomFromPath;

      subscribedRoomRef.current = watchRoom(roomToJoin, (result) => {
        if (!result.error) {
          if (!isEqual(result.data, roomData)) {
            const { data } = result;
            setRoom(data as RoomType);
            setIsRoomRendered(true);
            document.title = `pointy poker - ${ (data as RoomType).name}`;
          }
        } else {
          navigate('/');
          console.error(result);
        }
      });
    } else if (!roomToJoin) {
      subscribedRoomRef.current?.();
      subscribedRoomRef.current = undefined;
      setIsRoomOpen(false);
      setRoom(null);
      navigate('/');
    }

    if (user && roomData) {
      const userInRoom = Object
        .values(roomData?.participants ?? {})
        .find((participant) => participant.id === user?.id);

      // If the user is not in the room, add them
      if (!userInRoom) {
        const updateObj: RoomUpdateObject = {};
        const selfAsParticipant: Participant = {
          id: user.id,
          name: user.name,
          consecutiveMisses: 0,
          inactive: false,
          isHost: false,
          joinedAt: Date.now(),
        };

        updateObj[`participants.${selfAsParticipant.id}`] = selfAsParticipant;

        updateRoom(roomData.name, updateObj);
      }

      // If the user is in the room, update their presence
      if (userInRoom && userInRoom.inactive) {
        const updateObj: RoomUpdateObject = {};
        updateObj[`participants.${user.id}.inactive`] = false;
        updateObj[`participants.${user.id}.consecutiveMisses`] = 0;

        updateRoom(roomData.name, updateObj);
      }
    }

    return () => {
      // Unsubscribe from the room
      subscribedRoomRef.current?.();
      subscribedRoomRef.current = undefined;
    };
  }, [roomData, roomFromPath]);

  useEffect(() => {
    document.title = 'pointy poker';
  }, []);

  /**
   * Over-engineered logic to make the room component slide in and out
   */
  useEffect(() => {
    clearTimeout(timeout);
    if (isRoomRendered && !isRoomOpen && !wasRendered) {
      setTimeout(() => {
        setIsRoomOpen(true);
      }, 100);
    }

    if (isRoomRendered && !isRoomOpen && wasOpen) {
      setTimeout(() => {
        setIsRoomRendered(false);
      }, 250);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isRoomOpen, isRoomRendered]);

  const conditionalComponent = isRoomRendered ? (
    <RoomWrapper isRoomOpen={isRoomOpen}>
      <RoomPresenter />
    </RoomWrapper>
  ) : (
    <SetupWrapper isRoomOpen={isRoomOpen}>
      <h1>ready to start?</h1>
      <ButtonContainer>
        <Button variation='info' width='full' onClick={handleCreateRoom}>
          start a session
        </Button>
      </ButtonContainer>
    </SetupWrapper>
  );

  return (
    <Container heightDiff={refHeight}>
      {conditionalComponent}
    </Container>
  );
};

export default RoomSetup;

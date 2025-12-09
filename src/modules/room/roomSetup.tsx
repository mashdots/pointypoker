import { AnimatePresence } from 'motion/react';
import { div as AnimatedWrapper } from 'motion/react-client';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { Timestamp } from 'firebase/firestore';
import isEqual from 'lodash/isEqual';
import styled from 'styled-components';

import Button from '@components/common/button';
import { useAuth } from '@modules/user';
import { useHeaderHeight } from '@routes/root';
import {
  createRoom,
  updateRoom,
  watchRoom,
} from '@services/firebase';
import { generateRoomName } from '@utils';
import useStore from '@utils/store';
import {
  Participant,
  Room as RoomType,
  RoomUpdateObject,
} from '@yappy/types';

import RoomPresenter from './roomPresenter';

type HeightAdjusted = {
  heightDiff: number;
};

const MONTH_IN_MS = 1000 * 60 * 60 * 24 * 30;

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

const SetupWrapper = styled.div`
  text-align: center;
`;

const RoomWrapper = styled.div`
  align-items: center;
  height: 100%;
  width: 100%;
`;

const RoomSetup = () => {
  const { refHeight } = useHeaderHeight();
  const { user } = useAuth();
  const {
    isObserver,
    roomData,
    setRoom,
  } = useStore(({
    preferences,
    room,
    setRoom,
  }) => ({
    isObserver: preferences?.isObserver ?? false,
    roomData: room,
    setRoom,
  }));
  const subscribedRoomRef = useRef<ReturnType<typeof watchRoom>>();
  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [isLoadingRoom, setIsLoadingRoom] = useState(true);
  const navigate = useNavigate();
  const roomToJoin = useMemo(() => {
    const nameFromPath = window.location.pathname.slice(1);

    if (nameFromPath) {
      return nameFromPath;
    }

    return roomData?.name ?? window.location.pathname.slice(1);
  }, [roomData?.name]);

  const handleJoinRoom = useCallback((roomName: string) => {
    setIsLoadingRoom(true);
    subscribedRoomRef.current = watchRoom(roomName, (result) => {
      if (!result.error) {
        if (!isEqual(result.data, roomData)) {
          const { data } = result;

          setRoom(data);

          if (!window.location.pathname.includes(roomName)) {
            navigate(`/${ roomName }`);
            document.title = `pointy poker - ${data.name}`;
          }

          setIsRoomOpen(true);
        }
      } else {
        navigate('/');
        console.error(result);
      }

      setIsLoadingRoom(false);
    });
  }, [
    navigate,
    roomData,
    setRoom,
  ]);

  const handleCreateRoom = useCallback(async () => {
    if (!user) {
      return;
    }

    setIsLoadingRoom(true);

    const roomName = generateRoomName();
    const self: Participant = {
      consecutiveMisses: 0,
      id: user.id,
      inactive: false,
      isHost: true,
      isObserver,
      joinedAt: Date.now(),
      name: user.name,
    };
    const newRoom: RoomType = {
      completedTickets: [],
      createdAt: Timestamp.now(),
      currentTicket: null,
      expiresAt: Timestamp.fromDate(new Date(Date.now() + MONTH_IN_MS)),
      name: roomName,
      participants: { [self.id]: self },
      ticketQueue: [],
    };

    await createRoom(newRoom, (result) => {
      if (!result.error) {
        const resolvedRoom = result.data;
        handleJoinRoom(resolvedRoom.name);
      } else {
        console.error(result);
        setIsLoadingRoom(false);
      }
    });
  }, [
    handleJoinRoom,
    isObserver,
    user,
  ]);

  /**
   * This effect handles joining and leaving rooms based on the roomToJoin value.
   */
  useEffect(() => {
    // If there's data for a room to join, and we're not already subscribed, kick off the join process.
    if (roomToJoin && !subscribedRoomRef.current) {
      setIsLoadingRoom(true);
      handleJoinRoom(roomToJoin);
    } else if (!roomToJoin) {
      // If there's no room to join, cancel any existing subscriptions and close the room.
      subscribedRoomRef.current?.();
      subscribedRoomRef.current = undefined;
      setIsRoomOpen(false);
      navigate('/');
      setRoom(null);
      document.title = 'pointy poker';
      setIsLoadingRoom(false);
    }

    return () => {
      // Unsubscribe from the room upon unmount
      subscribedRoomRef.current?.();
      subscribedRoomRef.current = undefined;
    };
  }, [
    handleJoinRoom,
    navigate,
    roomToJoin,
    setRoom,
  ]);

  /**
   * This effect ensures that when a user joins a room, they are added as a participant if not already present.
   */
  useEffect(() => {
    if (user && roomData) {
      const updateObj: RoomUpdateObject = {};
      const userInRoom = Object
        .values(roomData?.participants ?? {})
        .find((participant) => participant.id === user?.id);

      if (!userInRoom) {
      // If the user is not in the room, add them
        const selfAsParticipant: Participant = {
          consecutiveMisses: 0,
          id: user.id,
          inactive: false,
          isHost: false,
          isObserver,
          joinedAt: Date.now(),
          name: user.name,
        };

        updateObj[ `participants.${ selfAsParticipant.id }` ] = selfAsParticipant;
      } else if (userInRoom.inactive) {
        // If they are but are inactive, set them to active
        updateObj[ `participants.${ user.id }.inactive` ] = false;
        updateObj[ `participants.${ user.id }.consecutiveMisses` ] = 0;
      }

      updateRoom(roomData.name, updateObj);
    }
  }, [
    user,
    roomData,
    isObserver,
  ]);

  useEffect(() => {
    document.title = 'pointy poker';
  }, []);

  return (
    <Container heightDiff={refHeight}>
      <AnimatePresence mode='wait'>
        <AnimatedWrapper
          key={isRoomOpen ? 'room' : 'setup'}
          style={isRoomOpen ? {
            height: '100%',
            width: '100%',
          } : {}}
          initial={{
            opacity: 0,
            y: -12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: isRoomOpen ? -12 : 12,
          }}
          transition={{
            duration: 0.25,
            type: 'tween',
          }}
        >
          {
            isRoomOpen ? (
              <RoomWrapper>
                <RoomPresenter />
              </RoomWrapper>
            ) : (
              <SetupWrapper>
                <h1>ready to start?</h1>
                <ButtonContainer>
                  <Button refresh loading={isLoadingRoom}
                    variation='info' width='full'
                    onClick={handleCreateRoom}>
                    start a session
                  </Button>
                </ButtonContainer>
              </SetupWrapper>
            )
          }
        </AnimatedWrapper>
      </AnimatePresence>
    </Container>
  );
};

export default RoomSetup;

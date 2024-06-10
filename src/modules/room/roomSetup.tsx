import React, { useEffect, useMemo, useRef, useState } from 'react';
import isEqual from 'lodash/isEqual';
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import Button from '../../components/common/button';
import { generateRoomName, usePrevious } from '../../utils';
import useStore from '../../utils/store';
import { Participant, Room as RoomType } from '../../types';
import { createRoom, watchRoom } from '../../services/firebase';
import { PointingTypes } from './utils';
import { useHeaderHeight } from '../../routes/root';
import { ThemedProps } from '../../utils/styles/colors/colorSystem';
import Room from './room';
import { useMobile } from '../../utils/mobile';

type HeightAdjusted = {
  heightDiff: number;
}

type RoomControl = {
  isRoomOpen: boolean;
}

type RoomWrapperProps = HeightAdjusted & ThemedProps & RoomControl & {
  collapseHorizontal: boolean;
};

const Container = styled.div<HeightAdjusted>`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: ${({ heightDiff }) => `calc(100vh - ${heightDiff || 0}px)`};
  width: 100vw;
  overflow: hidden;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SetupWrapper = styled.div<RoomControl>`
  transition: all 250ms ease-out;
  
  ${({ isRoomOpen }) => css`
    opacity: ${isRoomOpen ? 0 : 1};
  `}
`;

const RoomWrapper = styled.div<RoomWrapperProps>`
  display: flex;
  position: absolute;
  flex-direction: column;
  align-items: center;
  border-radius: 2rem;
  
  transition: all 250ms ease-out;
  
  ${({ collapseHorizontal, heightDiff, theme, isRoomOpen }) => css`
    background-color: ${theme.primary.bgElement};
    height: calc(100vh - ${ heightDiff * 2 || 0 }px)};
    opacity: ${isRoomOpen ? 1 : 0};
    transform: translateY(${isRoomOpen ? 0 : 2}%);
    width: ${collapseHorizontal ? 100 : 95}vw;
  `}
`;

let timeout: number | undefined;

const RoomSetup = () => {
  const { refHeight } = useHeaderHeight();
  const { isMobile } = useMobile();
  const {
    roomData,
    user,
    isRoomOpen,
    setIsRoomOpen,
  } = useStore(({ user, room, isRoomOpen, setIsRoomOpen }) => ({ user, roomData: room, isRoomOpen, setIsRoomOpen }));
  const setRoom = useStore((state) => state.setRoom);
  const subscribedRoomRef = useRef<ReturnType<typeof watchRoom>>();
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
    const initialTicket = {
      name: '',
      createdBy: self.id,
      id: uuid(),
      shouldShowVotes: false,
      votes: {},
      createdAt: Date.now(),
      pointOptions: PointingTypes.limitedFibonacci,
      votesShownAt: null,
    };
    const newRoom: RoomType = {
      name: roomName,
      createdAt: Date.now(),
      participants: {
        [self.id]: self,
      },
      tickets: {
        [initialTicket.id]: initialTicket,
      },
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
            setRoom(result.data as RoomType);
            setIsRoomRendered(true);
            document.title = `pointy poker - ${ roomData?.name}`;
          }
        } else {
          navigate('/');
          console.error(result);
        }
      });
    } else if (!roomToJoin) {
      subscribedRoomRef.current?.();
      navigate('/');
      setIsRoomOpen(false);
    }

    return () => {
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

  const setupComponent = isRoomRendered ? null : (
    <SetupWrapper isRoomOpen={isRoomOpen}>
      <h1>ready to start?</h1>
      <ButtonContainer>
        <Button variation='info' width='full' onClick={handleCreateRoom}>
          start a session
        </Button>
      </ButtonContainer>
    </SetupWrapper>
  );


  const roomComponent = isRoomRendered ? (
    <RoomWrapper
      isRoomOpen={isRoomOpen}
      heightDiff={refHeight}
      collapseHorizontal={isMobile}
    >
      <Room />
    </RoomWrapper>
  ) : null;

  return (
    <Container heightDiff={refHeight}>
      {setupComponent}
      {roomComponent}
    </Container>
  );
};

export default RoomSetup;

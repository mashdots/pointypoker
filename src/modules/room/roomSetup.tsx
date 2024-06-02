import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import Button from '../../components/common/button';
import { generateRoomName } from '../../utils';
import useStore from '../../utils/store';
import { Participant, Room } from '../../types';
import { createRoom } from '../../services/firebase';
import { PointingTypes } from './utils';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const RoomSetup = () => {
  const { room, user } = useStore((state) => ({ user: state.user, room: state.room }));
  const setRoom = useStore((state) => state.setRoom);
  const navigate = useNavigate();

  const roomFromPath = useMemo(() => {
    return window.location.pathname.slice(1);
  }, [window.location.pathname]);

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
      id: uuid(),
      shouldShowVotes: false,
      votes: {},
      createdAt: Date.now(),
      pointOptions: PointingTypes.limitedFibonacci,
      votesShownAt: null,
    };
    const newRoom: Room = {
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
        const resolvedRoom = result.data as Room;
        setRoom(resolvedRoom);
        navigate(`/${ resolvedRoom.name}`);
      } else {
        console.error(result);
      }
    });
  };

  useEffect(() => {
    document.title = 'pointy poker';
  }, []);

  // useEffect(() => {
  //   console.log('ROOM FROM PATH', roomFromPath);
  // }, [ roomFromPath ]);

  return (
    <Wrapper>
      <h1>ready to start?</h1>
      <ButtonContainer>
        <Button margin='center' variation='info' width='full' onClick={handleCreateRoom}>start a session</Button>
      </ButtonContainer>
    </Wrapper>
  );
};

export default RoomSetup;

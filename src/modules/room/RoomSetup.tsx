import React from 'react';
import styled from 'styled-components';
import Button from '../../components/common/button';
import { generateRoomName } from '../../utils';
import useStore from '../../utils/store';
import { Participant, Room } from '../../types';
import { createRoom } from '../../services/firebase';

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const RoomSetup = () => {
  const user = useStore((state) => state.user);
  const setRoom = useStore((state) => state.setRoom);

  const getRoomName = () => {
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
    const room: Room = {
      name: roomName,
      id: '',
      participants: [ self ],
      issues: [],
    };

    createRoom(room, (result) => {
      if (!result.error) {
        setRoom(result.data as Room);
      }
    });
  };

  return (
    <>
      <h1>what do you want to do?</h1>
      <ButtonContainer>
        <Button margin='right' variation='info' width='half' onClick={getRoomName}>start a session</Button>
        <Button margin='left' variation='info' width='half'>join a session</Button>
      </ButtonContainer>
    </>
  );
};

export default RoomSetup;

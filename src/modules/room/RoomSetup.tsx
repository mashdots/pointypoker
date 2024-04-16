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

/**
 * TO DOs:
 * 1. Create form for joining a room
 * 2. If the user joins the room, create an object with the necessary data.
 * 3. If the user joins the room and was a former participant, update their joinedAt time, and set inactive to false, and reset consecutiveMisses to 0.
 * 4. When the page loads, check the URL for a room name. If it exists, attempt to join that room. If it doesn't exist, show the room setup form with a message saying the room doesn't exist.
 */

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
      participants: [ self ],
      issues: [],
    };

    createRoom(room, (result) => {
      if (!result.error) {
        setRoom(result.data as Room);
      } else {
        console.error(result);
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

import React from 'react';
import styled from 'styled-components';
import Button from '../../components/common/button';
import { generateRoomName } from '../../utils';
import useStore from '../../utils/store';

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const RoomSetup = () => {
  const setRoom = useStore((state) => state.setRoom);

  const getRoomName = () => {
    const roomName = generateRoomName();

    setRoom(roomName);
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

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import Button from '../../components/common/button';
import { generateRoomName } from '../../utils';
import useStore from '../../utils/store';
import { Participant, Room } from '../../types';
import { createRoom } from '../../services/firebase';
import withUserSetup from '../user/userSetup';

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

/**
 * TO DOs:
 * 1. If a user is navigated here because a room didn't exist, show a message that the room doesn't exist.
 */
const RoomSetup = withUserSetup(() => {
  const user = useStore((state) => state.user);
  const setRoom = useStore((state) => state.setRoom);
  const navigate = useNavigate();

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
    const initialIssue = {
      name: '',
      id: uuid(),
      shouldShowVotes: false,
      votes: {},
      createdAt: Date.now(),
    };
    const room: Room = {
      name: roomName,
      createdAt: Date.now(),
      participants: [ self ],
      issues: [ initialIssue ],
    };

    await createRoom(room, (result) => {
      if (!result.error) {
        const resolvedRoomName = (result.data as Room).name;
        setRoom(resolvedRoomName);
        navigate(`/${ resolvedRoomName}`);
      } else {
        console.error(result);
      }
    });
  };

  useEffect(() => {
    document.title = 'pointy poker';
  }, []);

  return (
    <Wrapper>
      <h1>ready to start?</h1>
      <ButtonContainer>
        <Button margin='center' variation='info' width='full' onClick={handleCreateRoom}>start a session</Button>
        {/* <Button margin='left' variation='info' width='half'>join a session</Button> */}
      </ButtonContainer>
    </Wrapper>
  );
});

export default RoomSetup;

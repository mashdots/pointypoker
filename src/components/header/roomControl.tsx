import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import useStore from '../../utils/store';

const Wrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding-left: 1rem;
  padding-top: 0.5rem;
`;

const RoomControl = () => {
  const room = useStore((state) => state.room);
  const clearRoom = useStore((state) => state.clearRoom);
  const navigate = useNavigate();

  const handleExitRoom = () => {
    navigate('/');
    clearRoom();
  };

  if (room) {
    return <Wrapper onClick={handleExitRoom}>| {room}</Wrapper>;
  } else {
    return null;
  }
};

export default RoomControl;

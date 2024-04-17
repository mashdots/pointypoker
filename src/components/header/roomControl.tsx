import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import useStore from '../../utils/store';

const Wrapper = styled.div`
  cursor: pointer;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  padding-right: 1rem;
`;

const RoomControl = () => {
  const room = useStore((state) => state.room);
  const clearRoom = useStore((state) => state.clearRoom);
  const navigate = useNavigate();

  const handleExitRoom = () => {
    navigate('/');
    clearRoom();
  };

  return <Wrapper onClick={handleExitRoom}>{room}</Wrapper>;
};

export default RoomControl;

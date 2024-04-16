import React from 'react';
import styled from 'styled-components';
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

  return <Wrapper onClick={clearRoom}>{room}</Wrapper>;
};

export default RoomControl;

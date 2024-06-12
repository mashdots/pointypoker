import React from 'react';
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';

import useStore from '../../utils/store';
import { ThemedProps } from '../../utils/styles/colors/colorSystem';

const Wrapper = styled.div<ThemedProps & { appear: boolean }>`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding-top: 0.25rem;
  padding-left: 0.5rem;
  margin-left: 0.5rem;

  transition: all 300ms ease-out;

  ${({ appear, theme }) => css`
    cursor: ${appear ? 'pointer' : 'default'};
    border-left-color: ${theme.primary.textLow};
  `};
`;

const Separator = styled.div<ThemedProps & { appear: boolean }>`
  width: 0.125rem;
  margin-right: 0.5rem;
  transition: all 300ms ease-out;

  ${({ appear, theme }) => css`
    height: ${appear ? 1.5 : 0}rem;
    background-color: ${theme.primary.textLow}; 
  `}
`;

const RoomControl = () => {
  const { room, clearRoom } = useStore((state) => ({
    room: state.room,
    clearRoom: state.clearRoom,
  }));
  const navigate = useNavigate();

  const handleExitRoom = () => {
    navigate('/');
    clearRoom();
  };

  return <Wrapper appear={!!room} onClick={() => !!room && handleExitRoom()}>
    <Separator appear={!!room} />
    {room?.name}
  </Wrapper>;
};

export default RoomControl;

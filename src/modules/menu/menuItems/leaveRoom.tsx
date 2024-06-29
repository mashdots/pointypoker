import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';

import useStore from '../../../utils/store';
import { updateRoom } from '../../../services/firebase';
import MenuItem from './menuItem';
import DoorIcon from '../../../assets/icons/door.svg?react';
import { ThemedProps } from '../../../utils/styles/colors/colorSystem';


const Icon = styled(DoorIcon)<ThemedProps>`
  width: 1.5rem;
  margin-right: 1rem;

  ${ ({ theme }: ThemedProps) => css`
    > line, path {
      stroke: ${ theme.error.textLow };
    }
    > circle {
      fill: ${ theme.error.textLow };
    }
  `}
`;

const LeaveRoomMenuItem = () => {
  const { roomName, room, clearRoom, user } = useStore((state) => ({
    roomName: state?.room?.name,
    room: state.room,
    clearRoom: state.clearRoom,
    user: state.user,
  }));
  const navigate = useNavigate();

  const handleExitRoom = () => {
    if (room && user && room.participants[ user.id ]) {
      const updateObj: Record<string, any> = {};
      updateObj[ `participants.${ user.id }.inactive` ] = true;

      updateRoom(room.name, updateObj);
    }
    navigate('/');
    clearRoom();
  };

  return (
    <MenuItem
      text={`leave ${roomName}`}
      uniqueElement={<Icon />}
      onClick={handleExitRoom}
    />
  );
};

export default LeaveRoomMenuItem;

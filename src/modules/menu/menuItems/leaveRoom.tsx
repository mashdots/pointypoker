import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';

import MenuItem from './menuItem';
import DoorIcon from '@assets/icons/door.svg?react';
import { updateRoom } from '@services/firebase';
import useStore from '@utils/store';
import { ThemedProps } from '@utils/styles/colors/colorSystem';
import { RoomUpdateObject } from '@yappy/types';


const Icon = styled(DoorIcon)<ThemedProps>`
  width: 1.5rem;
  margin-right: 1rem;

  ${ ({ theme }: ThemedProps) => css`
    > line, path {
      stroke: ${ theme.error.accent11 };
    }
    > circle {
      fill: ${ theme.error.accent11 };
    }
  `}
`;

const LeaveRoomMenuItem = () => {
  const { roomName, room, clearRoom, user } = useStore((state) => ({
    roomName: state?.room?.name,
    room: state.room,
    clearRoom: state.clearRoom,
    user: state.preferences?.user,
  }));
  const navigate = useNavigate();

  const handleExitRoom = () => {
    if (room && user && room.participants[ user.id ]) {
      const updateObj: RoomUpdateObject = {};
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

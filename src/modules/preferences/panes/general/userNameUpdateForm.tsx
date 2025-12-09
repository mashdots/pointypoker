import React, { useEffect, useState } from 'react';

import { TextInput } from '@components/common';
import { useAuth } from '@modules/user';
import { updateRoom } from '@services/firebase';
import useStore from '@utils/store';
import { User, RoomUpdateObject } from '@yappy/types';

import { VerticalContainer } from '../common';

let timeout: number;

const UserNameUpdateForm = () => {
  const { user } = useAuth();
  const { id: userId, name: userName } = user || {};
  const {
    updateUserName,
    roomName,
    roomData,
  } = useStore(({ setPreference, room }) => ({
    roomData: room,
    roomName: room?.name,
    updateUserName: (name: string) => {
      if (user) {
        const updatedUser: User = {
          ...user,
          name,
        };
        setPreference('user', updatedUser);
      }
    },
  }));

  const [value, setValue] = useState(userName);

  useEffect(() => {
    if (value && value !== userName) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        updateUserName(value);

        // If the user is in a room, update their name in the room too
        const userInRoom = Object
          .values(roomData?.participants ?? {})
          .find((participant) => participant.id === userId);

        if (roomName && userInRoom) {
          const updateObj: RoomUpdateObject = {};
          updateObj[ `participants.${ userId }.name` ] = value;

          updateRoom(roomName, updateObj);
        }
      }, 1000);
    }
  }, [
    value,
    roomName,
    userId,
  ]);

  return (
    <VerticalContainer style={{ width: '100%' }}>
      <label>
        Name
      </label>
      <TextInput size='small' id="name-update"
        value={value ?? ''} onChange={(e) => setValue(e.target.value)}
        alignment='left' />
    </VerticalContainer>
  );
};

export default UserNameUpdateForm;

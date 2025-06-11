import React, { useEffect, useState } from 'react';

import { VerticalContainer } from '../../common';
import { TextInput } from '@components/common';
import { updateRoom } from '@services/firebase';
import useStore from '@utils/store';
import { User, RoomUpdateObject } from '@yappy/types';

let timeout: number;

const UserNameUpdateForm = () => {
  const { userName, userId, updateUserName, roomName, roomData } = useStore(({ preferences, setPreferences, room }) => ({
    userName: preferences?.user?.name,
    userId: preferences?.user?.id,
    updateUserName: (name: string) => {
      if (preferences?.user) {
        const updatedUser: User = { ...preferences.user, name };
        setPreferences('user', updatedUser);
      }
    },
    roomName: room?.name,
    roomData: room,
  }));
  const [ value, setValue ] = useState(userName);

  useEffect(() => {
    if (value && value !== userName) {
      clearTimeout(timeout);
      timeout = setTimeout(
        () => {
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
        },
        1000,
      );
    }
  }, [ value, roomName, userId ]);

  return (
    <VerticalContainer style={{ width: '100%' }}>
      <label>
        Name
      </label>
      <TextInput size='small' id="name-update" value={value ?? ''} onChange={setValue} alignment='left' />
    </VerticalContainer>
  );
};

export default UserNameUpdateForm;

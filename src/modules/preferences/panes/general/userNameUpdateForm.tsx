import {
  useEffect,
  useState,
} from 'react';

import { TextInput } from '@components/common';
import { useAuth } from '@modules/user';
import { updateRoom } from '@services/firebase';
import useStore from '@utils/store';
import { User, RoomUpdateObject } from '@yappy/types';

import { VerticalContainer } from '../common';

let timeout: number;

const UserNameUpdateForm = () => {
  const { user } = useAuth();
  const { id: userId = 'no-user-id', name: userName } = user || {};
  const {
    isInRoom,
    updateUserName,
    roomName,
  } = useStore(({ setPreference, room }) => ({
    isInRoom: room?.participants ? Object.keys(room.participants).includes(userId) : false,
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

        if (roomName && isInRoom) {
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
    userName,
    updateUserName,
    isInRoom,
  ]);

  return (
    <VerticalContainer style={{ width: '100%' }}>
      <label htmlFor="name-update">
        <h3>Name</h3>
      </label>
      <TextInput
        size='small'
        id="name-update"
        value={value ?? ''}
        onChange={(e) => setValue(e.target.value)}
        alignment='left'
      />
    </VerticalContainer>
  );
};

export default UserNameUpdateForm;

import React, { useEffect, useState } from 'react';

import { CheckBox } from '@components/common';
import { useAuthorizedUser } from '@modules/user/AuthContext';
import { updateRoom } from '@services/firebase';
import useStore from '@utils/store';
import { RoomUpdateObject } from '@yappy/types';

import { SettingsRow, VerticalContainer } from '../common';

let timeout: number;

const ObserverSwitch = () => {
  const { userId } = useAuthorizedUser();
  const {
    isObserver,
    updateIsObserver,
    roomName,
    roomData,
  } = useStore(({
    preferences,
    setPreferences,
    room,
  }) => ({
    isObserver: preferences?.isObserver ?? false,
    roomData: room,
    roomName: room?.name,
    updateIsObserver: (is: boolean) => {
      setPreferences('isObserver', is);
    },
  }));
  const [value, setValue] = useState(isObserver);

  useEffect(() => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      updateIsObserver(value);

      // If the user is in a room, update their name in the room too
      const userInRoom = Object
        .values(roomData?.participants ?? {})
        .find((participant) => participant.id === userId);

      if (roomName && userInRoom) {
        const updateObj: RoomUpdateObject = {};
        updateObj[ `participants.${ userId }.isObserver` ] = value;

        updateRoom(roomName, updateObj);
      }
    }, 250);
  }, [
    value,
    roomName,
    userId,
  ]);

  return (
    <VerticalContainer style={{ width: '100%' }}>
      <SettingsRow>
        <CheckBox id="observer-switch" checked={value}
          onChange={(e) => setValue(e.target.checked)} label="Observer Mode" />
      </SettingsRow>
    </VerticalContainer>
  );
};

export default ObserverSwitch;

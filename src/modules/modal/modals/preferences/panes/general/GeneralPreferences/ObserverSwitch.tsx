import React, { useEffect, useState } from 'react';

import { SettingsRow, VerticalContainer } from '../../common';
import { updateRoom } from '@services/firebase';
import useStore from '@utils/store';
import { RoomUpdateObject } from '@yappy/types';
import { CheckBox } from '@components/common';

let timeout: number;

const ObserverSwitch = () => {
  const { isObserver, userId, updateIsObserver, roomName, roomData } = useStore(({ preferences, setPreferences, room }) => ({
    isObserver: preferences?.isObserver ?? false,
    userId: preferences?.user?.id,
    updateIsObserver: (is: boolean) => {
      setPreferences('isObserver', is);
    },
    roomName: room?.name,
    roomData: room,
  }));
  const [ value, setValue ] = useState(isObserver);

  useEffect(() => {
    clearTimeout(timeout);
    timeout = setTimeout(
      () => {
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
      },
      250,
    );
  }, [ value, roomName, userId ]);

  return (
    <VerticalContainer style={{ width: '100%' }}>
      <SettingsRow>
        <CheckBox id="observer-switch" checked={value} onChange={(e) => setValue(e.target.checked)} label="Observer Mode" />
      </SettingsRow>
    </VerticalContainer>
  );
};

export default ObserverSwitch;

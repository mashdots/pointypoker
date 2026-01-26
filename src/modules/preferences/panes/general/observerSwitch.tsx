import { useEffect, useState } from 'react';

import { Toggle } from '@components/common';
import { useAuthorizedUser } from '@modules/user';
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
    isInRoom,
  } = useStore(({
    preferences,
    setPreference,
    room,
  }) => ({
    isInRoom: room?.participants ? Object.keys(room.participants).includes(userId ?? 'no-user-id') : false,
    isObserver: preferences?.isObserver ?? false,
    roomName: room?.name,
    updateIsObserver: (is: boolean) => {
      setPreference('isObserver', is);
    },
  }));
  const [value, setValue] = useState(isObserver);

  useEffect(() => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      updateIsObserver(value);

      if (roomName && isInRoom) {
        const updateObj: RoomUpdateObject = {};
        updateObj[ `participants.${ userId }.isObserver` ] = value;

        updateRoom(roomName, updateObj);
      }
    }, 250);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    value,
    roomName,
    userId,
    isInRoom,
  ]);

  return (
    <VerticalContainer style={{ width: '100%' }}>
      <SettingsRow>
        <label htmlFor="observer-switch"><h3>Observer Mode</h3></label>
        <Toggle
          id="observer-switch"
          isOn={value}
          handleToggle={() => setValue(!value)}
        />
      </SettingsRow>
    </VerticalContainer>
  );
};

export default ObserverSwitch;

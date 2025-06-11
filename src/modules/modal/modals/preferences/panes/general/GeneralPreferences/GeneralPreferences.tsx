import React from 'react';

import SettingField from '@modules/modal/modals/preferences/panes/common/settingField';
import { updateRoom } from '@services/firebase';
import useStore from '@utils/store';
import { User, RoomUpdateObject } from '@yappy/types';

import ObserverSwitch from './ObserverSwitch';
import { SettingsRow } from '../../common';
import { SettingFieldValue } from '@modules/modal/modals/preferences/panes/common/types';

const GeneralPreferences = () => {
  const { isObserver, userName, userId, updatePreference, roomName, roomData } = useStore(({ preferences, setPreferences, room }) => ({
    isObserver: preferences.isObserver ?? false,
    userName: preferences.name,
    userId: preferences.user?.id,
    updatePreference: (pref: string, newValue: SettingFieldValue) => {
      if (pref === 'name' && preferences.user) {
        // const updatedUser: User = { ...preferences.user, [pref]: newValue as string };
        setPreferences('name', newValue);
      }
      if (pref === 'isObserver') {
        setPreferences(pref, newValue as boolean);
      }
    },
    roomName: room?.name,
    roomData: room,
  }));

  const handleUpdate = (pref?: string, value?: SettingFieldValue) => {
    if (!pref || value === undefined) return;

    updatePreference(pref, value);
    console.log(`GeneralPreferences: ${ pref } changed to`, value);

    const userInRoom = Object
      .values(roomData?.participants ?? {})
      .find((participant) => participant.id === userId);

    if (roomName && userInRoom) {
      const updateObj: RoomUpdateObject = {};
      updateObj[`participants.${ userId }.${ pref }`] = value;
      console.log(`Updating room ${ roomName } with`, updateObj);

      updateRoom(roomName, updateObj);
    }
  };

  console.log(userName);

  return (
    <div>
      <SettingField
        label='Name'
        description='your name is stored in every session'
        onChange={handleUpdate}
        delay={1000}
        type="text"
        preference={'name'}
        value={userName ?? ''}
      />
      <SettingField
        label='Observing'
        description='when enabled, you can observe the room without participating'
        onChange={handleUpdate}
        delay={250}
        type="switch"
        preference='isObserver'
        value={isObserver}
      />
      <SettingsRow>
        <ObserverSwitch />
      </SettingsRow>
    </div>
  );
};

export default GeneralPreferences;

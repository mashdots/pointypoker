import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import CategoryCard, { GenericPrefCardProps } from './categoryCard';
import Icon from '../../../assets/icons/settings-general.svg?react';
import { SettingsRow, VerticalContainer } from './common';
import { TextInput } from '../../../components/common';
import useStore from '../../../utils/store';
import { User } from '../../../types';
import { updateRoom } from '../../../services/firebase';


let timeout: number;

const UserNameUpdateForm = () => {
  const { userName, userId, updateUserName, roomName, roomData } = useStore(({ preferences, setPreferences, room }) => ({
    userName: preferences?.user?.name,
    userId: preferences?.user?.id,
    updateUserName: (name: string) => {
      if (preferences?.user) {
        const updatedUser: User = { ...preferences.user, name };
        setPreferences('user', updatedUser );
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
            const updateObj: Record<string, any> = {};
            updateObj[`participants.${userId}.name`] = value;

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
      <TextInput size='small' id="name-update" value={value ?? ''} onChange={(e) => setValue(e.target.value)} alignment='left' />
    </VerticalContainer>
  );
};

const GeneralPreferences = () => {
  return (
    <div>
      <h2>General</h2>
      <SettingsRow>
        <UserNameUpdateForm />
      </SettingsRow>
    </div>
  );
};

const GeneralPrefsIcon = styled(Icon)`
  height: 2rem;
  width: 2rem;
  margin-bottom: 0.5rem;
`;

const GeneralPreferencesCard = ({ onClick, isActive }: GenericPrefCardProps) => (
  <CategoryCard
    key="general-card"
    onClick={onClick}
    icon={<GeneralPrefsIcon />}
    isActive={isActive}
    title='General'
  />
);

export { GeneralPreferences, GeneralPreferencesCard };

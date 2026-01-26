import styled from 'styled-components';

import Icon from '@assets/icons/settings-general.svg?react';
import ObserverSwitch from '@modules/preferences/panes/general/observerSwitch';
import PointSchemaSelector from '@modules/preferences/panes/general/pointSchemeSelector';

import CategoryCard, { GenericPrefCardProps } from '../categoryCard';
import { Separator, SettingsRow } from '../common';
import UserNameUpdateForm from './userNameUpdateForm';

const GeneralPreferences = () => {
  return (
    <div>
      <h2>General</h2>
      <SettingsRow>
        <UserNameUpdateForm />
      </SettingsRow>
      <SettingsRow>
        <ObserverSwitch />
      </SettingsRow>
      <Separator />
      <SettingsRow>
        <PointSchemaSelector />
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

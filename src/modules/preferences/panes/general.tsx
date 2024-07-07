import React from 'react';
import styled from 'styled-components';

import CategoryCard, { GenericPrefCardProps } from './categoryCard';
import Icon from '../../../assets/icons/settings-general.svg?react';

const GeneralPreferences = () => {
  return (
    <div>
      <h4>General Preferences</h4>
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
    onClick={onClick}
    icon={<GeneralPrefsIcon />}
    isActive={isActive}
    title='General'
  />
);

export { GeneralPreferences, GeneralPreferencesCard };

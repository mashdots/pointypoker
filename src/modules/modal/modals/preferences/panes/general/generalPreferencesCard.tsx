import React from 'react';
import styled from 'styled-components';

import CategoryCard, { GenericPrefCardProps } from '../categoryCard';

import Icon from '@assets/icons/settings-general.svg?react';

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

export { GeneralPreferencesCard };

import React from 'react';
import styled from 'styled-components';

import CategoryCard, { GenericPrefCardProps } from './categoryCard';
import JiraIntegrationCard from './integrations/jira';
import Icon from '@assets/icons/settings-integrations.svg?react';

const IntegrationsPreferences = () => {
  return (
    <div>
      <h2>Integrations</h2>
      <JiraIntegrationCard />
    </div>
  );
};

const IntegrationsPrefsIcon = styled(Icon)`
  height: 2rem;
  width: 2rem;
  margin-bottom: 0.5rem;
`;

const IntegrationsPreferencesCard = ({ onClick, isActive }: GenericPrefCardProps) => (
  <CategoryCard
    key="integrations-card"
    title='Integrations'
    icon={<IntegrationsPrefsIcon />}
    onClick={onClick}
    isActive={isActive}
  />
);

export { IntegrationsPreferencesCard, IntegrationsPreferences };

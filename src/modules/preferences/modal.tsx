import React, { useState } from 'react';

import styled, { css } from 'styled-components';

import { useMobile } from '@utils/hooks/mobile';
import { ThemedProps } from '@utils/styles/colors/types';

import {
  AppearancePreferences,
  AppearancePreferencesCard,
  GeneralPreferences,
  GeneralPreferencesCard,
  IntegrationsPreferences,
  IntegrationsPreferencesCard,
} from './panes';
import { GenericPrefCardProps } from './panes/categoryCard';

type Panes = {
  categoryCard: (props: GenericPrefCardProps) => JSX.Element;
  pane: React.ReactNode;
};

const Wrapper = styled.div<ThemedProps>`
  ${({ isNarrow }) => css`
    flex-direction: ${isNarrow ? 'column' : 'row'};
  `}

  ${({ isNarrow }) => !isNarrow && css`
    height: 100%;
  `}

  display: flex;
  width: 100%;
  overflow: hidden;
`;

const CategoryList = styled.ul <ThemedProps>`
  ${({ isNarrow, theme }) => css`
    background-color: ${theme.transparent.accent2};
    border: 1px solid ${theme.primary.accent2};
    flex-direction: ${isNarrow ? 'row' : 'column'};
  `};

  display: flex;
  justify-content: 'flex-start';
  flex: 1;
  height: 100%;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 0;
`;

const SettingsContainer = styled.div`
  display: flex;
  overflow: auto;
  width: 100%;
  padding: 0 0.5rem;

  > div {
    width: 100%;
  }
`;

const SettingsDisplay = styled.div`
  flex-direction: column;
  padding: 1rem;
`;

const PreferencesModal = () => {
  const { isNarrow } = useMobile();
  const [currentCategory, setCurrentCategory] = useState(0);

  const panes: Panes[] = [
    {
      categoryCard: GeneralPreferencesCard,
      pane: <GeneralPreferences />,
    },
    {
      categoryCard: AppearancePreferencesCard,
      pane: <AppearancePreferences />,
    },
    {
      categoryCard: IntegrationsPreferencesCard,
      pane: <IntegrationsPreferences />,
    },
  ];

  return (
    <Wrapper isNarrow={isNarrow}>
      <CategoryList isNarrow={isNarrow}>
        {panes.map(({ categoryCard }, index) => (
          categoryCard({
            isActive: index === currentCategory,
            onClick: () => setCurrentCategory(index),
          })
        ))}
      </CategoryList>
      <SettingsContainer>
        <SettingsDisplay>
          {panes[currentCategory].pane}
        </SettingsDisplay>
      </SettingsContainer>
    </Wrapper>
  );
};

export default PreferencesModal;

import React, { useState } from 'react';
import styled, { css } from 'styled-components';

import {
  AppearancePreferences,
  AppearancePreferencesCard,
  GeneralPreferences,
  GeneralPreferencesCard,
  IntegrationsPreferences,
  IntegrationsPreferencesCard,
} from './panes';
import { GenericPrefCardProps } from './panes/categoryCard';
import { useMobile } from '@utils/hooks/mobile';
import { ThemedProps } from '@utils/styles/colors/colorSystem';

type MobileProps = {
  isNarrow: boolean;
};

type Panes = {
  categoryCard: (props: GenericPrefCardProps) => JSX.Element;
  pane: React.ReactNode;
}

const Wrapper = styled.div<MobileProps>`
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

const CategoryList = styled.ul<MobileProps>`
  ${({ isNarrow, theme }: MobileProps & ThemedProps) => css`
    background-color: ${theme.primary.componentBg};
    border: 2px solid ${theme.primary.bgAlt};
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
          categoryCard(
            {
              onClick: () => setCurrentCategory(index),
              isActive: index === currentCategory,
            },
          )
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

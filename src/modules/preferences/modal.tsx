import React, { useState } from 'react';
import styled, { css } from 'styled-components';

import { useMobile } from '../../utils/hooks/mobile';
import { ThemedProps } from '../../utils/styles/colors/colorSystem';
import {
  AppearancePreferences,
  AppearancePreferencesCard,
  GeneralPreferences,
  GeneralPreferencesCard,
} from './panes';
import { GenericPrefCardProps } from './panes/categoryCard';

type MobileProps = {
  isMobile: boolean;
};

type Panes = {
  categoryCard: (props: GenericPrefCardProps) => JSX.Element;
  pane: React.ReactNode;
}

const Wrapper = styled.div<MobileProps>`
  ${({ isMobile }) => css`
    flex-direction: ${isMobile ? 'column' : 'row'};
  `}

  ${({ isMobile }) => !isMobile && css`
    height: 100%;
  `}

  display: flex;
  width: 100%;
`;

const CategoryList = styled.ul<MobileProps>`
  ${({ isMobile, theme }: MobileProps & ThemedProps) => css`
    background-color: ${theme.primary.componentBg};
    flex-direction: ${isMobile ? 'row' : 'column'};
  `};

  display: flex;
  justify-content: 'flex-start';
  flex: 1;
  height: 100%;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 0;
`;

const SettingsDisplay = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  flex: 4;
  overflow: scroll;
`;

const PreferencesModal = () => {
  const { isMobile } = useMobile();
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
  ];

  return (
    <Wrapper isMobile={isMobile}>
      <CategoryList isMobile={isMobile}>
        {panes.map(({ categoryCard }, index) => (
          categoryCard(
            {
              onClick: () => setCurrentCategory(index),
              isActive: index === currentCategory,
            },
          )
        ))}
      </CategoryList>
      <SettingsDisplay>
        {panes[currentCategory].pane}
      </SettingsDisplay>
    </Wrapper>
  );
};

export default PreferencesModal;

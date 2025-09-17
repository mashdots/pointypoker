import React from 'react';
import styled, { css } from 'styled-components';

import CategoryCard, { GenericPrefCardProps } from './categoryCard';
import { Separator, SettingsRow, VerticalContainer } from './common';
import { SystemModeCheckbox, ThemeModeToggle } from '../themeModeToggle';
import Icon from '@assets/icons/settings-appearance.svg?react';
import useStore from '@utils/store';
import useTheme, { ThemeOption as ThemeOptionType, ThemedProps } from '@utils/styles/colors/colorSystem';

type ThemeOptionWrapperProps = {
  isActive: boolean;
  baseColor: string;
  onClick: () => void
} & ThemedProps;

const Control = styled.span`
  display: flex;
  align-items: center;
`;

const ThemeOptionContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ThemeOptionWrapper = styled.label<ThemeOptionWrapperProps>`
  ${({ isActive, theme }: ThemeOptionWrapperProps) => css`
    background-color: ${isActive ? theme.primary.accent4 : theme.transparent.accent1};
    border-color: ${isActive ? theme.primary.accent8 : theme.transparent.accent1};
  `}
  
  border-width: 1px;
  cursor: pointer;
  border-style: solid;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  width: 35%;
  margin: 0.25rem 1rem 0.25rem 0;
  padding: 0.5rem;

  transition: background-color 300ms, border-width 300ms;
`;

const ColorChip = styled.span<Pick<ThemeOptionWrapperProps, 'baseColor'>>`
  ${({ baseColor }: Pick<ThemeOptionWrapperProps, 'baseColor'>) => css`
    background-color: ${baseColor};
  `}

  border-radius: 0.5rem;
  display: inline-block;
  height: 2rem;
  width: 2rem;
  min-width: 2rem;
  margin-right: 0.5rem;
`;

const ThemeOptionRadio = styled.input`
  visibility: hidden;
`;

const ThemeOption = ({
  theme,
  color,
  onClick,
  isActive,
}: ThemeOptionType & Pick<ThemeOptionWrapperProps, 'onClick' | 'isActive'>) => {

  return (
    <ThemeOptionWrapper isActive={isActive} onClick={onClick} baseColor={color}>
      <ColorChip baseColor={color} />
      {theme}
      <ThemeOptionRadio type='radio' name='theme' value={theme} onClick={() => 'click!'} />
    </ThemeOptionWrapper>
  );
};

const AppearancePreferences = () => {
  const { themeMode, themeOptions, setTheme } = useTheme();
  const { theme } = useStore(({ preferences }) => ({ theme: preferences?.theme }));

  return (
    <div>
      <h2>Appearance</h2>
      <SettingsRow>
        <label>
          Color mode
        </label>
        <Control>{themeMode}&nbsp;&nbsp;<ThemeModeToggle /></Control>
      </SettingsRow>
      <SettingsRow>
        <label>
          Sync color mode with system
        </label>
        <Control><SystemModeCheckbox /></Control>
      </SettingsRow>
      <Separator />
      <SettingsRow>
        <VerticalContainer>
          <label>
            Theme
          </label>
          <ThemeOptionContainer>
            {themeOptions.map(
              (option) => (
                <ThemeOption
                  key={option.theme}
                  isActive={option.theme === theme}
                  {...option}
                  onClick={() => setTheme(option.theme)}
                />
              ),
            )}
          </ThemeOptionContainer>
        </VerticalContainer>
      </SettingsRow>
    </div>
  );
};

const AppearancePrefsIcon = styled(Icon)`
  ${({ theme }: ThemedProps) => css`
    > circle {
      fill: ${theme.primary.accent11};
    }
  `};

  height: 2rem;
  width: 2rem;
  margin-bottom: 0.5rem;
`;

const AppearancePreferencesCard = ({ isActive, onClick }: GenericPrefCardProps) => (
  <CategoryCard
    key="appearance-card"
    icon={<AppearancePrefsIcon />}
    isActive={isActive}
    onClick={onClick}
    title='Appearance'
  />
);

export { AppearancePreferences, AppearancePreferencesCard };

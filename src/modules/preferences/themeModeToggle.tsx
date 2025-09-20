import React from 'react';
import styled, { css } from 'styled-components';

import DarkModeIcon from '@assets/icons/dark-mode-fill.svg?react';
import LightModeIcon from '@assets/icons/light-mode-fill.svg?react';
import Toggle from '@components/common/toggle';
import useStore from '@utils/store';
import useTheme from '@utils/styles/colors';
import { THEME_MODE_CONTROLLER, THEME_MODES, ThemedProps } from '@utils/styles/colors/colorSystem';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleWrapper = styled.span`
  margin-right: 0.5rem;
`;

const DarkMode = styled(DarkModeIcon)`
  ${({ theme }: ThemedProps) => css`
    > path {
      fill: ${theme.primary.accent12};
    }
  `}
  width: 1rem;
`;

const LightMode = styled(LightModeIcon)`
  ${({ theme }: ThemedProps) => css`
    > path {
      fill: ${ theme.primary.accent2 };
    }
  `}
  width: 1rem;
`;

export const ThemeModeToggle = ({ position }: { position?: 'left' | 'right' }) => {
  const { themeMode, toggleThemeMode } = useTheme();
  const colorOverrides = {
    onbg: 'success.accent9',
    offBg: 'info.accent9',
  };

  return (
    <Toggle
      isOn={themeMode !== THEME_MODES.LIGHT}
      handleToggle={toggleThemeMode}
      onIcon={<DarkMode />}
      offIcon={<LightMode />}
      colorOverrides={colorOverrides}
      position={position}
    />
  );
};

const ThemeModeToggleRow = () => {
  const { themeMode } = useTheme();

  const modeLabel = themeMode === THEME_MODES.DARK ? 'dark' : 'light';

  return (
    <Wrapper>
      <ToggleWrapper>
        <ThemeModeToggle position='left' />
      </ToggleWrapper>
      {modeLabel} mode
    </Wrapper>
  );
};

export const SystemModeCheckbox = () => {
  const { isThemeModeSetBySystem, setThemeModeController } = useStore(({ preferences, setPreferences }) => ({
    isThemeModeSetBySystem: preferences?.themeModeController !== THEME_MODE_CONTROLLER.USER,
    setThemeModeController: () => setPreferences(
      'themeModeController',
      preferences?.themeModeController === THEME_MODE_CONTROLLER.SYSTEM
        ? THEME_MODE_CONTROLLER.USER
        : THEME_MODE_CONTROLLER.SYSTEM,
    ),
  }));

  return (
    <Toggle isOn={isThemeModeSetBySystem} handleToggle={setThemeModeController} position='right' />
  );
};

export default ThemeModeToggleRow;

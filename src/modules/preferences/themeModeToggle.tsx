import React from 'react';
import styled, { css } from 'styled-components';

import Toggle from '../../components/common/toggle';
import useTheme from '../../utils/styles/colors';
import { THEME_MODES, ThemedProps } from '../../utils/styles/colors/colorSystem';
import DarkModeIcon from '../../assets/icons/dark-mode-fill.svg?react';
import LightModeIcon from '../../assets/icons/light-mode-fill.svg?react';

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
      fill: ${theme.primary.textHigh};
    }
  `}
  width: 1rem;
`;

const LightMode = styled(LightModeIcon)`
  ${({ theme }: ThemedProps) => css`
    > path {
      fill: ${ theme.primary.bgAlt };
    }
  `}
  width: 1rem;
`;

const ThemeModeToggle = () => {
  const { themeMode, toggleThemeMode } = useTheme();
  const colorOverrides = {
    onBg: 'success.solidBg',
    offBg: 'info.solidBg',
  };

  return (
    <Toggle
      isOn={themeMode === THEME_MODES.DARK}
      handleToggle={toggleThemeMode}
      onIcon={<DarkMode />}
      offIcon={<LightMode />}
      colorOverrides={colorOverrides}
      position='left'
    />
  );
};

export const ThemeModeToggleRow = () => {
  const { themeMode } = useTheme();

  const modeLabel = themeMode === THEME_MODES.DARK ? 'dark' : 'light';

  return (
    <Wrapper>
      <ToggleWrapper>
        <ThemeModeToggle />
      </ToggleWrapper>
      {modeLabel} mode
    </Wrapper>
  );
};

export default ThemeModeToggleRow;

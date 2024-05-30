import { THEME_COLORS } from '.';
import { ThemeReference } from '../colorSystem';

const main: ThemeReference = {
  primary: THEME_COLORS.GRAY,
  greyScale: THEME_COLORS.GRAY,
  functional: {
    success: THEME_COLORS.GREEN,
    warning: THEME_COLORS.YELLOW,
    error: THEME_COLORS.RED,
    info: THEME_COLORS.BLUE,
  },
};

export default main;

import { THEME_COLORS } from '.';
import { ThemeReference } from '../colorSystem';

const blueberry: ThemeReference = {
  primary: THEME_COLORS.INDIGO,
  greyScale: THEME_COLORS.SLATE,
  functional: {
    success: THEME_COLORS.GREEN,
    warning: THEME_COLORS.YELLOW,
    error: THEME_COLORS.RED,
    info: THEME_COLORS.BLUE,
  },
};

export default blueberry;

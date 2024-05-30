import { THEME_COLORS } from '.';
import { ThemeReference } from '../colorSystem';

const orange: ThemeReference = {
  primary: THEME_COLORS.ORANGE,
  greyScale: THEME_COLORS.SAND,
  functional: {
    success: THEME_COLORS.GREEN,
    warning: THEME_COLORS.YELLOW,
    error: THEME_COLORS.RED,
    info: THEME_COLORS.BLUE,
  },
};

export default orange;

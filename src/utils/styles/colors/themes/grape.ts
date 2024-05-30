import { THEME_COLORS } from './definitions';
import { ThemeReference } from '../colorSystem';

const grape: ThemeReference = {
  primary: THEME_COLORS.PURPLE,
  greyScale: THEME_COLORS.MAUVE,
  functional: {
    success: THEME_COLORS.GREEN,
    warning: THEME_COLORS.YELLOW,
    error: THEME_COLORS.RED,
    info: THEME_COLORS.BLUE,
  },
};

export default grape;

import { THEME_COLORS } from './definitions';
import { ThemeReference } from '../colorSystem';

const strawberry: ThemeReference = {
  primary: THEME_COLORS.CRIMSON,
  greyScale: THEME_COLORS.MAUVE,
  functional: {
    success: THEME_COLORS.GREEN,
    warning: THEME_COLORS.YELLOW,
    error: THEME_COLORS.TOMATO,
    info: THEME_COLORS.BLUE,
  },
};

export default strawberry;

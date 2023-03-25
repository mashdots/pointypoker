import {
  amberDark, // warning
  blueDark, // info
  grassDark, // success
  slateDark, // structure
  skyDark, // primary
  tomatoDark, // error
  blackA, // transparent
} from '@radix-ui/colors';

/**
 * REFERENCE ↴
 * https://www.radix-ui.com/docs/colors/palette-composition/understanding-the-scale
 */

export interface VariationTypes {
  [key: string]: VariationProperties;
  structure: VariationProperties;
  primary: VariationProperties;
  success: VariationProperties;
  warning: VariationProperties;
  error: VariationProperties;
  info: VariationProperties;
}

export interface VariationProperties {
  [key: string]: string;
  // 1 - App background
  bg: string;
  // 2 - Subtle background
  bgAlt: string;
  // 3 - Component backgrounds: normal state
  bgElement: string;
  // 4 - Component backgrounds: hover state
  bgElementHover: string;
  // 5 - Component backgrounds: pressed / selected state
  bgElementActive: string;
  // 6 - Borders: Subtle borders for non-interactive components
  border: string;
  // 7 - Borders: Borders for interactive elements
  borderElement: string;
  // 8 - Borders: Borders for interactive elements in hover state
  borderElementHover: string;
  // 9 - Solid backgrounds
  solidBg: string;
  // 10 - Hovered solid backgrounds
  hoverSolidBg: string;
  // 11 - Low-contrast text
  textLowContrast: string;
  // 12 - High-contrast text
  textHighContrast: string;
}

const COLORS = {
  ...amberDark,
  ...blueDark,
  ...grassDark,
  ...slateDark,
  ...skyDark,
  ...tomatoDark,
  ...blackA,
};

const VARIATIONS: VariationTypes = {
  transparent: {
    bg: COLORS.blackA1,
    bgAlt: COLORS.blackA2,
    bgElement: COLORS.blackA3,
    bgElementHover: COLORS.blackA4,
    bgElementActive: COLORS.blackA5,
    border: COLORS.blackA6,
    borderElement: COLORS.blackA7,
    borderElementHover: COLORS.blackA8,
    solidBg: COLORS.blackA9,
    hoverSolidBg: COLORS.blackA10,
    textLowContrast: COLORS.blackA11,
    textHighContrast: COLORS.blackA12,
  },
  structure: {
    bg: COLORS.slate1,
    bgAlt: COLORS.slate2,
    bgElement: COLORS.slate3,
    bgElementHover: COLORS.slate4,
    bgElementActive: COLORS.slate5,
    border: COLORS.slate6,
    borderElement: COLORS.slate7,
    borderElementHover: COLORS.slate8,
    solidBg: COLORS.slate9,
    hoverSolidBg: COLORS.slate10,
    textLowContrast: COLORS.slate11,
    textHighContrast: COLORS.slate12,
  },
  primary: {
    bg: COLORS.sky1,
    bgAlt: COLORS.sky2,
    bgElement: COLORS.sky3,
    bgElementHover: COLORS.sky4,
    bgElementActive: COLORS.sky5,
    border: COLORS.sky6,
    borderElement: COLORS.sky7,
    borderElementHover: COLORS.sky8,
    solidBg: COLORS.sky9,
    hoverSolidBg: COLORS.sky10,
    textLowContrast: COLORS.sky11,
    textHighContrast: COLORS.sky12,
  },
  success: {
    bg: COLORS.grass1,
    bgAlt: COLORS.grass2,
    bgElement: COLORS.grass3,
    bgElementHover: COLORS.grass4,
    bgElementActive: COLORS.grass5,
    border: COLORS.grass6,
    borderElement: COLORS.grass7,
    borderElementHover: COLORS.grass8,
    solidBg: COLORS.grass9,
    hoverSolidBg: COLORS.grass10,
    textLowContrast: COLORS.grass11,
    textHighContrast: COLORS.grass12,
  },
  warning: {
    bg: COLORS.amber1,
    bgAlt: COLORS.amber2,
    bgElement: COLORS.amber3,
    bgElementHover: COLORS.amber4,
    bgElementActive: COLORS.amber5,
    border: COLORS.amber6,
    borderElement: COLORS.amber7,
    borderElementHover: COLORS.amber8,
    solidBg: COLORS.amber9,
    hoverSolidBg: COLORS.amber10,
    textLowContrast: COLORS.amber11,
    textHighContrast: COLORS.amber12,
  },
  error: {
    bg: COLORS.tomato1,
    bgAlt: COLORS.tomato2,
    bgElement: COLORS.tomato3,
    bgElementHover: COLORS.tomato4,
    bgElementActive: COLORS.tomato5,
    border: COLORS.tomato6,
    borderElement: COLORS.tomato7,
    borderElementHover: COLORS.tomato8,
    solidBg: COLORS.tomato9,
    hoverSolidBg: COLORS.tomato10,
    textLowContrast: COLORS.tomato11,
    textHighContrast: COLORS.tomato12,
  },
  info: {
    bg: COLORS.blue1,
    bgAlt: COLORS.blue2,
    bgElement: COLORS.blue3,
    bgElementHover: COLORS.blue4,
    bgElementActive: COLORS.blue5,
    border: COLORS.blue6,
    borderElement: COLORS.blue7,
    borderElementHover: COLORS.blue8,
    solidBg: COLORS.blue9,
    hoverSolidBg: COLORS.blue10,
    textLowContrast: COLORS.blue11,
    textHighContrast: COLORS.blue12,
  },
};

export { COLORS, VARIATIONS };

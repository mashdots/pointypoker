import {
  amberDark,
  blueDark,
  grassDark,
  slateDark,
  tomatoDark,
  blackA,
} from '@radix-ui/colors';

import { VariationProperties } from '.';

export interface VariationTypes {
  [key: string]: VariationProperties;
  structure: VariationProperties;
  success: VariationProperties;
  warning: VariationProperties;
  error: VariationProperties;
  info: VariationProperties;
}


const LEGACY_COLORS = {
  ...amberDark,
  ...blueDark,
  ...grassDark,
  ...slateDark,
  ...tomatoDark,
  ...blackA,
};

const VARIATIONS: VariationTypes = {
  transparent: {
    bg: LEGACY_COLORS.blackA1,
    bgAlt: LEGACY_COLORS.blackA2,
    componentBg: LEGACY_COLORS.blackA3,
    componentBgHover: LEGACY_COLORS.blackA4,
    componentBgActive: LEGACY_COLORS.blackA5,
    border: LEGACY_COLORS.blackA6,
    borderElement: LEGACY_COLORS.blackA7,
    borderElementHover: LEGACY_COLORS.blackA8,
    solidBg: LEGACY_COLORS.blackA9,
    solidBgHover: LEGACY_COLORS.blackA10,
    textLow: LEGACY_COLORS.blackA11,
    textHigh: LEGACY_COLORS.blackA12,
  },
  structure: {
    bg: LEGACY_COLORS.slate1,
    bgAlt: LEGACY_COLORS.slate2,
    componentBg: LEGACY_COLORS.slate3,
    componentBgHover: LEGACY_COLORS.slate4,
    componentBgActive: LEGACY_COLORS.slate5,
    border: LEGACY_COLORS.slate6,
    borderElement: LEGACY_COLORS.slate7,
    borderElementHover: LEGACY_COLORS.slate8,
    solidBg: LEGACY_COLORS.slate9,
    solidBgHover: LEGACY_COLORS.slate10,
    textLow: LEGACY_COLORS.slate11,
    textHigh: LEGACY_COLORS.slate12,
  },
  success: {
    bg: LEGACY_COLORS.grass1,
    bgAlt: LEGACY_COLORS.grass2,
    componentBg: LEGACY_COLORS.grass3,
    componentBgHover: LEGACY_COLORS.grass4,
    componentBgActive: LEGACY_COLORS.grass5,
    border: LEGACY_COLORS.grass6,
    borderElement: LEGACY_COLORS.grass7,
    borderElementHover: LEGACY_COLORS.grass8,
    solidBg: LEGACY_COLORS.grass9,
    solidBgHover: LEGACY_COLORS.grass10,
    textLow: LEGACY_COLORS.grass11,
    textHigh: LEGACY_COLORS.grass12,
  },
  warning: {
    bg: LEGACY_COLORS.amber1,
    bgAlt: LEGACY_COLORS.amber2,
    componentBg: LEGACY_COLORS.amber3,
    componentBgHover: LEGACY_COLORS.amber4,
    componentBgActive: LEGACY_COLORS.amber5,
    border: LEGACY_COLORS.amber6,
    borderElement: LEGACY_COLORS.amber7,
    borderElementHover: LEGACY_COLORS.amber8,
    solidBg: LEGACY_COLORS.amber9,
    solidBgHover: LEGACY_COLORS.amber10,
    textLow: LEGACY_COLORS.amber11,
    textHigh: LEGACY_COLORS.amber12,
  },
  error: {
    bg: LEGACY_COLORS.tomato1,
    bgAlt: LEGACY_COLORS.tomato2,
    componentBg: LEGACY_COLORS.tomato3,
    componentBgHover: LEGACY_COLORS.tomato4,
    componentBgActive: LEGACY_COLORS.tomato5,
    border: LEGACY_COLORS.tomato6,
    borderElement: LEGACY_COLORS.tomato7,
    borderElementHover: LEGACY_COLORS.tomato8,
    solidBg: LEGACY_COLORS.tomato9,
    solidBgHover: LEGACY_COLORS.tomato10,
    textLow: LEGACY_COLORS.tomato11,
    textHigh: LEGACY_COLORS.tomato12,
  },
  info: {
    bg: LEGACY_COLORS.blue1,
    bgAlt: LEGACY_COLORS.blue2,
    componentBg: LEGACY_COLORS.blue3,
    componentBgHover: LEGACY_COLORS.blue4,
    componentBgActive: LEGACY_COLORS.blue5,
    border: LEGACY_COLORS.blue6,
    borderElement: LEGACY_COLORS.blue7,
    borderElementHover: LEGACY_COLORS.blue8,
    solidBg: LEGACY_COLORS.blue9,
    solidBgHover: LEGACY_COLORS.blue10,
    textLow: LEGACY_COLORS.blue11,
    textHigh: LEGACY_COLORS.blue12,
  },
};

export { LEGACY_COLORS, VARIATIONS };

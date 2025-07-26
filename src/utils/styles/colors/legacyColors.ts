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
  [ key: string ]: VariationProperties;
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
    accent1: LEGACY_COLORS.blackA1,
    accent2: LEGACY_COLORS.blackA2,
    accent3: LEGACY_COLORS.blackA3,
    accent4: LEGACY_COLORS.blackA4,
    accent5: LEGACY_COLORS.blackA5,
    accent6: LEGACY_COLORS.blackA6,
    accent7: LEGACY_COLORS.blackA7,
    accent8: LEGACY_COLORS.blackA8,
    accent9: LEGACY_COLORS.blackA9,
    accent10: LEGACY_COLORS.blackA10,
    accent11: LEGACY_COLORS.blackA11,
    accent12: LEGACY_COLORS.blackA12,
  },
  structure: {
    accent1: LEGACY_COLORS.slate1,
    accent2: LEGACY_COLORS.slate2,
    accent3: LEGACY_COLORS.slate3,
    accent4: LEGACY_COLORS.slate4,
    accent5: LEGACY_COLORS.slate5,
    accent6: LEGACY_COLORS.slate6,
    accent7: LEGACY_COLORS.slate7,
    accent8: LEGACY_COLORS.slate8,
    accent9: LEGACY_COLORS.slate9,
    accent10: LEGACY_COLORS.slate10,
    accent11: LEGACY_COLORS.slate11,
    accent12: LEGACY_COLORS.slate12,
  },
  success: {
    accent1: LEGACY_COLORS.grass1,
    accent2: LEGACY_COLORS.grass2,
    accent3: LEGACY_COLORS.grass3,
    accent4: LEGACY_COLORS.grass4,
    accent5: LEGACY_COLORS.grass5,
    accent6: LEGACY_COLORS.grass6,
    accent7: LEGACY_COLORS.grass7,
    accent8: LEGACY_COLORS.grass8,
    accent9: LEGACY_COLORS.grass9,
    accent10: LEGACY_COLORS.grass10,
    accent11: LEGACY_COLORS.grass11,
    accent12: LEGACY_COLORS.grass12,
  },
  warning: {
    accent1: LEGACY_COLORS.amber1,
    accent2: LEGACY_COLORS.amber2,
    accent3: LEGACY_COLORS.amber3,
    accent4: LEGACY_COLORS.amber4,
    accent5: LEGACY_COLORS.amber5,
    accent6: LEGACY_COLORS.amber6,
    accent7: LEGACY_COLORS.amber7,
    accent8: LEGACY_COLORS.amber8,
    accent9: LEGACY_COLORS.amber9,
    accent10: LEGACY_COLORS.amber10,
    accent11: LEGACY_COLORS.amber11,
    accent12: LEGACY_COLORS.amber12,
  },
  error: {
    accent1: LEGACY_COLORS.tomato1,
    accent2: LEGACY_COLORS.tomato2,
    accent3: LEGACY_COLORS.tomato3,
    accent4: LEGACY_COLORS.tomato4,
    accent5: LEGACY_COLORS.tomato5,
    accent6: LEGACY_COLORS.tomato6,
    accent7: LEGACY_COLORS.tomato7,
    accent8: LEGACY_COLORS.tomato8,
    accent9: LEGACY_COLORS.tomato9,
    accent10: LEGACY_COLORS.tomato10,
    accent11: LEGACY_COLORS.tomato11,
    accent12: LEGACY_COLORS.tomato12,
  },
  info: {
    accent1: LEGACY_COLORS.blue1,
    accent2: LEGACY_COLORS.blue2,
    accent3: LEGACY_COLORS.blue3,
    accent4: LEGACY_COLORS.blue4,
    accent5: LEGACY_COLORS.blue5,
    accent6: LEGACY_COLORS.blue6,
    accent7: LEGACY_COLORS.blue7,
    accent8: LEGACY_COLORS.blue8,
    accent9: LEGACY_COLORS.blue9,
    accent10: LEGACY_COLORS.blue10,
    accent11: LEGACY_COLORS.blue11,
    accent12: LEGACY_COLORS.blue12,
  },
};

export { LEGACY_COLORS, VARIATIONS };

export type FlagName = typeof flagNames[number];
export type FlagContext = {
  getFeatureFlag: (flag: FlagName) => boolean;
};

const REDESIGN = 'feature-monocard';

export const flagNames = [REDESIGN] as const;

const flags = { REDESIGN };

export default flags;

export type FlagName = typeof flagNames[number];
export type FlagContext = {
  getFeatureFlag: (flag: FlagName) => boolean;
};

export const flagNames = [] as const;

const flags = { };

export default flags;

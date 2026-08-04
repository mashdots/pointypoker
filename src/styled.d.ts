import type { Theme } from '@utils/styles/colors/types';

// Augment styled-components' DefaultTheme so `useTheme()` and every styled
// `({ theme }) => …` callback are typed with the app's theme shape.
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends Theme {}
}

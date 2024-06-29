import { createGlobalStyle, css } from 'styled-components';

import { ThemedProps } from './colors/colorSystem';

const GlobalStyles = createGlobalStyle<ThemedProps>`
  html {
    scroll-behavior: smooth;
    transition: background-color 250ms, color 250ms;
    font-size: 16px;
  }

  #root {
    max-width: 1280px;
    margin: 0 auto;
  }

  body {
    ${({ theme }: ThemedProps) => css`
      background-color: ${ theme.greyscale.bg };
      color: ${ theme.primary.textLow };
    `}
    font-family: 'Nunito Sans', Tahoma, sans-serif;
  }

  h1, input, button {
    ${({ theme }: ThemedProps) => css`
      color: ${ theme.primary.textHigh };
    `}
    font-family: 'Nunito Sans', Tahoma, sans-serif;
  }

  :root {
    --shadow-color: 150deg 8% 0%;
    --shadow-elevation-low:
      0px 0.3px 0.3px hsl(var(--shadow-color) / 0.16),
      0px 0.6px 0.7px -1.2px hsl(var(--shadow-color) / 0.16),
      0px 1.7px 1.9px -2.5px hsl(var(--shadow-color) / 0.16);
    --shadow-elevation-medium:
      0px 0.3px 0.3px hsl(var(--shadow-color) / 0.16),
      0px 1.3px 1.5px -0.8px hsl(var(--shadow-color) / 0.16),
      0px 3.4px 3.8px -1.7px hsl(var(--shadow-color) / 0.16),
      0px 8.4px 9.5px -2.5px hsl(var(--shadow-color) / 0.16);
    --shadow-elevation-high:
      0px 0.3px 0.3px hsl(var(--shadow-color) / 0.15),
      0px 2.8px 3.2px -0.4px hsl(var(--shadow-color) / 0.15),
      0px 5.3px 6px -0.7px hsl(var(--shadow-color) / 0.15),
      0px 8.9px 10px -1.1px hsl(var(--shadow-color) / 0.15),
      0px 14.3px 16.1px -1.4px hsl(var(--shadow-color) / 0.15),
      0px 22.4px 25.2px -1.8px hsl(var(--shadow-color) / 0.15),
      0px 34.2px 38.5px -2.1px hsl(var(--shadow-color) / 0.15),
      0px 50.4px 56.8px -2.5px hsl(var(--shadow-color) / 0.15);
  }
`;

export default GlobalStyles;

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

  h1, h2, h3, h4, h5, input, button {
    ${({ theme }: ThemedProps) => css`
      color: ${ theme.primary.textHigh };
    `}

    font-family: 'Nunito Sans', Tahoma, sans-serif;
    margin: 0;
  }
`;

export default GlobalStyles;

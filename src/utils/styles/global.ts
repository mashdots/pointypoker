import { createGlobalStyle, css } from 'styled-components';

import { ThemedProps } from './colors/colorSystem';

const GlobalStyles = createGlobalStyle<ThemedProps>`
  html {
    scroll-behavior: smooth;
    transition: background-color 250ms, color 250ms;
    font-size: 16px;
  }

  body {
    ${({ theme }: ThemedProps) => css`
      background-color: ${ theme.greyscale.accent1 };
      color: ${ theme.primary.accent11 };
    `}

    font-family: 'Nunito Sans', Tahoma, sans-serif;
  }

  h1, h2, h3, h4, h5, input, button {
    ${({ theme }: ThemedProps) => css`
      color: ${ theme.primary.accent12 };
    `}

    font-family: 'Nunito Sans', Tahoma, sans-serif;
    margin: 0;
  }
`;

export default GlobalStyles;

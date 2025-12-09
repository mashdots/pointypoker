import styled, { css } from 'styled-components';

import { ThemedProps } from '@utils/styles/colors/colorSystem';

export type CardProps = {
  overrideWidth?: number | string;
  overrideHeight?: number | string;
  scroll?: boolean;
} & ThemedProps;

const Card = styled.div<CardProps>`
  ${ ({
    colorTheme,
    scroll,
    theme,
    isNarrow,
    overrideHeight,
    overrideWidth,
  }: CardProps) => {
    const finalTheme = colorTheme ?? 'primary';

    let finalWidth = '90%';
    let finalHeight = '30rem';

    if (!isNarrow && overrideWidth) {
      finalWidth = typeof overrideWidth === 'string' ? overrideWidth : `${overrideWidth}rem`;
    }

    if (overrideHeight) {
      finalHeight = typeof overrideHeight === 'string' ? overrideHeight : `${overrideHeight}rem`;
    }

    return css`
      background-color: ${ theme[finalTheme].accent3 };
      border-color: ${ theme[finalTheme].accent6 };
      overflow: ${ scroll ? 'auto' : 'hidden' };
      width: ${ finalWidth };
      height: ${ finalHeight };
    `;
  }};

  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.5);
  border-width: 1px;
  border-style: solid;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-radius: 1rem;
  transition: all 300ms ease-out;
`;

export default Card;

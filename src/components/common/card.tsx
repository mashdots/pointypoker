import React from 'react';
import styled, { css } from 'styled-components';

import { Theme, ThemedProps } from '@utils/styles/colors/colorSystem';
import { NarrowProps } from '@utils/hooks/mobile';


type CardProps = {
  overrideWidth?: string,
  overrideHeight?: string,
  scroll?: boolean,
  colorTheme?: keyof Theme,
} & NarrowProps & React.HTMLAttributes<HTMLDivElement>;

const CardWrapper = styled.div<CardProps>`
  ${ ({ scroll, theme, colorTheme = 'primary' }: CardProps & ThemedProps) => css`
    background-color: ${ theme[colorTheme].accent4 };
    border-color: ${ theme[colorTheme].accent7 };
    overflow: ${ scroll ? 'auto' : 'hidden' };
    box-shadow: 0 0.25rem 0.5rem ${ theme[colorTheme].accent1 };
  `};

  ${ ({ overrideWidth, isNarrow }: CardProps) => !isNarrow && overrideWidth && css`
    width: ${ overrideWidth } !important;
  `}

  ${ ({ overrideHeight }: CardProps) => overrideHeight && css`
    height: ${ overrideHeight };
  `}

  border-width: 1px;
  border-style: solid;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-radius: 1rem;
  width: 90%;
  transition: all 300ms ease-out;
`;

const Card = ({ children, overrideWidth, overrideHeight, scroll, isNarrow, colorTheme }: CardProps) => {
  return (
    <CardWrapper
      overrideWidth={overrideWidth}
      overrideHeight={overrideHeight}
      scroll={scroll}
      isNarrow={isNarrow}
      colorTheme={colorTheme}
    >
      {children}
    </CardWrapper>
  );
};

export default Card;

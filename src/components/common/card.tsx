import React, { useRef } from 'react';
import styled, { css } from 'styled-components';

import { Theme, ThemedProps } from '@utils/styles/colors/colorSystem';
import { NarrowProps } from '@utils/hooks/mobile';


type CardProps = {
  overrideWidth?: string,
  overrideHeight?: string,
  scroll?: boolean,
  colorTheme?: keyof Theme,
  direction?: 'row' | 'column',
  align?: 'center' | 'left' | 'right' | 'flex-start' | 'flex-end',
  vAlign?: 'center' | 'left' | 'right' | 'flex-start' | 'flex-end',
} & Partial<NarrowProps> & React.HTMLAttributes<HTMLDivElement>;

const Wrapper = styled.div<CardProps>`
  ${ ({ scroll, theme, colorTheme = 'primary' }: CardProps & ThemedProps) => css`
    background-color: ${ theme[colorTheme].accent4 };
    border-color: ${ theme[colorTheme].accent7 };
    overflow: ${ scroll ? 'auto' : 'hidden' };
    box-shadow: 0 0.25rem 0.5rem ${ theme[colorTheme].accent1 };
  `};

  ${({ align, direction, vAlign }: CardProps) => css`
    flex-direction: ${ direction || 'column' };
    
    ${direction === 'row' ? css`
      justify-content: ${ align };
      align-items: ${ vAlign };
    ` : css`
      justify-content: ${ vAlign };
      align-items: ${ align };
    `}
  `}

  ${ ({ overrideWidth, isNarrow }: CardProps) => !isNarrow && overrideWidth && css`
    width: ${ overrideWidth } !important;
  `}

  ${ ({ overrideHeight }: CardProps) => overrideHeight && css`
    height: ${ overrideHeight };
  `}

  border-width: 1px;
  border-style: solid;
  display: flex;
  justify-content: flex-start;
  border-radius: 1rem;
  width: 90%;
  transition: all 300ms ease-out;
`;

const convertAlignmentToFlex = (alignment: CardProps['align']) => {
  switch (alignment) {
  case 'center':
    return 'center';
  case 'right':
    return 'flex-end';
  default:
    return 'flex-start';
  }
};

const Card = ({
  children,
  colorTheme,
  direction,
  isNarrow,
  overrideHeight,
  overrideWidth,
  scroll,
  align,
  vAlign,
  ...rest
}: CardProps) => {
  const finalAlign = convertAlignmentToFlex(align);
  const finalVAlign = convertAlignmentToFlex(vAlign);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Wrapper
      ref={ref}
      overrideWidth={overrideWidth}
      overrideHeight={overrideHeight}
      scroll={scroll}
      isNarrow={isNarrow}
      colorTheme={colorTheme}
      direction={direction}
      align={finalAlign}
      vAlign={finalVAlign}
      className='card'
      {...rest}
    >
      {children}
    </Wrapper>
  );
};

export default Card;
// ohheyiloveyousomuchmydude

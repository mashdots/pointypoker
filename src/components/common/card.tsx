import styled, { css } from 'styled-components';

import { ThemedProps } from '@utils/styles/colors/colorSystem';

export type CardProps = {
  overrideWidth?: number;
  overrideHeight?: number;
  scroll?: boolean;
} & ThemedProps;

const Card = styled.div<CardProps>`
  ${ ({ scroll, theme }: CardProps) => css`
    background-color: ${ theme.primary.accent3 };
    border-color: ${ theme.primary.accent6 };
    overflow: ${ scroll ? 'auto' : 'hidden' };
  `};

  ${ ({ overrideWidth, isNarrow }: CardProps) => !isNarrow && overrideWidth && css`
    width: ${ overrideWidth }rem !important;
  `}

  ${ ({ overrideHeight }: CardProps) => overrideHeight && css`
    height: ${ overrideHeight }rem !important;
  `}

  border-width: 1px;
  border-style: solid;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-radius: 1rem;
  width: 90%;
  height: 30rem;
  transition: all 300ms ease-out;
`;

export default Card;

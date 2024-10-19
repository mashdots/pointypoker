import React from 'react';
import styled, { css } from 'styled-components';

import { NarrowProps, useMobile } from '@utils/hooks/mobile';
import { ThemedProps } from '@utils/styles/colors/colorSystem';

type Props = {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  isActive: boolean;
}

type WrapperProps = {
  isActive: boolean;
} & ThemedProps & NarrowProps;

export type GenericPrefCardProps = Pick<Props, 'onClick' | 'isActive'>;

const Wrapper = styled.li<WrapperProps>`
  ${({ isActive, theme }: WrapperProps) => isActive && css`
    background-color: ${theme.primary.accent5};
  `}

  ${({ isNarrow }) => isNarrow
    ? css`
      margin-right: 0.5rem;
      flex: 1;
    ` : css`
      margin-bottom: 0.5rem;
    `}

  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;

  border-radius: 0.5rem;
  transition: background-color 300ms;

  &:hover {
    ${({ isActive, theme }: WrapperProps) => !isActive && css`
      background-color: ${theme.greyscale.accent4};
    `}
  }
`;

const Title = styled.p`
  margin: 0;
`;

const CategoryCard = ({ icon, title, onClick, isActive }: Props) => (
  <Wrapper
    aria-label={title}
    isActive={isActive}
    onClick={onClick}
    isNarrow={useMobile().isNarrow}
  >
    {icon}
    <Title>{title}</Title>
  </Wrapper>
);

export default CategoryCard;

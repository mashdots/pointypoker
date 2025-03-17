import React from 'react';
import styled, { css } from 'styled-components';

import { ThemedProps } from '@utils/styles/colors/colorSystem';

export type Props = {
  icon: JSX.Element;
  ignoreIconColor?: boolean;
  isActive: boolean;
  label: string;
  onClick: () => void;
}

type ContainerProps = Pick<Props, 'ignoreIconColor' | 'isActive'> & ThemedProps;

const Container = styled.div<ContainerProps>`
  ${({ ignoreIconColor, isActive, theme }: ContainerProps) => css`
    color: ${theme.greyscale.accent10};

    path {
      ${!ignoreIconColor && css`
        fill: ${ theme.greyscale.accent10 };
      `}
      transition: all 300ms ease-out;
    }

    :hover {
      background-color: ${theme.greyscale.accent4};

      color: ${theme.greyscale.accent12 };

      path {
        ${!ignoreIconColor && css`
          fill: ${ theme.greyscale.accent12 };
        `}
      }
    }

    ${isActive && css`
      color: ${theme.primary.accent11};

      path {
        ${!ignoreIconColor && css`
          fill: ${ theme.primary.accent11 };
        `}
      }
    `}
  `}

  align-items: center;
  border-radius: 0.75rem;
  cursor: pointer;
  display: flex;
  padding: 0.5rem 1rem;
  overflow-x: hidden;
  transition: all 300ms ease-out;
`;

const IconWrapper = styled.span`
  svg {
    width: 1.5rem;
    margin-right: 1rem;
  }

  display: flex;
`;

const LabelContainer = styled.span`
  display: flex;
  white-space: nowrap;
`;

const ToolbarItem = ({ icon, label, onClick, isActive, ignoreIconColor = false }: Props) => {
  return (
    <Container title={label} onClick={onClick} isActive={isActive} ignoreIconColor={ignoreIconColor}>
      <IconWrapper>{icon}</IconWrapper>
      <LabelContainer>{label}</LabelContainer>
    </Container>
  );
};

export default ToolbarItem;

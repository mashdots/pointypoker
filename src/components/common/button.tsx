import React, { HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

import { ThemedProps } from '../../utils/styles/colors/colorSystem';
import { getWidth } from '../../utils/styles';

type Props = {
  children: any;
  isDisabled?: boolean;
  onClick?: (arg?: any) => void;
  type?: 'button' | 'submit' | 'reset' | undefined;
  width?: 'quarter' | 'third' | 'half' | 'full' | number;
  textSize?: 'small' | 'medium' | 'large';
  variation?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  noMargin?: boolean;
  buttonRef?: React.RefObject<HTMLButtonElement>;
} & HTMLAttributes<HTMLButtonElement>;

type WrapperProps = ThemedProps & {
  configuredWidth: string;
  isDisabled?: boolean;
  textSize: number;
  variation: 'primary' | 'success' | 'warning' | 'error' | 'info';
  noMargin?: boolean;
}

const StyledButton = styled.button<WrapperProps>`
  ${({ configuredWidth, isDisabled, noMargin, textSize, theme, variation }: WrapperProps) => css`
    background-color: ${theme[isDisabled ? 'greyscale' : variation].componentBg};
    border-bottom-color: ${theme[isDisabled ? 'greyscale' : variation].borderElement} !important;
    border-bottom-width: ${isDisabled ? 0 : 2}px !important;
    color: ${theme[ isDisabled ? 'greyscale' : variation ].textLow };
    cursor: ${isDisabled ? 'not-allowed' : 'pointer' };
    font-size: ${textSize}rem;
    margin-top: ${noMargin ? 0 : 1}rem;
    width: ${configuredWidth};
  `}

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  padding: 0.5rem 1.75rem;

  border: none;
  border-bottom-style: solid;
  border-radius: 1rem;

  transition: all 250ms ease-out;

  :hover {
    ${ ({ isDisabled, noMargin, theme, variation }: WrapperProps) => !isDisabled && css`
      color: ${theme[variation].textHigh};
      background-color: ${ theme[variation].componentBgHover };
      border-bottom-color: ${theme[ isDisabled ? 'greyscale' : variation ].borderElementHover} !important;
      border-bottom-width: 4px !important;
      margin-top: calc(${noMargin ? 0 : 1}rem - 2px);
    `}
  }
  
  :active {
    ${ ({ isDisabled, noMargin, theme, variation }: WrapperProps) => !isDisabled && css`
      background-color: ${ theme[variation].componentBgActive };
      border-bottom-width: 1px;
      margin-top: calc(${noMargin ? 0 : 1}rem + 1px);
    `}
  }
`;

const Button = ({
  children,
  isDisabled,
  onClick,
  width,
  textSize = 'medium',
  variation = 'primary',
  buttonRef,
  ...rest
}: Props) => {
  const widthValue = getWidth(width);
  let buttonFontSize: number;

  switch (textSize) {
  case 'small':
    buttonFontSize = 1;
    break;
  case 'large':
    buttonFontSize = 3;
    break;
  case 'medium':
  default:
    buttonFontSize = 2;
  }

  return (
    <StyledButton
      ref={buttonRef}
      configuredWidth={widthValue}
      disabled={isDisabled}
      isDisabled={isDisabled}
      onClick={onClick}
      textSize={buttonFontSize}
      variation={variation}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};

export default Button;

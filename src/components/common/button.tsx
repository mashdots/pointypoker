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
} & HTMLAttributes<HTMLButtonElement>;

type WrapperProps = ThemedProps & {
  configuredWidth: string;
  isDisabled?: boolean;
  textSize: number;
}

const StyledButton = styled.button<WrapperProps>`
  ${({ configuredWidth, isDisabled, textSize, theme }) => css`
    color: ${theme[isDisabled ? 'greyScale' : 'primary'].textLowContrast };
    background-color: ${theme[isDisabled ? 'greyScale' : 'primary'].bgElement};
    border-bottom-color: ${theme[isDisabled ? 'greyScale' : 'primary'].border};
    cursor: ${isDisabled ? 'not-allowed' : 'pointer' };
    font-size: ${textSize}rem;
    width: ${configuredWidth};
  `}

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  padding: 0.5rem 1.75rem;
  margin-top: 1rem;

  border: none;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-radius: 1rem;

  transition: all 250ms ease-out;

  :hover {
    border-bottom-width: 4px;
    margin-top: calc(1rem - 2px);

    ${ ({ isDisabled, theme }) => !isDisabled && css`
      color: ${theme.primary.textHighContrast};
      background-color: ${ theme.primary.bgElementHover };
    `}
  }
  
  :active {
    border-bottom-width: 1px;
    margin-top: calc(1rem + 1px);

    ${ ({ isDisabled, theme }) => !isDisabled && css`
      background-color: ${ theme.primary.bgElementActive };
    `}
  }
`;

const Button = ({
  children,
  isDisabled,
  onClick,
  width,
  textSize = 'medium',
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
      configuredWidth={widthValue}
      disabled={isDisabled}
      isDisabled={isDisabled}
      onClick={onClick}
      textSize={buttonFontSize}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};

export default Button;

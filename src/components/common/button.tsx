import React, { HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

import { getMargin, getWidth, VARIATIONS } from '../../utils/styles';
import { VariationProperties } from '../../utils/styles/colors';
import { VariationTypes } from '../../utils/styles/colors/legacyColors';

type Props = {
  children: any;
  isDisabled?: boolean;
  margin?: 'left' | 'right' | 'center';
  onClick?: (arg: any | undefined) => void;
  type?: 'button' | 'submit' | 'reset' | undefined;
  variation: keyof VariationTypes;
  width?: 'quarter' | 'third' | 'half' | 'full' | number;
  textSize?: 'small' | 'medium' | 'large';
} & HTMLAttributes<HTMLButtonElement>;

type WrapperProps = {
  activeBackgroundColor: string;
  activeTextColor: string;
  configuredMargin?: string;
  configuredWidth: string;
  configuredColor: keyof VariationTypes;
  isDisabled?: boolean;
  textSize: number;
}

const StyledButton = styled.button<WrapperProps>`
  color: ${ VARIATIONS.structure.textLowContrast };
  background-color: ${ VARIATIONS.transparent.bgElement };
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  padding: 16px 32px;

  border: none;
  border-radius: 16px;

  outline-offset: -2px;
  outline-width: 2px;
  outline-style: solid;

  ${({ textSize }) => css`
    font-size: ${textSize}rem;
  `}

  transition: 
    background-color 300ms,
    color 300ms,
    transform 200ms;

  ${({ activeBackgroundColor, configuredColor, configuredMargin, configuredWidth }) => css`
    outline-color: ${VARIATIONS[configuredColor][activeBackgroundColor] };
    margin: ${configuredMargin};
    width: ${configuredWidth };
  `}

  :hover {
    ${ ({ activeBackgroundColor, activeTextColor, configuredColor }) => css`
      background-color: ${VARIATIONS[configuredColor][activeBackgroundColor] };
      color: ${ VARIATIONS[configuredColor][activeTextColor] };
    `}
  }
  
  :active {
    transform: scale(0.95);
  }
`;

const Button = ({
  children,
  isDisabled,
  margin,
  onClick,
  variation,
  width,
  textSize = 'medium',
  ...rest
}: Props) => {
  const marginValues = getMargin(margin);
  const widthValue = getWidth(width);
  let activeBackgroundColor: keyof VariationProperties = 'bgElementActive';
  let activeTextColor: keyof VariationProperties = 'textHighContrast';
  let colorProfile: keyof VariationTypes = VARIATIONS[variation] ? variation : 'primary';
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

  if (isDisabled) {
    activeBackgroundColor = 'bgElement';
    activeTextColor = 'textLowContrast';
    colorProfile = 'structure';
  }

  return (
    <StyledButton
      activeBackgroundColor={activeBackgroundColor}
      activeTextColor={activeTextColor}
      configuredColor={colorProfile}
      configuredMargin={marginValues}
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

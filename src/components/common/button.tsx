import React from 'react';
import styled, { css } from 'styled-components';

import { getMargin, getWidth, VARIATIONS } from '../../utils/styles';
import { VariationProperties, VariationTypes } from '../../utils/styles/colors';

type Props = {
  children: string;
  isDisabled?: boolean;
  margin?: 'left' | 'right' | 'center';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset' | undefined;
  variation: keyof VariationTypes;
  width?: 'quarter' | 'third' | 'half' | 'full' | number;
}

type WrapperProps = {
  activeBackgroundColor: string;
  activeTextColor: string;
  configuredMargin?: string;
  configuredWidth: string;
  configuredColor: keyof VariationTypes;
  isDisabled?: boolean;
}

const StyledButton = styled.button<WrapperProps>`
  color: ${ VARIATIONS.structure.textLowContrast };
  background-color: ${ VARIATIONS.transparent.bgElement };
  cursor: pointer;

  padding: 16px 32px;

  border: none;
  border-radius: 8px;

  outline-offset: -4px;
  outline-width: 4px;
  outline-style: solid;

  font-size: 24px;

  transition: 
    background-color 300ms,
    color 300ms,
    transform 200ms;

  ${({ activeBackgroundColor, configuredColor, configuredMargin, configuredWidth }) => css`
    outline-color: ${VARIATIONS[ configuredColor ][ activeBackgroundColor ] };
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
}: Props) => {
  const marginValues = getMargin(margin);
  const widthValue = getWidth(width);
  let activeBackgroundColor: keyof VariationProperties = 'bgElementActive';
  let activeTextColor: keyof VariationProperties = 'textHighContrast';
  let colorProfile: keyof VariationTypes = VARIATIONS[ variation ] ? variation : 'primary';

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
      isDisabled={isDisabled}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
};

export default Button;

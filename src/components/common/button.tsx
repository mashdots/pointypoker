import React, { ButtonHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

import { Theme, ThemedProps } from '@utils/styles/colors/colorSystem';
import { getWidth } from '@utils/styles';

type Props = {
  type?: 'button' | 'submit' | 'reset' | undefined;
  width?: 'quarter' | 'third' | 'half' | 'full' | number;
  textSize?: 'small' | 'medium' | 'large';
  variation?: keyof Theme;
  noMargin?: boolean;
  round?: boolean;
  refresh?: boolean; // Temporary to use new design
  buttonRef?: React.RefObject<HTMLButtonElement>;
  loading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

type WrapperProps = ThemedProps & {
  configuredWidth?: string;
  textSize: number;
  variation: keyof Theme;
  noMargin?: boolean;
  round?: boolean;
  isLoading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>

const StyledButton = styled.button`
  ${({ disabled, noMargin, round, textSize, theme, variation }: WrapperProps) => css`
    background-color: ${theme[disabled ? 'greyscale' : variation].accent3};
    border-bottom-color: ${theme[disabled ? 'greyscale' : variation].accent7} !important;
    border-bottom-width: ${disabled ? 0 : 2}px !important;
    color: ${theme[ disabled ? 'greyscale' : variation ].accent11 };
    cursor: ${disabled ? 'not-allowed' : 'pointer' };
    font-size: ${textSize}rem;
    margin-top: ${noMargin ? 0 : 1}rem;
    border-radius: ${round ? 500 : 1}rem;
  `}

  ${({ configuredWidth }: WrapperProps) => configuredWidth && css`
    width: ${configuredWidth};
  `}

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  padding: 0.5rem 1.75rem;

  border: none;
  border-bottom-style: solid;

  transition: all 250ms ease-out;

  :hover {
    ${ ({ disabled, noMargin, theme, variation }: WrapperProps) => !disabled && css`
      color: ${theme[variation].accent12};
      background-color: ${ theme[variation].accent4 };
      border-bottom-color: ${theme[ disabled ? 'greyscale' : variation ].accent8} !important;
      border-bottom-width: 4px !important;
      margin-top: calc(${noMargin ? 0 : 1}rem - 2px);
    `}
  }
  
  :active {
    ${ ({ disabled, noMargin, theme, variation }: WrapperProps) => !disabled && css`
      background-color: ${ theme[variation].accent5 };
      border-bottom-width: 1px;
      margin-top: calc(${noMargin ? 0 : 1}rem + 1px);
    `}
  }
`;

const SkeuButton = styled.button`
  ${({ round, textSize, theme, variation, isLoading }: WrapperProps) => css`
    background-color: ${theme[isLoading ? 'greyscale' : variation].accent7};
    border-radius: ${round ? 500 : 0.5}rem;
    border-color: ${theme[ isLoading ? 'greyscale' : variation].accent8} !important;
    box-shadow: 0 0.125rem 0.25rem ${theme.primary.accent1};
    font-size: ${textSize}rem;
    padding: 0.5rem ${round ? 0.5 : 1.75}rem;


    ${({ configuredWidth }: WrapperProps) => configuredWidth && css`
      width: ${ configuredWidth };
    `}


    :disabled {
      cursor: not-allowed;
      background-color: ${theme.greyscale.accent8} !important;
      border-color: ${ theme.greyscale.accent8} !important;
      box-shadow: 0 0 0.125rem ${theme.greyscale.accent2};
    }

    :hover:not(:disabled) {
      background-color: ${theme[variation].accent8} !important;
      border-color: ${theme[variation].accent9} !important;
    }

    transition: all 250ms ease-out;
  `}

  appearance: button;
  cursor: pointer;
  display: flex;
  border-width: 1px;
  border-style: solid;
`;

const Button = ({
  children,
  disabled,
  onClick,
  width,
  textSize = 'medium',
  variation = 'primary',
  buttonRef,
  round = false,
  refresh = false,
  loading = false,
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

  if (!refresh) {
    return (
      <StyledButton
        ref={buttonRef}
        configuredWidth={widthValue}
        disabled={disabled}
        onClick={onClick}
        textSize={buttonFontSize}
        variation={variation}
        round={round}
        {...rest}
      >
        {children}
      </StyledButton>
    );
  }

  return (
    <SkeuButton
      disabled={disabled || loading}
      onClick={onClick}
      ref={buttonRef}
      round={round}
      variation={variation}
      textSize={buttonFontSize}
      configuredWidth={widthValue}
      isLoading={loading}
      {...rest}
    >
      {children}
    </SkeuButton>
  );
};

export default Button;

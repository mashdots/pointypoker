import React from 'react';
import styled, { css } from 'styled-components';

import { ThemedProps } from '@utils/styles/colors/colorSystem';

type Props = {
  alignment?: 'left' | 'center' | 'right';
  id: string;
  icon?: React.ReactNode;
  inputRef?: React.RefObject<HTMLInputElement>;
  isLoading?: boolean;
  onBlur?: () => void;
  onChange: (arg: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  placeHolder?: string;
  value: string;
  size?: 'small' | 'medium' | 'large';
}

type InputProps = ThemedProps & {
  align: string;
  isLoading: boolean;
  size: number;
}

const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 1rem;
`;

const StyledInput = styled.input<InputProps>`
  ${({ align, size, theme }) => css`
    background-color: ${ theme.primary.border };
    border-color: ${ theme.primary.border};
    color: ${ theme.primary.textLow };
    text-align: ${align};
    font-size: ${size}rem;
  `}

  padding: 0.5rem 1rem;
  margin-bottom: 2px;
  width: 100%;

  /* These prevent the awful highlight around the text input */
  outline-width: 0px;
  outline-style: solid;
  border-width: 2px;
  border-style: solid;
  border-radius: 0.5rem;

  transition: all 200ms;

  :hover {
    ${({ theme }) => css`
      background-color: ${ theme.primary.componentBgHover };
    `}
  }
  
  :focus {
    ${({ theme }) => css`
      color: ${theme.primary.textHigh };
      background-color: ${theme.primary.componentBgActive };
      border-color: ${theme.primary.textHigh };
    `}
  }
`;


const TextInput = ({
  alignment,
  icon,
  inputRef,
  onChange,
  value,
  placeHolder,
  onFocus,
  onBlur,
  size,
}: Props) => {
  let inputAlign;
  let inputSize;

  switch (alignment) {
  case 'center':
    inputAlign = 'center';
    break;
  case 'right':
    inputAlign = 'end';
    break;
  case 'left':
  default:
    inputAlign = 'start';
    break;
  }

  switch (size) {
  case 'small':
    inputSize = 1;
    break;
  case 'large':
    inputSize = 2;
    break;
  case 'medium':
  default:
    inputSize = 1.5;
    break;
  }

  return (
    <InputWrapper>
      {icon}
      <StyledInput
        data-1pignore="true"
        autoComplete='off'
        ref={inputRef}
        type='text'
        align={inputAlign}
        placeholder={placeHolder}
        value={value ?? ''}
        onChange={onChange}
        onFocus={() => {
          onFocus?.();
        }}
        onBlur={() => {
          onBlur?.();
        }}
        isLoading={false}
        size={inputSize}
      />
    </InputWrapper>
  );
};

export default TextInput;

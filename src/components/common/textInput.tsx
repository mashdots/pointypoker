import React from 'react';

import styled, { css } from 'styled-components';

import { ThemedProps } from '@utils/styles/colors/colorSystem';

type Props = {
  alignment?: 'left' | 'center' | 'right';
  disabled?: boolean;
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
  collapse?: boolean;
};

type InputProps = ThemedProps & {
  align: string;
  isLoading: boolean;
  size: number;
};

const InputWrapper = styled.div<{ noPadding: boolean }>`
  ${({ noPadding }) => css`
    padding: ${noPadding ? '0' : '1rem'};
  `}

  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  flex: 1;
`;

const StyledInput = styled.input<InputProps>`
  ${({
    align,
    size,
    theme,
  }: InputProps & ThemedProps) => css`
    background-color: ${ theme.primary.accent2 };
    border-color: ${ theme.primary.accent6};
    color: ${ theme.primary.accent11 };
    text-align: ${align};
    font-size: ${size}rem;
    box-shadow: inset 0 0 0.5rem ${ theme.primary.accent1 };
  `}

  padding: 0.5rem 1rem;
  width: 100%;

  /* These prevent the awful highlight around the text input */
  outline-width: 0px;
  outline-style: solid;
  border-width: 1px;
  border-style: solid;
  border-radius: 0.75rem;

  transition: all 200ms;

  :hover {
    ${({ theme }: ThemedProps) => css`
      border-color: ${theme.primary.accent8 };
    `}
  }
  
  :focus {
    ${({ theme }: ThemedProps) => css`
      color: ${theme.primary.accent12 };
      border-color: ${theme.primary.accent7 };
    `}
  }
`;


const TextInput = ({
  alignment,
  disabled = false,
  icon,
  inputRef,
  onChange,
  value,
  placeHolder,
  onFocus,
  onBlur,
  size,
  collapse = false,
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
    <InputWrapper noPadding={collapse}>
      {icon}
      <StyledInput
        data-1pignore="true"
        autoComplete='off'
        disabled={disabled}
        ref={inputRef}
        type='text'
        align={inputAlign}
        placeholder={placeHolder}
        defaultValue={value ?? ''}
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

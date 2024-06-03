import React from 'react';
import styled, { css } from 'styled-components';

import { Theme } from '../../utils/styles/colors/colorSystem';

type Props = {
  alignment?: 'left' | 'center' | 'right';
  id: string;
  icon?: React.ReactNode;
  inputRef?: React.RefObject<HTMLInputElement>;
  isLoading?: boolean;
  onBlur?: () => void;
  onChange: (arg: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  placeHolder: string;
  value: string;
}

type InputProps = {
  align: string;
  isLoading: boolean;
  theme: Theme;
}

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 1rem;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

const StyledInput = styled.input<InputProps>`
  ${({ align, theme }) => css`
    background-color: ${ theme.primary.bgAlt };
    border-color: ${ theme.primary.border};
    color: ${ theme.primary.textLowContrast };
    text-align: ${align};
  `}

  padding: 4px;
  margin-bottom: 2px;
  font-size: 1.5rem;
  width: 100%;

  /* These prevent the awful highlight around the text input */
  outline-width: 0px;
  outline-style: solid;
  border-width: 2px;
  border-style: solid;
  border-radius: 8px;

  transition: all 200ms;

  :hover {
    ${({ theme }) => css`
      background-color: ${ theme.primary.bgElementHover };
    `}
  }
  
  :focus {
    ${({ theme }) => css`
      color: ${theme.primary.textHighContrast };
      background-color: ${theme.primary.bgElementActive };
      border-color: ${theme.primary.textHighContrast };
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
}: Props) => {
  let inputAlign;

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

  return (
    <FormWrapper>
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
        />
      </InputWrapper>
    </FormWrapper>
  );
};

export default TextInput;

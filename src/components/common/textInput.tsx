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
  ${({ theme }: { theme: Theme }) => css`
    background-color: ${ theme.primary.bgElement };
    color: ${ theme.primary.textLowContrast };
    border-bottom-color: ${ theme.primary.textHighContrast};
  `}

  border: none;
  padding: 4px;
  text-align: ${({ align }) => align};
  font-size: 1.5rem;
  width: 100%;

  /* These prevent the awful highlight around the text input */
  outline-width: 0px;
  outline-style: solid;
  margin-bottom: 2px;
  border-radius: 8px;
  border-bottom-style: solid;
  border-bottom-width: 0px;

  transition: all 200ms;

  :hover {
    ${({ theme }: { theme: Theme }) => css`
      background-color: ${ theme.primary.bgElementHover };
    `}
  }
  
  :focus {
    border-bottom-width: 2px;
    margin-top: -4px;
    padding-top: 6px;
    
    ${({ theme }: { theme: Theme }) => css`
      color: ${theme.primary.textHighContrast };
      background-color: ${theme.primary.bgElementActive };
      outline-color: ${theme.primary.textHighContrast };
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

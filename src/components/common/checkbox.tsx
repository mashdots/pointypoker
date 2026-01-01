import React from 'react';

import styled, { css } from 'styled-components';

import { scaleEntrance } from '@components/common/animations';
import { ThemedProps } from '@utils/styles/colors/types';

type Props = {
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const StyledCheckBox = styled.input`
  ${({ theme }: ThemedProps) => css`
    background-color: ${theme.primary.accent3};
    border: 1px solid ${theme.primary.accent6};
    border-radius: 0.25rem;
    cursor: pointer;
    margin-right: 1rem;
    position: relative;
    transition: background-color 300ms ease-out;


    &:checked {
      background-color: ${theme.primary.accent9};
    }

    &:checked:after {
      content: '✔';
      position: absolute;
      top: 0.125rem;
      left: 0.375rem;
      right: 0.375rem;
      bottom: 0.125rem;
      border-radius: 0.25rem;
      animation: ${scaleEntrance} 300ms ease-out;
    }
  `}

  -webkit-appearance: none;
  appearance: none;

  width: 1.5rem;
  height: 1.5rem;
`;

const CheckBox = ({
  id,
  checked,
  onChange,
  label,
}: Props) => (
  <Wrapper>
    <StyledCheckBox type='checkbox' id={id}
      checked={checked} onChange={onChange} />
    <label>
      {label}
    </label>
  </Wrapper>
);


export default CheckBox;

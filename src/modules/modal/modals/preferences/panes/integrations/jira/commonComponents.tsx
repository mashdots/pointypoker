import styled, { css } from 'styled-components';

import PlusIcon from '@assets/icons/plus.svg?react';
import { ThemedProps } from '@utils/styles/colors/colorSystem';


const Control = styled.span`
  display: flex;
  align-items: center;
`;

const SetupPrefWrapper = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: flex;
`;

const Description = styled.span`
  ${({ theme }: ThemedProps) => css`
    color: ${ theme.greyscale.accent11 };
  `}

  display: flex;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
`;

const CloseIcon = styled(PlusIcon)`
  cursor: pointer;
  height: 1.5rem;
  width: 1.5rem;
  margin-left: 0.25rem;
  transform: rotate(45deg);
  
  > line {
    transition: stroke 300ms;
    stroke: ${ ({ theme }: ThemedProps) => theme.primary.accent11 };
  }
`;

const SelectedOptionWrapper = styled.div`
  ${ ({ theme }: ThemedProps) => css`
    background-color: ${ theme.greyscale.accent2 };
    color: ${ theme.primary.accent12 };
  `}

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0;
  width: 100%;
  border-radius: 0.5rem;
`;

export {
  CloseIcon,
  Control,
  Description,
  Label,
  SelectedOptionWrapper,
  SetupPrefWrapper,
};

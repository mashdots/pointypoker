import React from 'react';
import styled from 'styled-components';

import { VARIATIONS } from '../../utils/styles';

type Props = {
  id: string;
  onChange: (arg: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

const StyledInput = styled.input`
  background-color: ${VARIATIONS.structure.bg};
  color: ${VARIATIONS.structure.textLowContrast};

  border: none;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  font-size: 24px;

  outline-offset: -4px;
  outline-width: 4px;
  outline-color: ${VARIATIONS.structure.bgElementHover};
  outline-style: solid;

  transition: all 300ms;

  :focus {
    color: ${VARIATIONS.structure.textHighContrast};
    filter: drop-shadow(0 0 2em ${VARIATIONS.structure.bgElementHover});
    outline-offset: 0px;
    outline-width: 0px;
  }
`;

const NameInput = (props: Props) => {
  return <StyledInput data-1pignore="true" autoComplete='off' {...props} />;
};

export default NameInput;

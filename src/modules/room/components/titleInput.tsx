import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { VARIATIONS } from '../../../utils/styles';

type Props = {
  updatedIssueTitle: string;
  handleUpdate: (title: string) => void;
}

const StyledInput = styled.input`
  background-color: ${ VARIATIONS.structure.bg };
  color: ${ VARIATIONS.structure.textLowContrast };

  border: none;
  border-radius: 8px;
  padding: 16px;
  margin-top: 64px;
  text-align: center;
  font-size: 2rem;
  width: 80%;

  outline-offset: -4px;
  outline-width: 4px;
  outline-color: ${ VARIATIONS.structure.bgElementHover };
  outline-style: solid;

  transition: all 300ms;

  :focus {
    color: ${ VARIATIONS.structure.textHighContrast };
    filter: drop-shadow(0 0 2em ${ VARIATIONS.structure.bgElementHover });
    outline-offset: 0px;
    outline-width: 0px;
  }
`;

let timeout: NodeJS.Timeout;

const TitleInput = ({
  updatedIssueTitle,
  handleUpdate,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [ value, setValue ] = useState(updatedIssueTitle);

  useEffect(() => {
    if (updatedIssueTitle !== value) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        console.log('Updating title in database', value);
      }, 1000);
    }
  }, [ value, updatedIssueTitle ]);

  useEffect(() => {
    setValue(updatedIssueTitle);
  }, [ updatedIssueTitle ]);

  return (
    <StyledInput
      ref={inputRef}
      type='text'
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default TitleInput;

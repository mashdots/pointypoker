import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { VARIATIONS } from '../../../utils/styles';
import { useTickets } from '../hooks';


type InputProps = {
  isLoading: boolean;
}

/**
 * TO DO:
 * - Add a loading indication with success and failure states
 * - When the input has updated for other participants, animate to indicate an update
 * - When not focused, make the border the shadowy-expanded type
 * - When focused, bring it into an outline
 */

const StyledInput = styled.input<InputProps>`
  background-color: ${ VARIATIONS.structure.bg };
  color: ${ VARIATIONS.structure.textLowContrast };

  border: none;
  border-radius: 16px;
  padding: 1rem;
  margin-top: 1rem;
  text-align: left;
  font-size: 1.5rem;
  width: 100%;

  outline-offset: -2px;
  outline-width: 2px;
  outline-color: ${ VARIATIONS.structure.bgElementHover };
  outline-style: solid;

  transition: all 300ms;

  :focus {
    filter: drop-shadow(0 0 0.5em ${ VARIATIONS.structure.bgElementActive });
    color: ${ VARIATIONS.structure.textHighContrast };
    outline-offset: 0px;
    outline-width: 0px;
  }
`;

let timeout: NodeJS.Timeout;

const TitleInput = () => {
  const { areAllVotesCast, currentTicket, handleCreateTicket, handleUpdateLatestTicket } = useTickets();
  const inputRef = useRef<HTMLInputElement>(null);
  const [ value, setValue ] = useState(currentTicket?.name);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (value && currentTicket?.name !== value) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (areAllVotesCast) {
          handleCreateTicket(value);
        } else {
          handleUpdateLatestTicket('name', value);
        }
      }, 1000);
    }
  }, [ value ]);

  useEffect(() => {
    setValue(currentTicket?.name);
  }, [ currentTicket?.name ]);

  return (
    <StyledInput
      ref={inputRef}
      type='text'
      placeholder='ticket number or title'
      value={value}
      isLoading={isLoading}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default TitleInput;

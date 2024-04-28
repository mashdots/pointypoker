import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { VARIATIONS } from '../../../utils/styles';

type Props = {
  updatedTicketTitle: string;
  handleUpdate: (field: string, value: string) => void;
  createTicket: (newTicketName: string | undefined) => void;
  allVotesCast: boolean;
}

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

const TitleInput = ({
  updatedTicketTitle,
  handleUpdate,
  createTicket,
  allVotesCast,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [ value, setValue ] = useState(updatedTicketTitle);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (updatedTicketTitle !== value) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        console.log('UPdating value', value, allVotesCast);
        if (allVotesCast) {
          createTicket(value);
        } else {
          handleUpdate('name', value);
        }
      }, 1000);
    }
  }, [ value ]);

  useEffect(() => {
    setValue(updatedTicketTitle);
  }, [ updatedTicketTitle ]);

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

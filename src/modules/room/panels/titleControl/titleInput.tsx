import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import * as urlLib from 'whatwg-url';

import { useTickets } from '../../hooks';
import { VARIATIONS } from '../../../../utils/styles';
import ArticleIcon from '../../../../assets/icons/article.svg?react';


type InputProps = {
  isLoading: boolean;
}

type FocusProps = {
  $isFocused: string | boolean;
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

const Icon = styled(ArticleIcon)<FocusProps>`
  width: 24px;
  padding-top: 0.75rem;
  margin-right: 1rem;
  transition: all 300ms;

  ${({ $isFocused }) => $isFocused && css`
    width: 32px;
    margin-right: 0.5rem;
    > line {
      stroke: ${ VARIATIONS.structure.textHighContrast };
    }

    > rect:nth-child(2) {
      stroke: ${ VARIATIONS.structure.textHighContrast };
    }
  `}
`;

const FocusIndicatorContainer = styled.div`
  width: 100%;
  height: 2px;
`;

const FocusIndicator = styled.div<FocusProps>`
  width: 0%;
  height: 2px;
  background-color: ${ VARIATIONS.structure.textHighContrast };
  transition: all 300ms;

  ${({ $isFocused }) => $isFocused && css`
    width: 100%;
  `}
`;

const StyledInput = styled.input<InputProps>`
  background-color: ${ VARIATIONS.structure.bg };
  color: ${ VARIATIONS.structure.textLowContrast };

  border: none;
  margin-top: 1rem;
  text-align: left;
  font-size: 1.5rem;
  width: 100%;

  outline-offset: 0px;
  outline-width: 0px;
  outline-style: solid;
  margin-bottom: 2px;

  transition: all 300ms;

  :focus {
    color: ${ VARIATIONS.structure.textHighContrast };
  }
`;

let timeout: number;

const TitleInput = () => {
  const { currentTicket, handleCreateTicket, handleUpdateLatestTicket, shouldShowVotes } = useTickets();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(currentTicket?.name);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (value && currentTicket?.name !== value) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (shouldShowVotes) {
          handleCreateTicket(value);
        } else {
          if (currentTicket.name?.length === 0) {
            handleUpdateLatestTicket('timerStartAt', Date.now());
          }

          handleUpdateLatestTicket('name', value);
        }
      }, 1000);
    }
  }, [value]);

  useEffect(() => {
    setValue(currentTicket?.name);
  }, [currentTicket?.name]);

  return (
    <FormWrapper>
      <InputWrapper>
        <Icon $isFocused={isFocused} />
        <StyledInput
          ref={inputRef}
          type='text'
          placeholder='ticket number or title'
          value={value ?? ''}
          isLoading={isLoading}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => {
            if (shouldShowVotes) {
              inputRef.current?.select();
            }
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
        />
      </InputWrapper>
      <FocusIndicatorContainer>
        <FocusIndicator $isFocused={isFocused} />
      </FocusIndicatorContainer>
    </FormWrapper>
  );
};

export default TitleInput;

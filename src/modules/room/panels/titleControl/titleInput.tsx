import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { parseURL } from 'whatwg-url';

import { useTickets } from '../../hooks';
import ArticleIcon from '../../../../assets/icons/article.svg?react';
import LinkIcon from '../../../../assets/icons/link-out.svg?react';
import { TextInput } from '../../../../components/common';
import { ThemedProps } from '../../../../utils/styles/colors/colorSystem';


type FocusProps = ThemedProps & {
  $isFocused: string | boolean;
}

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

const TitleIcon = styled(ArticleIcon)<FocusProps>`
  transition: all 300ms;

  ${({ $isFocused, theme }) => css`
    margin-right: ${$isFocused ? 0.75 : 1}rem;
    margin-left: ${$isFocused ? -0.25 : 0}rem;
    width: ${$isFocused ? 2 : 1.5}rem;

    > line {
      stroke: ${ theme.primary[$isFocused ? 'textHigh' : 'textLow'] };
    }

    > rect:nth-child(2) {
      stroke: ${ theme.primary[$isFocused ? 'textHigh' : 'textLow'] };
    }
  `}
`;

const TitleLinkIcon = styled(LinkIcon)<ThemedProps>`
  width: 1.5rem;
  margin-right: 1rem;
  transition: all 300ms;

  > polyline, line, path {
    stroke: ${({ theme }) => theme.info.textLow};
  }

  :hover {
    cursor: pointer;
    width: 2rem;
    margin-right: 0.75rem;
    margin-left: -0.25rem;
  }
`;

let timeout: number;

const TitleInput = () => {
  const { currentTicket, handleCreateTicket, handleUpdateLatestTicket, shouldShowVotes } = useTickets();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(currentTicket?.name);
  const [isFocused, setIsFocused] = useState(false);

  const parsedUrl = parseURL(value ?? '');

  const icon = parsedUrl
    ? <TitleLinkIcon onClick={() => window.open(value!)} />
    : <TitleIcon $isFocused={isFocused} />;


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
    if (currentTicket?.name !== value) {
      setValue(currentTicket?.name);
    }
  }, [currentTicket?.name]);

  return (
    <FormWrapper>
      <InputWrapper>
        <TextInput
          inputRef={inputRef}
          id='ticket-title'
          value={value ?? ''}
          onChange={(e) => setValue(e.target.value)}
          placeHolder='ticket number or title'
          onFocus={() => {
            if (shouldShowVotes) {
              inputRef.current?.select();
            }
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          icon={icon}
        />
      </InputWrapper>
    </FormWrapper>
  );
};

export default TitleInput;

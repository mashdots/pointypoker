import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { parseURL } from 'whatwg-url';

import { useTickets } from '../../hooks';
import Spinner from '@assets/icons/loading-circle.svg?react';
import { TextInput } from '@components/common';
import useStore from '@utils/store';
import { useJira } from '@modules/integrations';
import { QueuedJiraTicket } from '@modules/integrations/jira/types';
import { ThemedProps } from '@utils/styles/colors/colorSystem';
import { spinAnimation } from '@components/common/animations';

type Props = {
  value: string;
  shouldFocus: string | null;
}

const LoadingIcon = styled(Spinner)`
  height: 2rem;
  width: 2rem;
  position: absolute;
  right: 2rem;
  top: 0.625rem;
  animation: ${ spinAnimation } 1s linear infinite;
`;

const Wrapper = styled.div`
  flex: 1;
  padding: 0 1rem;
  position: relative;
`;

const NotTheTextInput = styled.div <{ hasTitle: boolean }>`
  ${({ hasTitle, theme }: { hasTitle: boolean } & ThemedProps) => css`
    background-color: ${ theme.primary.border };
    border-color: ${ theme.primary.border };
    color: ${ theme.primary[ hasTitle ? 'textHigh' : 'textLow'] };
    text-align: start;
    font-size: 1.5rem;

    outline-color: white;
    outline-style: solid;
    outline-width: 0px;
    outline-offset: 0px;
    
    :hover {
      background-color: ${ theme.primary.componentBgHover };
    }
  `}

  cursor: pointer;
  flex: 1;
  padding: 0.375rem 1rem;
  margin: 0 0 2px 0;
  width: 100%;

  border-width: 2px;
  border-style: solid;
  border-radius: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  transition: all 200ms;
`;

let timeout: number;

/**
 * Two components:
 * - A text input that allows users to enter a ticket number or title.
 * - A display component that shows the "name" of the ticket.
 *
 * The text input will only be visible if someone wants to create a new ticket or edit the name of a ticket that is not a JIRA ticket
 *
 */

const Title = ({ shouldFocus, value }: Props) => {
  const {
    handleCreateTicket,
    handleCreatePredefinedTicket,
    shouldShowVotes,
  } = useTickets();
  const [isLoading, setIsLoading] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const setIsFocused = useStore(({ setTitleInputFocus }) => setTitleInputFocus);
  const { buildJiraUrl, isConfigured: isJiraConfigured, getIssueDetail, getPointFieldFromBoardId } = useJira();

  const handleCreateNewJiraTicket = async (ticketName: string) => {
    try {
      const ticketDetail = await getIssueDetail(ticketName);
      const pointField = await getPointFieldFromBoardId(ticketDetail.fields.sprint.originBoardId);
      const newTicket: QueuedJiraTicket = {
        id: ticketDetail.key,
        name: ticketDetail.fields.summary,
        type: ticketDetail.fields.issuetype,
        sprint: ticketDetail.fields.sprint,
        estimationFieldId: pointField?.id ?? '',
        url: buildJiraUrl(ticketDetail.key),
      };

      handleCreatePredefinedTicket(newTicket);

    } catch (error) {
      console.error(error);
      handleCreateTicket(ticketName);
    }
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length === 0) {
      return;
    }

    clearTimeout(timeout);

    timeout = setTimeout(() => {
      setIsLoading(true);
      const newTicketName = e.target.value;
      const ticketIsUrl = !!parseURL(newTicketName);

      // If the new ticket name is a URL, parse it.
      if (ticketIsUrl) {
        const rex = /.*\.atlassian\.net\/browse\/(?<parsedTicket>\w*-\w*)\??/;
        const { parsedTicket = '' } = rex.exec(newTicketName as string)?.groups ?? {};

        // If the URL has a ticket name, create a new Jira ticket
        if (isJiraConfigured && parsedTicket) {
          handleCreateNewJiraTicket(parsedTicket);
          return;
        }
      }

      // Otherwise, create a new ticket based on teh name
      handleCreateTicket(newTicketName);
      setIsLoading(false);
    }, 1000);
  }, [ isJiraConfigured ]);

  const displayComponent = canEdit ? (
    <>
      {isLoading && <LoadingIcon />}
      <TextInput
        collapse
        inputRef={inputRef}
        id='ticket-title'
        value={value}
        onChange={handleChange}
        placeHolder='ticket number or title'
        onFocus={() => {
          if (shouldShowVotes) {
            inputRef.current?.select();
          }
          setIsFocused(true);
        }}
        onBlur={() => setIsFocused(false)}
      />
    </>
  ) : (
    <>
      <NotTheTextInput
        hasTitle={!!value}
        onClick={() => setCanEdit(true)}
      >
        {value || 'ticket number or title'}
      </NotTheTextInput>
    </>
  );

  useEffect(() => {
    setCanEdit(false);
  }, [ value ]);

  useEffect(() => {
    if (canEdit) {
      inputRef.current?.select();
    } else {
      setIsFocused(false);
    }
  }, [canEdit]);

  useEffect(() => {
    setCanEdit(!!shouldFocus);
  }, [shouldFocus]);

  return (
    <Wrapper>
      {displayComponent}
    </Wrapper>
  );
};

export default Title;

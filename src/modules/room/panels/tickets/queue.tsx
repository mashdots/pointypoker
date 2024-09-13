import React from 'react';
import styled, { css } from 'styled-components';

import { useTickets } from '../../hooks';
import LinkSvg from '@assets/icons/link-out.svg?react';
import { ThemedProps } from '@utils/styles/colors/colorSystem';
import { fadeDownEntrance } from '@components/common/animations';
import { PossibleQueuedTicket } from '@yappy/types/room';
import { QueuedJiraTicket } from '@modules/integrations/jira/types';
import { useReconcileJiraTicketData } from '@modules/integrations/jira';

type IssueWrapperProps = ThemedProps & {
  delayFactor: number,
  isCurrentTicket: boolean,
  isSelectable: boolean,
};

const TicketRowList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
`;

const IssueWrapper = styled.div<IssueWrapperProps>`
  ${ ({ delayFactor, isCurrentTicket, isSelectable, theme }: IssueWrapperProps) => {
    const themeColor = isCurrentTicket ? 'primary' : 'greyscale';
    return css`
      animation: ${ fadeDownEntrance } 0.25s ease-out ${ delayFactor }ms forwards;
      background-color: ${ theme[themeColor].componentBg };
      border-left: 4px ${ isCurrentTicket ? 'solid' : 'none' } ${ theme.primary.border };
      border-bottom: 1px ${ isCurrentTicket ? 'none' : 'solid' } ${ theme.greyscale.border };
      color: ${ theme.primary.textHigh };
      cursor: ${ isSelectable ? 'pointer' : 'default' };

      :hover {
        background-color: ${ theme[themeColor].componentBgHover };
        border-color: ${ theme[themeColor].borderElementHover };
      }
    `;
  }};
    
  border-radius: 0.5rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0.25rem 0.25rem;
  margin-bottom: 0.5rem;
  opacity: 0;
  width: 100%;

  transition: 
    border-color 0.3s ease-out,
    background-color 0.3s ease-out,
    border-left 0.25s ease-out;

  :hover {
    > div p, div a {
      max-height: 1.5rem;
    }
  }
`;

const TicketInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  overflow: hidden;
  white-space: nowrap;
`;

const Title = styled.span`
  margin-bottom: 0;
  white-space: nowrap;
`;

const TicketSprintInfo = styled.p`
  ${ ({ theme }: ThemedProps) => css`
    color: ${ theme.greyscale.textLow };
  `};

  font-size: 0.75rem;
  margin: 0;
  max-height: 0;
  overflow: hidden; 

  transition: 
    max-height 0.3s ease-out 0.25s,
    color 0.3s ease-out;
`;

const TicketId = styled(TicketSprintInfo)`
  ${ ({ theme }: ThemedProps) => css`
    :hover {
      color: ${ theme.info.textLow };
    }
  `};

  font-weight: 500;
  margin-bottom: 0;
  white-space: nowrap;
`;

const TicketTypeIcon = styled.img`
  height: 1.5rem;
  width: 1.5rem;
  margin-right: 0.5rem;
  border-radius: 0.25rem;
`;

const TitleLinkIcon = styled(LinkSvg)`
  width: 0.75rem;
  margin-left: 0.25rem;
  transition: all 300ms;

  > polyline, line, path {
    stroke: ${ ({ theme }) => theme.info.textLow };
  }
`;

/**
 * There is only partial handling of "non-JIRA" tickets in this component.
 * More work will be done later to fully support non-JIRA tickets.
 */
const Queue = () => {
  const {
    currentTicket,
    handleCreatePredefinedTicket,
    queue,
  } = useTickets();
  useReconcileJiraTicketData();

  const handleSelectIssue = (ticket: PossibleQueuedTicket) => {
    handleCreatePredefinedTicket(ticket, true);
  };

  const issues = queue.map((issue, delayMultiplier) => {
    // Currently queues only support tickets from JIRA
    const {
      id,
      name,
      type,
      sprint,
      url,
    } = issue as QueuedJiraTicket;
    const isCurrentTicket = currentTicket?.id === id;
    const canSelectIssue = !currentTicket || !isCurrentTicket;
    const clickableProps = canSelectIssue ? {
      onClick: () => handleSelectIssue(issue),
      title: 'Click to select this ticket',
    } : {};

    return (
      <IssueWrapper
        key={id}
        delayFactor={100 * delayMultiplier}
        isCurrentTicket={isCurrentTicket}
        isSelectable={canSelectIssue}
        {...clickableProps}
      >
        <TicketTypeIcon
          src={type.iconUrl}
          alt={type.name}
          title={type.name}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = 'https://v1.icons.run/64/ph/binoculars.png?color=FFFFFF&bg=e5484d';
          }}
        />
        <TicketInfo>
          <TicketId
            as='a'
            title='Click to visit the ticket in JIRA'
            href={url}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
          >
            {id}
            <TitleLinkIcon />
          </TicketId>
          <Title title={name}>{name}</Title>
          <TicketSprintInfo>{sprint.name}</TicketSprintInfo>
        </TicketInfo>
      </IssueWrapper>
    );
  });

  return (
    <TicketRowList>
      {issues}
    </TicketRowList>
  );
};

export default Queue;

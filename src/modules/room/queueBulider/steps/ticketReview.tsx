import React, { useCallback, useState } from 'react';
import { arrayUnion } from 'firebase/firestore';
import styled, { css } from 'styled-components';

import ArrowSvg from '@assets/icons/arrow-right.svg?react';
import PrependSvg from '@assets/icons/queue-prepend.svg?react';
import AppendSvg from '@assets/icons/queue.svg?react';
import ReplaceSvg from '@assets/icons/arrows-counter-clockwise.svg?react';
import { Button } from '@components/common';
import { cardEntranceAnimation } from '@components/common/animations';
import { InformationWrapper, SelectionWrapper } from '@modules/room/queueBulider/steps/common';
import { JiraIssueSearchPayload, QueuedJiraTicket } from '@modules/integrations/jira/types';
import { Separator } from '@modules/preferences/panes/common';
import { updateRoom } from '@services/firebase';
import { ThemedProps } from '@utils/styles/colors/colorSystem';
import useStore from '@utils/store';
import { Room } from '@yappy/types';
import { RoomUpdateObject } from '@yappy/types/room';
import { useMobile } from '@utils/hooks/mobile';

export enum EXISTING_QUEUE_ACTIONS {
  PREPEND,
  APPEND,
  REPLACE,
}

type Props = {
  existingQueue: Room['ticketQueue'];
  issues: JiraIssueSearchPayload[];
}

type QueueControlProps = {
  alignRight: boolean;
  isMobile: boolean;
}

const IssuesWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 80%;
  overflow: auto;
  border-radius: 0.5rem;
`;

const QueueControlWrapper = styled.div<QueueControlProps>`
  ${({ alignRight, isMobile }: QueueControlProps) => css`
    justify-content: ${alignRight ? 'flex-end' : 'space-between'};
    flex-direction: ${isMobile ? 'column' : 'row'};
    align-items: center;
  `};

  display: flex;
  width: 80%;
`;

const IssueWrapper = styled.div<{ delayFactor: number }>`
  ${({ delayFactor, theme }: { delayFactor: number } & ThemedProps) => css`
    animation: ${cardEntranceAnimation } 0.25s ease-out ${ delayFactor}ms forwards;
    background-color: ${theme.greyscale.componentBg};
    border: 2px solid ${theme.greyscale.border};
    color: ${theme.primary.textHigh};
  `};
    
  border-radius: 0.5rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  opacity: 0;
  width: 100%;
`;

const TicketInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  overflow: hidden;
`;

const Title = styled.h4`
  margin-bottom: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const TicketSprintInfo = styled.p`
  ${({ theme }: ThemedProps) => css`
    color: ${theme.greyscale.textLow};
  `};

  font-size: 0.75rem;
  margin: 0;
`;

const TicketTypeIcon = styled.img`
  height: 2rem;
  width: 2rem;
  margin-right: 0.5rem;
`;

const ArrowIcon = styled(ArrowSvg)`
  height: 1.5rem;
  width: 1.5rem;
  margin-left: 0.5rem;
`;

const PrependIcon = styled(PrependSvg)`
  height: 1.5rem;
  width: 1.5rem;
  margin-right: 0.5rem;
`;

const AppendIcon = styled(AppendSvg)`
  height: 1.5rem;
  width: 1.5rem;
  margin-right: 0.5rem;
`;

const ReplaceIcon = styled(ReplaceSvg)`
  height: 1.5rem;
  width: 1.5rem;
  margin-right: 0.5rem;
`;

const QueueActionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`;

const QueueActionRadioButton = styled.div<{ isSelected: boolean }>`
  ${({ isSelected, theme }: { isSelected: boolean } & ThemedProps) => css`
    background-color: ${theme[isSelected ? 'info' : 'greyscale'].componentBg};
    color: ${theme[isSelected ? 'info' : 'greyscale'].textLow};
    border: 2px solid ${theme[isSelected ? 'info' : 'greyscale'].border};
  `}

  cursor: pointer;
  display: flex;
  padding: 0.5rem;
  border-radius: 0.5rem;
  margin-right: 0.5rem;
  margin-top: 0.5rem;

  transition: 
    background-color 250ms ease-out,
    color 250ms ease-out,
    border 250ms ease-out;
  
  > label {
    cursor: pointer;
  }
  > input {
    display: none;
  }
`;

const TicketReview = ({
  existingQueue,
  issues,
}: Props) => {
  const [queueAction, setQueueAction] = useState<EXISTING_QUEUE_ACTIONS | null>(null);
  const { closeModal, roomName } = useStore(({ room, setCurrentModal }) => ({
    closeModal: () => setCurrentModal(null),
    roomName: room?.name,
  }));
  const { isMobile } = useMobile();
  const ticketsInQueue = !!existingQueue.length;

  const handleAddTicketsToQueue = useCallback(
    async () => {
      if (!roomName) {
        return;
      }

      const updateObj: RoomUpdateObject = {};
      const newIssues = issues.map(
        ({ key, fields: { summary, issuetype, sprint } }): QueuedJiraTicket => {
          return {
            id: key,
            name: summary,
            type: issuetype,
            sprint,
            fromJira: true,
          };
        },
      );

      switch (queueAction) {
      case EXISTING_QUEUE_ACTIONS.APPEND:
        updateObj['ticketQueue'] = arrayUnion(...newIssues);
        break;
      case EXISTING_QUEUE_ACTIONS.PREPEND:
        updateObj['ticketQueue'] = [ ...newIssues, ...existingQueue ];
        break;
      case EXISTING_QUEUE_ACTIONS.REPLACE:
      default:
        updateObj['ticketQueue'] = [...newIssues];
        break;
      }

      try {
        await updateRoom(roomName, updateObj, closeModal);
      } catch (error) {
        console.error('Failed to update queue', error);
      }
    },
    [queueAction],
  );

  const issueList = issues.map(({
    fields: {
      issuetype,
      sprint,
      summary,
    },
    key,
  }, delayMultiplier) => (
    <IssueWrapper key={key} delayFactor={100 * delayMultiplier}>
      <TicketTypeIcon src={issuetype.iconUrl} alt={issuetype.name} title={issuetype.name} />
      <TicketInfo>
        <Title title={summary}>{summary}</Title>
        <TicketSprintInfo>{key}&nbsp;&nbsp;•&nbsp;&nbsp;{issuetype.name} in {sprint.name}</TicketSprintInfo>
      </TicketInfo>
    </IssueWrapper>
  ));

  const queueActionOptions = [
    { label: 'Replace', value: EXISTING_QUEUE_ACTIONS.REPLACE, icon: <ReplaceIcon /> },
    { label: 'Append', value: EXISTING_QUEUE_ACTIONS.APPEND, icon: <AppendIcon /> },
    { label: 'Prepend', value: EXISTING_QUEUE_ACTIONS.PREPEND, icon: <PrependIcon /> },
  ];

  return (
    <SelectionWrapper isColumn>
      <InformationWrapper>
        Review tickets
      </InformationWrapper>
      <IssuesWrapper>
        {issueList}
      </IssuesWrapper>
      <Separator />
      {ticketsInQueue && (
        <p style={{ marginBottom: 0 }}>Tickets already exist in the queue. How should we add the new tickets?</p>
      )}
      <QueueControlWrapper alignRight={!ticketsInQueue} isMobile={isMobile}>
        {ticketsInQueue && (
          <QueueActionWrapper>
            {queueActionOptions.map(({ label, value, icon }) => (
              <QueueActionRadioButton
                key={value}
                isSelected={queueAction === value}
                onClick={() => setQueueAction(value)}
              >
                {icon}
                <input
                  type='radio'
                  id={label}
                  name='queueAction'
                  value={value}
                />
                <label htmlFor={label}>{label}</label>
              </QueueActionRadioButton>
            ),
            )}
          </QueueActionWrapper>
        )}
        <Button
          variation='info'
          width={12}
          textSize='small'
          onClick={handleAddTicketsToQueue}
          isDisabled={ticketsInQueue && !queueAction}
        >
          {ticketsInQueue ? 'Update' : 'Add to'} queue
          <ArrowIcon />
        </Button>
      </QueueControlWrapper>
    </SelectionWrapper>
  );
};

export default TicketReview;

import React, { useCallback, useState } from 'react';
import { arrayUnion } from 'firebase/firestore';

import ArrowSvg from '@assets/icons/arrow-right.svg?react';
import { InformationWrapper, SelectionWrapper } from '@modules/room/queueBulider/steps/common';
import styled, { css } from 'styled-components';
import { JiraIssueSearchPayload, QueuedJiraTicket } from '@modules/integrations/jira/types';
import { ThemedProps } from '@utils/styles/colors/colorSystem';
import { cardEntranceAnimation } from '@components/common/animations';
import { Button } from '@components/common';
import { Room } from '@yappy/types';
import useStore from '@utils/store';
import { QueuedTicket, RoomUpdateObject } from '@yappy/types/room';
import { updateRoom } from '@services/firebase';

export enum EXISTING_QUEUE_ACTIONS {
  PREPEND,
  APPEND,
  REPLACE,
}

type Props = {
  existingQueue: Room['ticketQueue'];
  issues: JiraIssueSearchPayload[];
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


const QueueControlWrapper = styled.div<{ alignRight: boolean }>`
  ${({ alignRight }: { alignRight: boolean }) => css`
    align-items: ${alignRight ? 'flex-end' : 'center'};
  `};
  display: flex;
  flex-direction: column;
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

const TicketReview = ({
  existingQueue,
  issues,
}: Props) => {
  const [queueAction, setQueueAction] = useState<EXISTING_QUEUE_ACTIONS | null>(null);
  const { closeModal, roomName } = useStore(({ room, setCurrentModal }) => ({
    closeModal: () => setCurrentModal(null),
    roomName: room?.name,
  }));

  const handleAddTicketsToQueue = useCallback(
    async () => {
      if (!roomName) {
        return;
      }

      const updateObj: RoomUpdateObject = {};
      let newQueue: Array<QueuedJiraTicket | QueuedTicket> = [ ...existingQueue ];
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
      case EXISTING_QUEUE_ACTIONS.PREPEND:
        newQueue.unshift(...newQueue);
        break;
      case EXISTING_QUEUE_ACTIONS.REPLACE:
      default:
        newQueue = [...newIssues];
        break;
      }

      if (queueAction === EXISTING_QUEUE_ACTIONS.APPEND) {
        updateObj['ticketQueue'] = arrayUnion(...newIssues);
      } else {
        updateObj['ticketQueue'] = newQueue;
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

  return (
    <SelectionWrapper isColumn>
      <InformationWrapper>
        Review tickets
      </InformationWrapper>
      <IssuesWrapper>
        {issueList}
      </IssuesWrapper>
      <QueueControlWrapper alignRight={!existingQueue.length}>
        <Button
          variation='info'
          width={12}
          textSize='small'
          onClick={handleAddTicketsToQueue}
        >
          Add to queue
          <ArrowIcon />
        </Button>
      </QueueControlWrapper>
    </SelectionWrapper>
  );
};

export default TicketReview;

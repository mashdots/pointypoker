import React from 'react';

import { SelectionWrapper } from '@modules/room/queueBulider/steps/common';
import styled, { css } from 'styled-components';
import { JiraIssueSearchPayload } from '@modules/integrations/jira/types';
import { ThemedProps } from '@utils/styles/colors/colorSystem';

type Props = {
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


const QueueControlWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 80%;
  height: 2rem;
`;

const IssueWrapper = styled.div`
  ${({ theme }: ThemedProps) => css`
    background-color: ${theme.greyscale.componentBg};
    color: ${theme.primary.textHigh};
    border: 2px solid ${theme.greyscale.border};
  `};
    
  border-radius: 0.5rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  width: 100%;
`;

const TicketInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  overflow: hidden;
`;

const Title = styled.h3`
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

const TicketReview = ({
  issues,
}: Props) => {

  console.log('issues', issues);

  const issueList = issues.map((issue) => {
    return (
      <IssueWrapper key={issue.key}>
        <TicketInfo>
          <Title>{issue.fields.summary}</Title>
          <TicketSprintInfo>{issue.key} • {issue.fields.sprint.name}</TicketSprintInfo>
        </TicketInfo>
      </IssueWrapper>
    );
  }, []);

  return (
    <SelectionWrapper isColumn style={{ height: '100%' }}>
      <h3>Review your tickets</h3>
      <IssuesWrapper>
        {issueList}
      </IssuesWrapper>
      <QueueControlWrapper>
        Buttons go here
      </QueueControlWrapper>
    </SelectionWrapper>
  );
};

export default TicketReview;

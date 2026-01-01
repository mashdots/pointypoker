import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import cloneDeep from 'lodash/cloneDeep';
import styled, { css } from 'styled-components';

import Spinner from '@assets/icons/loading-circle.svg?react';
import { fadeDownEntrance, spinAnimation } from '@components/common/animations';
import { useJira } from '@modules/integrations';
import {
  JiraField,
  JiraIssueSearchPayload,
  JiraSprint,
  JiraSprintWithIssues,
} from '@modules/integrations/jira/types';
import { usePrevious } from '@utils';
import { ThemedProps } from '@utils/styles/colors/types';
import { Room } from '@yappy/types';

import { InformationWrapper, SectionWrapper } from './common';

type Props = {
  boardId?: string | number;
  existingQueue: Room[ 'ticketQueue' ];
  setSprint: (sprintData: JiraSprintWithIssues) => void;
  pointField: JiraField;
};

type SprintOptionProps = {
  hasIssues: boolean;
  hasNewIssuesWithIssuesInQueue: boolean;
  delayFactor?: number;
} & ThemedProps;

const LoadingWrapper = styled.span<{ size: number }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-right: 0.25rem;

  ${({ size }) => css`
    > svg {
      height: ${size}rem;
      width: ${size}rem;
    }
  `}
`;

const LoadingIcon = styled(Spinner)`
  ${({ theme }: ThemedProps) => css`
    > polyline, circle {
      stroke: ${theme.greyscale.accent11};
    }
  `}

  animation: ${spinAnimation} 1s linear infinite;
`;

const SprintOptionWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 80%;
  overflow: auto;
  border-radius: 0.5rem;
`;

const SprintOption = styled.div<SprintOptionProps>`
  ${({
    delayFactor,
    hasIssues,
    theme,
  }: SprintOptionProps) => css`
    cursor: ${ hasIssues ? 'pointer' : 'default' };
    background-color: ${ theme.greyscale[ hasIssues ? 'accent3' : 'accent2' ] };
    color: ${ theme.greyscale[hasIssues ? 'accent12' : 'accent11'] };
    border-width: 1px;
    border-style: solid;
    border-color: ${ theme.greyscale[hasIssues ? 'accent7' : 'accent3'] };
    animation: ${ fadeDownEntrance } 0.25s ease-out ${ delayFactor }ms forwards;
    
    &:hover {
      border-color: ${ theme.greyscale[hasIssues ? 'accent12' : 'accent3'] };
    }
  `}

  opacity: 0;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  margin: 0.25rem 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  transition: 
    background-color 0.25s ease-out,
    color 0.25s ease-out,
    border 0.25s ease-out;
`;

const PointContainer = styled.span<SprintOptionProps>`
  ${({
    theme,
    hasIssues,
    hasNewIssuesWithIssuesInQueue,
  }: SprintOptionProps) => {
    let colorScheme = hasIssues ? 'success' : 'greyscale';
    if (hasNewIssuesWithIssuesInQueue) {
      colorScheme = 'info';
    }

    return css`
      border: 1px solid ${ theme[colorScheme][ hasIssues ? 'accent8' : 'accent2' ] };
      color: ${ theme[colorScheme][hasIssues ? 'accent9' : 'accent11'] };
      background-color: ${ theme[ colorScheme ][hasIssues ? 'accent2' : 'none'] };
      font-size: 0.75rem;
    `;
  }}

  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;

  transition: 
    color 0.25s ease-out,
    border 0.125s ease-out;
`;

const SprintSelection = ({
  boardId,
  existingQueue,
  setSprint,
  pointField,
}: Props) => {
  const previousBoardId = usePrevious(boardId);
  const [isLoading, setIsLoading] = useState(false);
  const [sprintData, setSprintData] = useState<JiraSprint[] | null>(null);
  const [issueData, setIssueData] = useState<JiraIssueSearchPayload[] | null>(null);
  const {
    getSprintsForBoard,
    getIssuesForBoard,
    getAvatars,
  } = useJira();

  const handleFetchSprintData = useCallback(async () => {
    if (!boardId) {
      return;
    }

    setIsLoading(true);
    // setIsError(false);

    try {
      const sprints = await getSprintsForBoard(boardId);
      setSprintData(sprints.values as JiraSprint[]);
    } catch (error) {
      // setIsError(true);
    }

  }, [boardId]);

  const handleGetAvatars = useCallback(async () => {
    if (!issueData?.length) {
      return [];
    }

    const avatarData = issueData?.reduce((acc: { [key: string]: number }, issue) => {
      const { issuetype } = issue.fields;
      if (!acc[issuetype.name]) {
        acc[issuetype.name] = issuetype.avatarId;
      }
      return acc;
    }, {});

    try {
      const avatars = await getAvatars(avatarData);

      setIssueData((existingIssueData) => {
        if (!existingIssueData) {
          return [];
        }

        return existingIssueData.map((issue) => {
          const updatedIssue = cloneDeep(issue);
          const { issuetype } = updatedIssue.fields;
          const iconData = avatars[issuetype.name];
          updatedIssue.fields.issuetype.icon = { ...iconData };

          return { ...updatedIssue };
        });
      });
    } catch (error) {
      console.error('Error fetching avatars:', error);
    }

    setIsLoading(false);
  }, [issueData?.length]);

  const handleFetchIssueData = useCallback(async (startAt = 0) => {
    if (!boardId) {
      return;
    }

    // setIsError(false);

    try {
      const issues = await getIssuesForBoard(
        boardId as string,
        pointField,
        startAt,
      );
      setIssueData((existingIssueData) => {
        if (!existingIssueData) {
          return [...issues.issues];
        }

        const newIssues = issues.issues.filter((issue) => {
          return !existingIssueData.some((existingIssue) => existingIssue.id === issue.id);
        });

        return [...existingIssueData, ...newIssues];
      });

      if (startAt < issues.total) {
        handleFetchIssueData(startAt + issues.maxResults);
        return;
      }
    } catch (error) {
      console.error('Ahhh shit', error);
      // setIsError(true);
    }
  }, [boardId]);

  useEffect(() => {
    if (boardId && previousBoardId !== boardId) {
      setSprintData(null);
      setIssueData(null);
      handleFetchSprintData();
      handleFetchIssueData();
    }
  }, [boardId]);

  useEffect(() => {
    if (issueData?.length) {
      handleGetAvatars();
    }
  }, [issueData?.length]);

  const sprintOptions = useMemo(() => sprintData?.map((sprint, delayFactor) => {
    const apiIssues = issueData?.filter((issue) => issue.fields.sprint?.id === sprint.id) ?? [];
    const issuesInQueue = existingQueue.filter((ticket) => {
      return apiIssues.some((issue) => issue.key === ticket.id);
    });
    const newIssueCount = apiIssues.length - issuesInQueue.length;
    const hasIssues = !!apiIssues.length && !!newIssueCount;

    const handleSelectSprint = () => {
      const newIssues = apiIssues.filter((issue) => !issuesInQueue.some((ticket) => ticket?.id === issue.key));

      if (newIssues.length) {
        setSprint({
          ...sprint,
          issues: newIssues,
        });
      }
    };

    const issueCountDisplay = isLoading ? (
      <LoadingWrapper size={1}>
        <LoadingIcon />
      </LoadingWrapper>
    ) : newIssueCount;

    let pointContainerMessage: string | JSX.Element = '';

    if (isLoading) {
      pointContainerMessage = (<>{issueCountDisplay} loading tickets</>);
    } else {
      if (issuesInQueue.length) {
        if (newIssueCount > 0) {
          // Issues in queue, but there are new issues in the sprint that aren't in the queue
          pointContainerMessage = `${ issueCountDisplay } new unpointed ticket${ issuesInQueue.length === 1 ? '' : 's' }`;
        } else {
          // Issues in queue, but they all match issues in sprint
          pointContainerMessage = 'Sprint already in queue';
        }
      } else if (newIssueCount > 0) {
        // No issues in queue, issues in sprint
        pointContainerMessage = `${issueCountDisplay} unpointed ticket${apiIssues.length === 1 ? '' : 's'}`;
      } else {
        // No issues in queue, no issues in sprint
        pointContainerMessage = 'No unpointed tickets';
      }
    }

    return (
      <SprintOption
        key={sprint.id}
        hasIssues={hasIssues}
        hasNewIssuesWithIssuesInQueue={newIssueCount > 0 && issuesInQueue.length > 0}
        delayFactor={100 * delayFactor}
        onClick={handleSelectSprint}
      >
        {sprint.name}
        <PointContainer hasIssues={hasIssues} hasNewIssuesWithIssuesInQueue={newIssueCount > 0 && issuesInQueue.length > 0}>
          {pointContainerMessage}
        </PointContainer>
      </SprintOption>
    );
  }), [
    sprintData,
    issueData,
    isLoading,
    existingQueue,
  ]);

  const loadingIcon = useMemo(() => sprintData ? 'Select a sprint' : (
    <LoadingWrapper size={2}><LoadingIcon /></LoadingWrapper>
  ), [sprintData]);

  return (
    <SectionWrapper>
      <InformationWrapper>
        {loadingIcon}
      </InformationWrapper>
      <SprintOptionWrapper>
        {sprintOptions}
      </SprintOptionWrapper>
    </SectionWrapper>
  );
};

export default SprintSelection;

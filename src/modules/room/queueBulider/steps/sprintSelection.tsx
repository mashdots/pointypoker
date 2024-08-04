import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

import Spinner from '@assets/icons/loading-circle.svg?react';
import { useJira } from '@modules/integrations';
import { JiraIssueSearchPayload, JiraSprint, JiraSprintWithIssues } from '@modules/integrations/jira/types';
import { SelectionWrapper } from '@modules/room/queueBulider/steps/common';
import useStore from '@utils/store';
import { usePrevious } from '@utils';
import { ThemedProps } from '@utils/styles/colors/colorSystem';
import { spinAnimation } from '@components/common/animations';

type Props = {
  boardId?: string | number;
  setSprint: (sprintData: JiraSprintWithIssues) => void;
}

type SprintOptionProps = {
  hasIssues: boolean;
  delayFactor?: number;
} & ThemedProps;

const entrance = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-1rem);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const SprintInformationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  height: 2rem;
`;

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
      stroke: ${theme.greyscale.textLow};
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
  ${({ delayFactor, hasIssues, theme }: SprintOptionProps) => css`
    cursor: ${hasIssues ? 'pointer' : 'default'};
    background-color: ${ theme.greyscale.componentBg };
    color: ${ theme.greyscale[hasIssues ? 'textHigh' : 'textLow'] };
    border: 2px solid ${theme.greyscale[ hasIssues ? 'borderElement' : 'componentBg']};
    animation: ${entrance} 0.25s ease-out ${delayFactor}ms forwards;

    &:hover {
      background-color: ${ theme.greyscale[ hasIssues ? 'componentBgHover' : 'componentBg' ] };
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
  ${({ theme, hasIssues }: SprintOptionProps) => css`
    border: 1px solid ${theme[ hasIssues ? 'success' : 'greyscale' ][ hasIssues ? 'borderElementHover' : 'componentBg' ]};
    color: ${ theme[hasIssues ? 'success' : 'greyscale'].textLow };
  `}

  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;

  transition: 
    color 0.25s ease-out,
    border 0.25s ease-out;
`;

const SprintSelection = ({
  boardId,
  setSprint,
}: Props) => {
  const previousBoardId = usePrevious(boardId);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [sprintData, setSprintData] = useState<JiraSprint[] | null>(null);
  const [issueData, setIssueData] = useState<JiraIssueSearchPayload[] | null>(null);
  const { getSprintsForBoard, getIssuesForBoard } = useJira();
  const pointField = useStore(({ preferences }) => preferences?.jiraPreferences?.pointField);

  const handleFetchSprintData = useCallback(async () => {
    if (!boardId) {
      return;
    }

    setIsLoading(true);
    setIsError(false);

    try {
      const sprints = await getSprintsForBoard(boardId);
      setSprintData(sprints.values as JiraSprint[]);
    } catch (error) {
      setIsError(true);
    }

  }, [boardId]);

  const handleFetchIssueData = useCallback(async (startAt = 0) => {
    if (!boardId) {
      return;
    }

    setIsError(false);

    try {
      const issues = await getIssuesForBoard(boardId as string, pointField, startAt);
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
        return handleFetchIssueData(startAt + issues.maxResults);
      }

      setIsLoading(false);
    } catch (error) {
      setIsError(true);
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


  const sprintOptions = useMemo(() => sprintData?.map((sprint, delayFactor) => {
    const issues = issueData?.filter((issue) => issue.fields.sprint?.id === sprint.id) ?? [];
    const hasIssues = !!issues.length;

    const handleSelectSprint = () => {
      setSprint({
        ...sprint,
        issues,
      });
    };

    const issueCount = isLoading ? (
      <LoadingWrapper size={1}>
        <LoadingIcon />
      </LoadingWrapper>
    ) :
      issues.length;

    return (
      <SprintOption
        key={sprint.id}
        hasIssues={hasIssues}
        delayFactor={100 * delayFactor}
        onClick={handleSelectSprint}
      >
        {sprint.name}
        <PointContainer hasIssues={hasIssues}>{issueCount} unpointed ticket{issues.length === 1 ? '' : 's'}</PointContainer>
      </SprintOption>
    );
  }), [sprintData, issueData, isLoading]);

  const loadingIcon = useMemo(
    () => sprintData ? 'Select a sprint' : (
      <LoadingWrapper size={2}><LoadingIcon /></LoadingWrapper>
    ),
    [sprintData],
  );

  return (
    <SelectionWrapper isColumn style={{ height: '100%' }}>
      <SprintInformationWrapper>
        {loadingIcon}
      </SprintInformationWrapper>
      <SprintOptionWrapper>
        {sprintOptions}
      </SprintOptionWrapper>
    </SelectionWrapper>
  );
};

export default SprintSelection;

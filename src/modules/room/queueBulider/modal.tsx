import React, { useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';

import PencilSvg from '@assets/icons/pencil.svg?react';
import UndoSvg from '@assets/icons/undo.svg?react';
import useStore from '@utils/store';
import { JiraBoardPayloadValue, JiraField, JiraSprintWithIssues } from '@modules/integrations/jira/types';
import BoardSelection from '@modules/room/queueBulider/steps/boardSelection';
import SprintSelection from '@modules/room/queueBulider/steps/sprintSelection';
import TicketReview from '@modules/room/queueBulider/steps/ticketReview';
import { ThemedProps } from '@utils/styles/colors/colorSystem';
import { useTickets } from '@modules/room/hooks';
import { useJira } from '@modules/integrations';

type ConfigOptionProps = {
  selectionComplete: boolean;
} & ThemedProps;

const EditIcon = styled(PencilSvg)`
  height: 1.5rem;
  width: 1.5rem;
  
  ${ ({ theme }: ThemedProps) => css`
    > line, path {
      stroke: ${ theme.primary.textLow };
    }
  `}
`;

const UndoIcon = styled(UndoSvg)`
  height: 1rem;
  width: 1rem;
  margin-left: 0.25rem;
  
  ${ ({ theme }: ThemedProps) => css`
    > path, polyline {
      stroke: ${ theme.primary.textLow };
    }
  `}
`;

const ConfigWrapper = styled.div`
  ${({ theme }: ThemedProps) => css`
    background-color: ${ theme.greyscale.componentBg };
    color: ${ theme.primary.textHigh} ;
  `}

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  margin: 0.5rem;
`;

const ConfigOptionWrapper = styled.div`
  display: flex;
  flex: 1;
  width: 50%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;

  > p {
    margin: 0;
    font-size: 1rem;
    ${({ theme }: ThemedProps) => css`
      color: ${ theme.greyscale.textLow };
    `}
  }
`;

const ConfigOption = styled.div<ConfigOptionProps>`
  ${({ selectionComplete, theme }: ConfigOptionProps) => css`
    border: 2px ${selectionComplete ? 'solid' : 'dashed' } ${ theme.greyscale[ selectionComplete ? 'borderElementHover' : 'border'] };

    &:hover {
      background-color: ${ theme.greyscale.componentBgHover };
    }
  `};

  cursor: pointer;
  display: flex;
  width: 100%;
  height: 3rem;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  margin: 0.5rem;

  transition: 
    border 0.25s ease-out,
    background-color 0.25s ease-out;
`;

const RevertWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 1rem;

  > p {
    cursor: pointer;
    margin: 0;
    font-size: 0.75rem;
    ${({ theme }: ThemedProps) => css`
      color: ${ theme.greyscale.textLow };
    `}
  }
`;

const ConfigOptionLabel = styled.p`
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const ConfigOptionEditIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  margin-left: 0.5rem;
`;

const ListContentWrapper = styled.div`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: auto;
`;

const QueueModal = () => {
  const { defaultBoard } = useStore(({ preferences }) => ({
    defaultBoard: preferences?.jiraPreferences?.defaultBoard,
  }));
  const { getPointFieldFromBoardId } = useJira();
  const { queue } = useTickets();
  const [ overrideBoard, setOverrideBoard ] = useState<JiraBoardPayloadValue | null>(null);
  const [ selectedSprint, setSelectedSprint ] = useState<JiraSprintWithIssues | null>(null);
  const [ showOverrideUI, setShowOverrideUI ] = useState<boolean>(false);
  const [ pointField, setPointField ] = useState<JiraField | null>(null);
  const isAnyBoardSelected = useMemo(() => !!defaultBoard || !!overrideBoard, [ defaultBoard, overrideBoard ]);

  const selectionContent = useMemo(() => {
    if ((!isAnyBoardSelected) || showOverrideUI) {
      return (
        <BoardSelection
          defaultBoard={defaultBoard}
          setOverrideBoard={setOverrideBoard}
          showOverrideUI={showOverrideUI}
          setShowOverrideUI={setShowOverrideUI}
        />
      );
    }

    if (!selectedSprint && pointField) {
      return (
        <SprintSelection
          existingQueue={queue}
          boardId={overrideBoard?.id || defaultBoard?.id}
          setSprint={setSelectedSprint}
          pointField={pointField}
        />
      );
    }

    if (selectedSprint?.issues && pointField) {
      return (
        <TicketReview
          existingQueue={queue}
          issues={selectedSprint.issues}
          pointField={pointField}
        />
      );
    }
  }, [ defaultBoard, overrideBoard, showOverrideUI, selectedSprint, pointField ]);

  useEffect(() => {
    if (overrideBoard || defaultBoard) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      getPointFieldFromBoardId(overrideBoard?.id || defaultBoard!.id)
        .then((pointField) => setPointField(pointField ?? null));
    }
  }, [ defaultBoard, overrideBoard ]);

  return (
    <>
      <ConfigWrapper>
        <ConfigOptionWrapper>
          <p>Project Board</p>
          <ConfigOption
            onClick={() => {
              setShowOverrideUI(true);
              setOverrideBoard(null);
              setSelectedSprint(null);
            }}
            selectionComplete={(isAnyBoardSelected) && !showOverrideUI}
          >
            <ConfigOptionLabel>
              {(showOverrideUI || (!isAnyBoardSelected)) ? 'Pending board selection' : overrideBoard?.name ?? defaultBoard?.name}
            </ConfigOptionLabel>
            <ConfigOptionEditIcon>
              <EditIcon />
            </ConfigOptionEditIcon>
          </ConfigOption>
          <RevertWrapper>
            {overrideBoard && defaultBoard && (
              <p
                onClick={
                  () => {
                    setOverrideBoard(null);
                    setSelectedSprint(null);
                  }
                }
              >
                Revert to default board
                <UndoIcon />
              </p>
            )}
          </RevertWrapper>
        </ConfigOptionWrapper>
        <ConfigOptionWrapper>
          <p>Sprint</p>
          <ConfigOption
            onClick={() => setSelectedSprint(null)}
            selectionComplete={!!selectedSprint}
          >
            <ConfigOptionLabel>
              {selectedSprint?.name ?? 'Pending sprint selection'}
            </ConfigOptionLabel>
            <ConfigOptionEditIcon>
              <EditIcon
                onClick={() => {
                  setSelectedSprint(null);
                }}
              />
            </ConfigOptionEditIcon>
          </ConfigOption>
          <RevertWrapper />
        </ConfigOptionWrapper>
      </ConfigWrapper>
      <ListContentWrapper>
        {selectionContent}
      </ListContentWrapper>
    </>
  );
};

export default QueueModal;

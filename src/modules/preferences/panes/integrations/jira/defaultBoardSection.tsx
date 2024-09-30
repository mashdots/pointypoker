import React from 'react';
import styled, { css } from 'styled-components';

import PlusIcon from '@assets/icons/plus.svg?react';
import BoardImage from '@assets/icons/article.svg?react';
import OptionPicker from '@modules/preferences/panes/integrations/jira/optionPicker';
import useStore from '@utils/store';
import { ThemedProps } from '@utils/styles/colors/colorSystem';
import { useJira } from '@modules/integrations';
import { JiraBoardPayloadValue } from '@modules/integrations/jira/types';
import { Control, Description, Label, SelectedOptionWrapper, SetupPrefWrapper } from '@modules/preferences/panes/integrations/jira/commonComponents';

const CloseIcon = styled(PlusIcon)`
  cursor: pointer;
  height: 1.5rem;
  width: 1.5rem;
  margin-left: 0.25rem;
  transform: rotate(45deg);
  
  ${({ theme }: ThemedProps) => css`
    > line {
      stroke: ${theme.primary.accent11};
    }
  `}
`;

const BoardIcon = styled(BoardImage)`
  margin-right: 0.25rem;
  margin-left: 0rem;
  width: 1.5rem;
    
  ${ ({ theme }: ThemedProps) => css`
    > line {
      stroke: ${theme.primary.accent12};
    }

    > rect {
      stroke: ${theme.primary.accent11};
    }
  `}
`;

const DefaultBoardSection = () => {
  const { defaultBoard, clearDefaultBoard, setDefaultBoard } = useStore(({ preferences, setPreferences }) => ({
    defaultBoard: preferences?.jiraPreferences?.defaultBoard,
    clearDefaultBoard: () => setPreferences('jiraPreferences', { ...preferences?.jiraPreferences, defaultBoard: null }),
    setDefaultBoard: (board: JiraBoardPayloadValue) => setPreferences('jiraPreferences', { ...preferences?.jiraPreferences, defaultBoard: board }),
  }));
  const { getBoards } = useJira();
  const transformer = (boards: JiraBoardPayloadValue[]) => boards.map(
    (board) => ({ id: board.id, name: board.name, selectValue: board, shortDesc: `(${board.id})` }),
  );

  const picker = !defaultBoard?.name
    ? (
      <OptionPicker
        idPrefix='board'
        placeholder='Search for a board'
        fetchFn={getBoards}
        storeUpdateFn={setDefaultBoard}
        transformFn={transformer}
      />
    )
    : (
      <SelectedOptionWrapper>
        {defaultBoard.name} <CloseIcon onClick={() => clearDefaultBoard()} />
      </SelectedOptionWrapper>
    );

  return (
    <SetupPrefWrapper>
      <Label>
        <BoardIcon /> Default Board
      </Label>
      <Description>
        The board typically associated with your team&apos;s work.
      </Description>
      <Control>
        {picker}
      </Control>
    </SetupPrefWrapper>
  );
};

export default DefaultBoardSection;

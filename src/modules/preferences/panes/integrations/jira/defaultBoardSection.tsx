import React from 'react';

import { useJira } from '@modules/integrations';
import { JiraBoardPayloadValue } from '@modules/integrations/jira/types';
import OptionPicker from '@modules/preferences/panes/integrations/jira/optionPicker';
import useStore from '@utils/store';

import {
  BoardIcon,
  CloseIcon,
  Control,
  Description,
  Label,
  SelectedOptionWrapper,
  SetupPrefWrapper,
} from './components';

const DefaultBoardSection = () => {
  const {
    defaultBoard,
    clearDefaultBoard,
    setDefaultBoard,
  } = useStore(({ preferences, setPreferences }) => ({
    clearDefaultBoard: () => setPreferences('jiraPreferences', {
      ...preferences?.jiraPreferences,
      defaultBoard: null,
    }),
    defaultBoard: preferences?.jiraPreferences?.defaultBoard,
    setDefaultBoard: (board: JiraBoardPayloadValue) => setPreferences('jiraPreferences', {
      ...preferences?.jiraPreferences,
      defaultBoard: board,
    }),
  }));
  const { getBoards } = useJira();
  const transformer = (boards: JiraBoardPayloadValue[]) => boards.map((board) => ({
    id: board.id,
    name: board.name,
    selectValue: board,
    shortDesc: `(${board.id})`,
  }));

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

import React from 'react';

import { SectionWrapper } from './common';
import { useJira } from '@modules/integrations';
import OptionPicker from '@modules/preferences/panes/integrations/jira/optionPicker';
import { JiraBoardPayloadValue } from '@modules/integrations/jira/types';
import useStore from '@utils/store';

type Props = {
  defaultBoard?: JiraBoardPayloadValue | null;
  setOverrideBoard: (board: JiraBoardPayloadValue | null) => void;
  showOverrideUI: boolean;
  setShowOverrideUI: (show: boolean) => void;
}

const BoardSelection = ({
  defaultBoard,
  setOverrideBoard,
  showOverrideUI,
  setShowOverrideUI,
}: Props) => {
  const { getBoards } = useJira();
  const setDefaultBoard = useStore(
    ({ preferences, setPreferences }) =>
      (board: JiraBoardPayloadValue) => setPreferences(
        'jiraPreferences',
        { ...preferences?.jiraPreferences, defaultBoard: board },
      ),
  );
  const boardOptionsTransformer = (boards: JiraBoardPayloadValue[]) => boards.map(
    (board) => ({ id: board.id, name: board.name, selectValue: board, shortDesc: `(${ board.id })` }),
  );

  const handleUpdateBoard = (board: JiraBoardPayloadValue) => {
    if (!defaultBoard) {
      setDefaultBoard(board);
    } else if (board.id !== defaultBoard.id) {
      setOverrideBoard(board);
    }
    setShowOverrideUI(false);
  };

  return defaultBoard && !showOverrideUI ? null : (
    <SectionWrapper>
      Select a board
      <div style={{ display: 'flex', width: '80%' }}>
        <OptionPicker
          idPrefix='board'
          placeholder='Search for a board'
          fetchFn={getBoards}
          storeUpdateFn={handleUpdateBoard}
          transformFn={boardOptionsTransformer}
        />
      </div>
    </SectionWrapper>
  );
};

export default BoardSelection;

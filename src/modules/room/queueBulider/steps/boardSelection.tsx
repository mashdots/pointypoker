import React from 'react';

import { SelectionWrapper } from './common';
import { useJira } from '@modules/integrations';
import OptionPicker from '@modules/preferences/panes/integrations/jira/optionPicker';
import { JiraBoardPayloadValue } from '@modules/integrations/jira/types';

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
  const boardOptionsTransformer = (boards: JiraBoardPayloadValue[]) => boards.map(
    (board) => ({ id: board.id, name: board.name, selectValue: board, shortDesc: `(${ board.id })` }),
  );

  return defaultBoard && !showOverrideUI ? null : (
    <SelectionWrapper isColumn>
      Select a board
      <div style={{ display: 'flex', width: '80%' }}>
        <OptionPicker
          idPrefix='board'
          placeholder='Search for a board'
          fetchFn={getBoards}
          storeUpdateFn={(board) => {
            if (board.id !== defaultBoard?.id) {
              setOverrideBoard(board);
            }
            setShowOverrideUI(false);
          }}
          transformFn={boardOptionsTransformer}
        />
      </div>
    </SelectionWrapper>
  );
};

export default BoardSelection;

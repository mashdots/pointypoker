import { useJira } from '@modules/integrations';
import { JiraBoardPayloadValue } from '@modules/integrations/jira/types';
import OptionPicker from '@modules/preferences/panes/integrations/jira/optionPicker';
import useStore from '@utils/store';

import { SectionWrapper } from './common';

type Props = {
  defaultBoard?: JiraBoardPayloadValue | null;
  setOverrideBoard: (board: JiraBoardPayloadValue | null) => void;
  showOverrideUI: boolean;
  setShowOverrideUI: (show: boolean) => void;
};

const BoardSelection = ({
  defaultBoard,
  setOverrideBoard,
  showOverrideUI,
  setShowOverrideUI,
}: Props) => {
  const { getBoards } = useJira();
  const setDefaultBoard = useStore(({ preferences, setPreference }) =>
    (board: JiraBoardPayloadValue) => setPreference('jiraPreferences', {
      ...preferences?.jiraPreferences,
      defaultBoard: board,
    }));
  const boardOptionsTransformer = (boards: JiraBoardPayloadValue[]) => boards.map((board) => ({
    id: board.id,
    name: board.name,
    selectValue: board,
    shortDesc: `(${ board.id })`,
  }));

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
      <h2>Select a board</h2>
      <div style={{
        display: 'flex',
        width: '80%',
      }}>
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

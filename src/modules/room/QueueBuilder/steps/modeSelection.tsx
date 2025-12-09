import React from 'react';

export type ImportModeSelection = 'sprint' | 'jql';

type Props = {
  handleModeSelection: (selection: ImportModeSelection) => void;
};

const ModeSelection = ({ handleModeSelection }: Props) => {
  return (
    <div>
      <button onClick={() => handleModeSelection('sprint')}>Sprint</button>
      <button onClick={() => handleModeSelection('jql')}>JQL</button>
    </div>
  );
};

export default ModeSelection;

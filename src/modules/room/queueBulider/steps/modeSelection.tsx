import { SectionWrapper } from '@modules/room/queueBulider/steps/common';
import React from 'react';

export enum ImportModeSelection {
  SPRINT,
  EPIC,
}

type Props = {
  handleModeSelection: (mode: ImportModeSelection) => void;
};

const ModeSelection = ({ handleModeSelection }: Props) => {
  return <SectionWrapper>Mode Selection</SectionWrapper>;
};

export default ModeSelection;

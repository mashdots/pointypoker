import React from 'react';
import styled, { css } from 'styled-components';

import PlusIcon from '@assets/icons/plus.svg?react';
import DefaultBoardPicker from '@modules/preferences/panes/integrations/jira/defaultBoardPicker';
import useStore from '@utils/store';
import { ThemedProps } from '@utils/styles/colors/colorSystem';

const Label = styled.label`
  display: flex;
  margin-bottom: 0.5rem;
`;

const Control = styled.span`
  display: flex;
  align-items: center;
`;

const CloseIcon = styled(PlusIcon)`
  cursor: pointer;
  height: 1.5rem;
  width: 1.5rem;
  margin-left: 0.25rem;
  transform: rotate(45deg);
  
  > line {
    transition: stroke 300ms;
    stroke: ${ ({ theme }: ThemedProps) => theme.primary.textLow };
  }
`;

const DefaultBoardWrapper = styled.div`
  ${({ theme }: ThemedProps) => css`
  background-color: ${theme.greyscale.bgAlt};
    color: ${theme.primary.textHigh};
  `}

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0;
  width: 100%;
  border-radius: 0.5rem;
`;

const DefaultBoardSection = () => {
  const { defaultBoard, clearDefaultBoard } = useStore(({ preferences, setPreferences }) => ({
    defaultBoard: preferences?.jiraPreferences?.defaultBoard,
    clearDefaultBoard: () => setPreferences('jiraPreferences', { ...preferences?.jiraPreferences, defaultBoard: null }),
  }));

  const picker = !defaultBoard?.name
    ? <DefaultBoardPicker />
    : (
      <DefaultBoardWrapper>
        {defaultBoard.name} <CloseIcon onClick={() => clearDefaultBoard()} />
      </DefaultBoardWrapper>
    );

  return (
    <>
      <Label>
        Default Board
      </Label>
      <Control>
        {picker}
      </Control>
    </>
  );
};

export default DefaultBoardSection;

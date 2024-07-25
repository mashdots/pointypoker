import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { TextInput } from '@components/common';
import { useJira } from '@modules/integrations';
import { JiraBoardPayloadValue } from '@modules/integrations/jira';
import styled, { css } from 'styled-components';
import useStore from '@utils/store';
import { ThemedProps } from '@utils/styles/colors/colorSystem';

type OptionsProps = {
  boards: JiraBoardPayloadValue[];
  showIsLast: boolean;
  showError: boolean;
  isLoading: boolean;
}

const OptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 0;
  width: 100%;
`;

const OptionItem = styled.div`
  ${({ theme }: ThemedProps) => css`
    background-color: ${ theme.greyscale.componentBg };
  `}

  cursor: pointer;
  padding: 0.5rem 1rem;
  width: 90%;
  transition: all 200ms;
  border-radius: 0.5rem;
  margin-bottom: 0.25rem;
  
  :hover {
    ${({ theme }: ThemedProps) => css`
      background-color: ${theme.primary.componentBgHover};
    `}
  }
`;

const StatusItem = styled.div`
  ${({ theme }: ThemedProps) => css`
    color: ${theme.greyscale.textLow};
  `}

  padding: 0.5rem 2rem;
  width: 80%;
`;

const Options = ({ boards, showIsLast, showError, isLoading }: OptionsProps) => {
  const setDefaultBoard = useStore(
    ({ preferences, setPreferences }) => (board: JiraBoardPayloadValue) => setPreferences('jiraPreferences', { ...preferences?.jiraPreferences, defaultBoard: board }),
  );
  let tailElement = null;

  if (isLoading) {
    tailElement = <StatusItem key='tail'>Loading...</StatusItem>;
  } else if (showError) {
    tailElement = <StatusItem key='tail'>Error fetching boards</StatusItem>;
  } else if (showIsLast && boards.length < 5) {
    tailElement = <StatusItem key='tail'>No more boards</StatusItem>;
  }

  return (
    <OptionWrapper>
      {boards.slice(0, 5).map((board) => (
        <OptionItem key={board.id} onClick={() => setDefaultBoard(board)}>
          {board.name}
        </OptionItem>
      ))}
      {tailElement}
    </OptionWrapper>
  );
};

let timeout: number;

const DefaultBoardPicker = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [startAt, setStartAt] = useState(0);
  const [isLast, setIsLast] = useState(false);
  const [boards, setBoards] = useState<Array<JiraBoardPayloadValue>>([]);
  const [filter, setFilter] = useState('');
  const { getAllBoards } = useJira();

  const fetchBoards = useCallback(async () => {
    setIsError(false);
    setIsLoading(true);

    try {
      const response = await getAllBoards(startAt, 50);
      const uniqueBoards = response.values.filter((board) => !boards.some((b) => b.id === board.id));

      setStartAt(response.startAt + response.maxResults);
      setIsLast(response.isLast);
      setBoards((prevBoards) => [ ...prevBoards, ...uniqueBoards ]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
    }
  }, [startAt]);

  const filteredBoards = useMemo(() => {
    if (!filter) {
      return [];
    }

    return boards.filter((board) => board.name.toLowerCase().includes(filter.toLowerCase()));
  }, [boards, filter]);

  useEffect(() => {
    clearTimeout(timeout);

    if (filter && filteredBoards.length < 5 && !isLoading && !isLast) {
      timeout = setTimeout(() => {
        fetchBoards();
      }, 500);
    }
  }, [filter, filteredBoards, isLoading, isLast]);

  return (
    <OptionWrapper >
      <TextInput
        id='default-board-picker'
        alignment='left'
        placeHolder="Search for a board"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        size='small'
        collapse
      />
      <Options
        boards={filteredBoards}
        showIsLast={isLast}
        showError={isError}
        isLoading={isLoading}
      />
    </OptionWrapper>
  );
};

export default DefaultBoardPicker;

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { TextInput } from '@components/common';
import styled, { css } from 'styled-components';
import { ThemedProps } from '@utils/styles/colors/colorSystem';
import { usePrevious } from '@utils';

export type OptionType = {
  id: string | number;
  name: string;
  shortDesc?: string;
  selectValue: any;
}

type OptionsProps = {
  options: OptionType[];
  showError: boolean;
  isLoading: boolean;
  handleStoreUpdate: (value: any) => void;
}

type Props = {
  idPrefix: string;
  placeholder: string;
  fetchFn: (maxResults: number, search?: string) => Promise<any>;
  storeUpdateFn: (value: any) => void;
  transformFn: (value: Array<any>) => OptionType[];
  filterFromNameStart?: boolean;
}

const OptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 0;
  width: 100%;
`;

const OptionItem = styled.div`
  ${ ({ theme }: ThemedProps) => css`
    background-color: ${ theme.greyscale.accent3 };
  `}

  cursor: pointer;
  display: flex;
  align-items: baseline;
  padding: 0.5rem 1rem;
  width: 90%;
  transition: all 200ms;
  border-radius: 0.5rem;
  margin-bottom: 0.25rem;
  
  > span {
    ${({ theme }: ThemedProps) => css`
      color: ${ theme.greyscale.accent11 };
    `}

    font-size: 0.8rem;
    margin-left: 0.5rem;
  }
  
  :hover {
    ${ ({ theme }: ThemedProps) => css`
      background-color: ${ theme.primary.accent4 };
    `}
  }
`;

const StatusItem = styled.div`
  ${ ({ theme }: ThemedProps) => css`
    color: ${ theme.greyscale.accent11 };
  `}

  padding: 0.5rem 2rem;
  width: 80%;
`;

const Options = ({ options, showError, isLoading, handleStoreUpdate }: OptionsProps) => {
  const wasLoading = usePrevious(isLoading);
  let tailElement = null;

  if (isLoading) {
    tailElement = <StatusItem key='tail'>Loading...</StatusItem>;
  } else if (showError) {
    tailElement = <StatusItem key='tail'>Error fetching data</StatusItem>;
  } else if (wasLoading && options.length < 5) {
    tailElement = <StatusItem key='tail'>No more results</StatusItem>;
  }

  return (
    <OptionWrapper>
      {options.slice(0, 5).map(({ id, name, selectValue, shortDesc }) => (
        <OptionItem key={id} onClick={() => handleStoreUpdate(selectValue)}>
          {name}
          <span>{shortDesc}</span>
        </OptionItem>
      ))}
      {tailElement}
    </OptionWrapper>
  );
};

let timeout: number;

const OptionPicker = ({
  idPrefix,
  fetchFn,
  placeholder,
  storeUpdateFn,
  transformFn,
  filterFromNameStart = false,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [items, setItems] = useState<Array<any>>([]);
  const [filter, setFilter] = useState('');

  const fetchData = useCallback(async () => {
    setIsError(false);
    setIsLoading(true);

    try {
      const response = await fetchFn(5, filter);
      setItems(response.values);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
    }
  }, [ filter ]);

  const filteredData = useMemo(() => {
    if (!filter) {
      return [];
    }

    return transformFn(items).filter(
      ({ name }) => {
        if (filterFromNameStart) {
          return name.toLowerCase().startsWith(filter.toLowerCase());
        }

        return name.toLowerCase().includes(filter.toLowerCase());
      });
  }, [ items, filter, filterFromNameStart ]);

  useEffect(() => {
    clearTimeout(timeout);

    if (filter) {
      timeout = setTimeout(
        () => {
          fetchData();
        },
        500,
      );
    }
  }, [filter]);

  return (
    <OptionWrapper>
      <TextInput
        id={`${idPrefix}-option-picker`}
        alignment='left'
        placeHolder={placeholder}
        value={filter}
        onChange={setFilter}
        size='small'
        collapse
      />
      <Options
        options={filteredData}
        showError={isError}
        isLoading={isLoading}
        handleStoreUpdate={storeUpdateFn}
      />
    </OptionWrapper>
  );
};

export default OptionPicker;

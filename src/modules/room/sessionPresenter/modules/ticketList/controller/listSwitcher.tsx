import React, { useState } from 'react';
import styled, { css } from 'styled-components';

import type { Props as ControllerProps } from '.';
import { ThemedProps } from '@utils/styles/colors/colorSystem';
import { SelectionContainer } from '@components/common';

type Props = Omit<ControllerProps, 'setSearch'>;

type OptionProps = {
  isCurrentTab: boolean;
  isFirst: boolean;
  isLast: boolean;
  onClick: () => void;
}

const OptionWrapper = styled.button<OptionProps>`
  ${({ isCurrentTab, isFirst, isLast, theme }: ThemedProps & OptionProps) => css`
    color: ${theme.greyscale[isCurrentTab ? 'accent12' : 'accent9']};
    padding-left: ${isFirst ? 0.5 : 0}rem;
    padding-right: ${isLast ? 0.5 : 0}rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  `}

  background-color: transparent;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 2.5rem;
  width: 5.5rem;
  transition: color 250ms ease-out;
  z-index: 1;
`;

const Indicator = styled.div<{ leftOffset: number }>`
  ${({ leftOffset, theme }: ThemedProps & { leftOffset: number }) => css`
    background-color: ${theme.greyscale.accent5};
    left: ${(leftOffset * 5) + 0.5}rem;
    border: 1px solid ${theme.greyscale.accent6};
    box-shadow: 0 0 0.25rem ${ theme.greyscale.accent1 };
  `}

  border-radius: 0.375rem;
  height: 0.5rem;
  position: absolute;
  transition: left 250ms ease-out;
  height: 1.75rem;
  top: 0.375rem;
  width: 5rem;
`;

function ListSwitcher({ setTab, selectedTab, tabs: tabOptions }: Props) {
  const [ currentTabIndex, setCurrentTabIndex ] = useState(0);

  return (
    <SelectionContainer>
      {tabOptions.map((tab, i) => (
        <OptionWrapper
          key={tab}
          aria-label={`View ticket ${ tab }`}
          isCurrentTab={tab === selectedTab}
          isFirst={i === 0}
          isLast={i === tabOptions.length - 1}
          onClick={() => {
            setCurrentTabIndex(i);
            setTab(tab);
          } }
        >
          {tab}
        </OptionWrapper>
      ))}
      <Indicator leftOffset={currentTabIndex} />
    </SelectionContainer>
  );
}

export default ListSwitcher;

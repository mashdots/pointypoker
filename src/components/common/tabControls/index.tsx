import React from 'react';
import styled, { css } from 'styled-components';

import { ThemedProps } from '@utils/styles/colors/colorSystem';

import DetachedTabs from './detachedTabs';
import Tabs from './tabs';

export type Tab = {
  title?: string;
  icon?: JSX.Element;
  disabled?: boolean;
}

export type SubComponentProps = {
  direction?: 'row' | 'column';
  display?: 'icon' | 'title' | 'all'
  onSetTab: (index: number) => void;
  selectedTab: number;
  stretch?: boolean;
  tabs: Tab[];
}

type Props = {
  style?: 'detached' | 'tabs';
} & SubComponentProps;

type OptionProps = {
  isCurrentTab: boolean;
  isFirst: boolean;
  isLast: boolean;
  onClick: () => void;
}

const List = styled.div`
  display: flex;
`;

const Option = styled.button<OptionProps>`
  ${ ({ isCurrentTab, isFirst, isLast, theme }: ThemedProps & OptionProps) => css`
    color: ${ theme.greyscale[ isCurrentTab ? 'accent12' : 'accent9' ] };
    padding-left: ${ isFirst ? 0.5 : 0 }rem;
    padding-right: ${ isLast ? 0.5 : 0 }rem;
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
  ${ ({ leftOffset, theme }: ThemedProps & { leftOffset: number }) => css`
    background-color: ${ theme.greyscale.accent5 };
    left: ${ (leftOffset * 5) + 0.5 }rem;
    border: 1px solid ${ theme.greyscale.accent6 };
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

const TabControls = ({
  direction = 'row',
  display = 'all',
  onSetTab,
  selectedTab,
  stretch,
  style = 'tabs',
  tabs,
}: Props) => {
  // useEffect(() => {
  //   const container = indicatorRef.current;

  //   if (activeTabIndex && container) {
  //     const activeTabElement = activeRef.current;

  //     if (activeTabElement) {
  //       const { offsetLeft, offsetWidth } = activeTabElement;

  //       const clipLeft = offsetLeft;
  //       const clipRight = offsetLeft + offsetWidth;
  //       container.style.clipPath = `inset(0 ${ Number(100 - (clipRight / container.offsetWidth) * 100).toFixed() }% 0 ${ Number((clipLeft / container.offsetWidth) * 100).toFixed() }% round 17px)`;
  //     }
  //   }
  // }, [ activeTabIndex, activeRef, indicatorRef ]);

  if (style === 'detached') {
    return (
      <DetachedTabs
        direction={direction}
        display={display}
        onSetTab={onSetTab}
        selectedTab={selectedTab}
        stretch={stretch}
        tabs={tabs}
      />
    );
  }

  // return (
  //   <SelectionContainer>
  //     {tabs.map((tab, index) => (
  //       <Option
  //         key={tab.title}
  //         onClick={() => {
  //           onSetTab(index);
  //           setActiveTabIndex(index);
  //         }}
  //         isCurrentTab={index === selectedTab}
  //         isFirst={index === 0}
  //         isLast={index === tabs.length - 1}
  //       >
  //         {tab?.icon}
  //         {tab.title}
  //       </Option>
  //     ))}
  //   </SelectionContainer>
  // );
  return (
    <Tabs
      direction={direction}
      display={display}
      onSetTab={onSetTab}
      selectedTab={selectedTab}
      stretch={stretch}
      tabs={tabs}
    />
  );
};

export default TabControls;

import React from 'react';
import styled, { css } from 'styled-components';
import { div as IndicatorBase } from 'motion/react-client';

import { Theme, ThemedProps } from '@utils/styles/colors/colorSystem';

export type Tab = {
  title?: string;
  icon?: JSX.Element;
  disabled?: boolean;
  disabledMessage?: string;
}

type Props = {
  controllerId: string;
  direction?: 'row' | 'column';
  display?: 'icon' | 'title' | 'all'
  onSetTab: (index: number) => void;
  selectedTab: number;
  stretch?: boolean;
  tabs: Tab[];
  themeOverride?: keyof Theme,
}


const Wrapper = styled.div<Partial<Props & TabProps>>`
  ${({ stretch }: Partial<Props & TabProps> & ThemedProps) => css`
    width: ${ stretch ? '100%' : 'auto' };
  `}

  display: flex;
`;

type TabProps = {
  onClick: () => void;
  indicatorId: string;
  isSelected: boolean;
} & Tab & Pick<Props, 'direction' | 'display' | 'themeOverride'>;

const TabsContainer = styled.div<Partial<Props & TabProps>>`
  ${({ direction, stretch }: Partial<Props & TabProps> & ThemedProps) => css`
    flex-direction: ${ direction || 'row' };
    justify-content: ${ stretch ? 'space-around' : 'flex-start' };
    width: ${ stretch ? '100%' : 'auto' };
  `}

  display: flex;
`;

const TabWrapper = styled.button<Partial<TabProps>>`
  :disabled {
    cursor: not-allowed !important;
  }

  :hover:not(:disabled) {
    ${({ isSelected, theme, themeOverride }: Partial<TabProps> & ThemedProps) => !isSelected ? css`
      background-color: ${theme[themeOverride || 'greyscale'].accent5};
      cursor: pointer;
    ` : css`
      cursor: default !important;
    `}
  }

  display: flex;
  flex-direction: 'column';
  align-items: center;
  position: relative;

  border-radius: 0.5rem;
  padding: 0.35rem 0.5rem;
  border: none;
  background-color: transparent;
  transition: background-color 300ms ease-out;
`;

const Indicator = styled(IndicatorBase)<Partial<TabProps>>`
  ${({ theme }: ThemedProps & Partial<TabProps>) => css`
    background-color: ${theme.info.accent11};
  `}

  ${({ direction }: Partial<TabProps>) => direction === 'column' ?
    css`
      height: 100%;
      width: 1px;
      right: -0.25rem;
      top: 0;
    ` :
    css`
      height: 1px;
      width: 100%;
      left: 0;
      bottom: -0.125rem;
    `}

  position: absolute;
`;

const IconContainer = styled.div<Partial<TabProps>>`
  ${({ isSelected, theme }: Partial<TabProps> & ThemedProps) => css`
    svg > path, svg > circle, svg > line {
      stroke: ${ isSelected ? theme.info.accent11 : theme.greyscale.accent10 };
      transition: all 300ms ease-out;
    }
  `}

  display: flex;
  margin-right: 0.5rem;
`;

const Title = styled.h3<Partial<TabProps>>`
  ${({ isSelected, theme }: Partial<TabProps> & ThemedProps) => css`
    color: ${ isSelected ? theme.greyscale.accent12 : theme.greyscale.accent10 };
    transition: color 300ms ease-out;
  `}

  padding: 0 2px;
  display: flex;
  font-weight: 600;
  margin: 0;
`;

const Tab = ({
  disabled,
  disabledMessage,
  direction,
  display,
  icon,
  indicatorId,
  isSelected,
  onClick,
  title,
  themeOverride,
}: TabProps): JSX.Element => {
  const shouldShowIcon = display === 'icon' || display === 'all';
  const shouldShowTitle = display === 'title' || display === 'all';

  const iconElement = shouldShowIcon ? <IconContainer isSelected={isSelected}>{icon}</IconContainer> : null;
  const titleElement = shouldShowTitle ? <Title isSelected={isSelected}>{title}</Title> : null;

  return (
    <TabWrapper
      title={disabled ? disabledMessage : title}
      disabled={disabled}
      direction={direction}
      isSelected={isSelected}
      onClick={onClick}
      style={{ cursor: 'pointer', pointerEvents: 'auto' }}
      themeOverride={themeOverride}
    >
      {isSelected ? <Indicator layout direction={direction} layoutId={indicatorId} id={indicatorId} /> : null}
      {iconElement}
      {titleElement}
    </TabWrapper>
  );
};

const Tabs = ({
  controllerId,
  direction = 'row',
  display = 'all',
  onSetTab,
  selectedTab,
  stretch,
  tabs,
  themeOverride,
}: Props) => {
  if (!tabs || !tabs.length) {
    console.warn('No tabs provided');
    return null;
  }

  return (
    <Wrapper stretch={stretch}>
      <TabsContainer direction={direction} stretch={stretch}>
        {tabs.map((t, i) => (
          <Tab
            indicatorId={controllerId}
            key={i}
            direction={direction}
            display={display}
            isSelected={selectedTab === i}
            onClick={() => onSetTab(i)}
            themeOverride={themeOverride}
            {...t}
          />
        ))}
      </TabsContainer>
    </Wrapper>
  );
};

export default Tabs;

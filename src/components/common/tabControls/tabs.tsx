import React from 'react';
import styled, { css } from 'styled-components';
import { div as IndicatorBase } from 'motion/react-client';

import { ThemedProps } from '@utils/styles/colors/colorSystem';

import type { SubComponentProps, Tab } from '../tabControls';

const Wrapper = styled.div<Partial<SubComponentProps & TabProps>>`
  ${({ stretch }: Partial<SubComponentProps & TabProps> & ThemedProps) => css`
    width: ${ stretch ? '100%' : 'auto' };
  `}
`;

type TabProps = {
  onClick: () => void;
  isSelected: boolean;
} & Tab & Pick<SubComponentProps, 'direction' | 'display'>;

const TabsContainer = styled.div<Partial<SubComponentProps & TabProps>>`
  ${({ direction, stretch }: Partial<SubComponentProps & TabProps> & ThemedProps) => css`
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
    ${({ theme }: Partial<TabProps> & ThemedProps) => css`
      background-color: ${theme.greyscale.accent5};
    `}
  }

  display: flex;
  flex-direction: 'column';
  position: relative;

  border-radius: 0.5rem;
  padding: 0.375rem 0.5rem;
  margin-top: -0.375rem;
  border: none;
  background-color: transparent;
  transition: background-color 300ms ease-out;
`;

const Indicator = styled(IndicatorBase)`
  ${({ theme }: ThemedProps) => css`
    background-color: ${theme.info.accent11};
  `}

  height: 1px;
  position: absolute;
  left: 0;
  top: -0.125rem;
  width: 100%;
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

  font-weight: 600;
`;

const Tab = ({ disabled, direction, display, icon, isSelected, onClick, title }: TabProps): JSX.Element => {
  const shouldShowIcon = display === 'icon' || display === 'all';
  const shouldShowTitle = display === 'title' || display === 'all';

  const iconElement = shouldShowIcon ? <IconContainer isSelected={isSelected}>{icon}</IconContainer> : null;
  const titleElement = shouldShowTitle ? <Title isSelected={isSelected}>{title}</Title> : null;

  return (
    <TabWrapper title={disabled ? 'you can\'t vote while in observer mode' : ''} disabled={disabled} direction={direction} onClick={onClick} style={{ cursor: 'pointer', pointerEvents: 'auto' }}>
      {isSelected ? <Indicator layoutId='indicator' /> : null}
      {shouldShowIcon ? iconElement : null}
      {shouldShowTitle ? titleElement : null}
    </TabWrapper>
  );
};

const Tabs = ({
  direction,
  display,
  onSetTab,
  selectedTab,
  stretch,
  tabs,
}: SubComponentProps) => {
  return (
    <Wrapper stretch={stretch}>
      <TabsContainer direction={direction} stretch={stretch}>
        {tabs.map((t, i) => (
          <Tab
            key={i}
            direction={direction}
            display={display}
            isSelected={selectedTab === i}
            onClick={() => onSetTab(i)}
            {...t}
          />
        ))}
      </TabsContainer>
    </Wrapper>
  );
};

export default Tabs;

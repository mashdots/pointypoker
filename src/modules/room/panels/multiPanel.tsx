import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';

import debounce from 'lodash/debounce';
import styled, { css } from 'styled-components';

import { ThemedProps } from '@utils/styles/colors/colorSystem';

type Props = {
  panels: Panel[];
  forcePanelChange?: number | null;
};

type Panel = {
  title: string;
  component: JSX.Element;
  shouldScroll?: boolean;
};

type TitleProps = ThemedProps & {
  isSelected: boolean;
  isSelectable: boolean;
};

type SelectorProps = {
  width: number;
  position?: number;
};

type PanelWrapperProps = SelectorProps & {
  height?: number;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 0.5rem;
  width: 100%;
  height: 100%;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  overflow: auto;
  margin-bottom: 0.5rem;
`;

const Title = styled.h2<TitleProps>`
  ${({
    isSelectable, isSelected, theme,
  }: TitleProps) => css`
    border-bottom: 1px solid ${ isSelected ? theme.primary.accent7 : 'transparent'};
    color: ${ theme.primary.accent11 };
    cursor: ${ isSelectable ? 'pointer' : 'default' };

    &:hover {
      color: ${ isSelectable ? theme.primary.accent12 : theme.primary.accent11 };
    }
  `}

  display: flex;
  text-wrap: nowrap;
  font-size: 1.25rem;
  margin: 0 1rem 0 0;
  transition: all 0.3s ease-in-out;
`;

const WidthHeightWithFallback = styled.div<PanelWrapperProps>`
  ${({ height, width }) => css`
    height ${height ? `${height}px` : '100%'};
    width ${width ? `${width}px` : '100%'};
  `}
`;

const PanelContainer = styled(WidthHeightWithFallback)<PanelWrapperProps>`
  ${({ width }: PanelWrapperProps) => css`
    width: ${ width }px;
  `}

  flex: 1;
  position: relative;
  overflow: hidden;
`;

const PanelController = styled(WidthHeightWithFallback)<PanelWrapperProps>`
  ${({ position = 0 }: PanelWrapperProps) => css`
    left: ${-position * 100}%;
  `}

  display: flex;
  position: absolute;
  flex-direction: row;
  justify-content: flex-start;

  transition: left 0.3s ease-in-out;
`;

const PanelWrapper = styled(WidthHeightWithFallback)`
  display: flex;
`;

const PANEL_FIXTURES = [
  {
    component: <div>Panel 1</div>,
    title: 'panel 1',
  },
  {
    component: <div>Panel 2</div>,
    title: 'panel 2',
  },
];

const MultiPanel = ({ panels = PANEL_FIXTURES, forcePanelChange }: Props) => {
  const [
    width,
    setWidth,
  ] = useState(0);
  const [
    selectedPanel,
    setSelectedPanel,
  ] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const titles = panels.map((panel, i) => {
    const isSelectable = panels.length > 1 && selectedPanel !== i;
    return (
      <Title
        key={i}
        isSelected={selectedPanel === i}
        onClick={() => {
          setSelectedPanel(i);
        }}
        isSelectable={isSelectable}
      >
        {panel.title}
      </Title>
    );
  });

  const panelComponents = useMemo(
    () => panels.map((panel, i) => {
      return (
        <PanelWrapper width={width} key={i}>{panel.component}</PanelWrapper>
      );
    }),
    [
      panels,
      width,
    ],
  );

  const handleSetWidth = debounce(
    (element) => {
      const computedWrapperStyle = getComputedStyle(element);

      let finalWidth = parseFloat(computedWrapperStyle.width);
      finalWidth -= (parseFloat(computedWrapperStyle.paddingLeft) + parseFloat(computedWrapperStyle.paddingRight));

      setWidth(finalWidth);
    },
    500,
  );

  useEffect(() => {
    if (!wrapperRef.current) return;
    handleSetWidth(wrapperRef.current);
    window.addEventListener('resize', () => handleSetWidth(wrapperRef.current));

    return () => {
      window.removeEventListener('resize', () => handleSetWidth(wrapperRef.current));
    };
  }, [wrapperRef.current?.clientWidth]);

  useEffect(() => {
    if (forcePanelChange && forcePanelChange !== selectedPanel) {
      setSelectedPanel(forcePanelChange);
    }
  }, [forcePanelChange]);

  return (
    <Wrapper ref={wrapperRef} id='wrapper'>
      <TitleContainer>
        {titles}
      </TitleContainer>
      <PanelContainer width={width}>
        <PanelController
          position={selectedPanel}
          width={width * panels.length}
        >
          {panelComponents}
        </PanelController>
      </PanelContainer>
    </Wrapper>
  );
};

export default MultiPanel;

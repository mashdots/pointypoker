import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { VARIATIONS } from '../../../utils/styles';

type Panel = {
  title: string;
  component: JSX.Element;
  shouldScroll?: boolean;
}

type Props = {
  panels: Panel[];
  width: number;
};

type SelectorProps = {
  width: number;
  position?: number;
}

type PanelWrapperProps = SelectorProps & {
  height?: number;
}

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  border: none;
  border-radius: 8px;
  padding: 1rem 0 0;
  width: 100%;
`;

const Selector = styled.div<SelectorProps>`
  display: flex;
  justify-content: space-between;
  background-color: ${VARIATIONS.structure.borderElement};
  position: absolute;
  height: 100%;
  width: ${({ width }) => width - 24}px;
  left: ${({ position }) => position}px;
  border-radius: 4px;
  margin: 0 12px;
  transition: left 0.3s ease-in-out;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 0.25rem 0;
`;

const Title = styled.div`
  cursor: pointer;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

const InheritWidthHeight = styled.div<PanelWrapperProps>`
  ${({ height, width }) => css`
    height ${height ? `${height}px` : '100%'};
    width ${width ? `${width}px` : '100%'};
  `}
`;

const PanelContainer = styled(InheritWidthHeight)<PanelWrapperProps>`
  display: flex;
  position: relative;
  flex: 1;
  overflow: hidden;
  width: 100%;
`;

const PanelController = styled(InheritWidthHeight)<PanelWrapperProps & { shouldScroll: boolean}>`
  display: flex;
  flex: 1;
  position: absolute;
  flex-direction: row;
  justify-content: space-between;
  overflow: ${({ shouldScroll }) => shouldScroll ? 'scroll' : 'visible'};

  transition: left 0.3s ease-in-out;
  left: ${({ position = 0 }) => -position * 100}%;
`;

const PanelWrapper = styled(InheritWidthHeight)<PanelWrapperProps>`
  display: flex;
  flex: 1;
`;

const PANEL_FIXTURES = [
  { title: 'Panel 1', component: <div>Panel 1</div> },
  { title: 'Panel 2', component: <div>Panel 2</div> },
  { title: 'Panel 3', component: <div>Panel 3</div> },
];

const MultiPanel = ({ panels = PANEL_FIXTURES, width }: Props) => {
  const [shouldScroll, setShouldScroll] = useState(false);
  const [selectedPanel, setSelectedPanel] = useState(0);
  const titles = panels.map((panel, i) => (
    <Title
      key={i}
      onClick={() => {
        setShouldScroll(!!panel?.shouldScroll);
        setSelectedPanel(i);
      }}
    >
      {panel.title}
    </Title>
  ));
  const selectorWidth = width / panels.length;
  const panelComponents = panels.map((panel, i) => (
    <PanelWrapper width={width} key={i}>{panel.component}</PanelWrapper>
  ));

  return (
    <Wrapper>
      <TitleContainer>
        {titles}
        <Selector width={selectorWidth} position={selectorWidth * selectedPanel} />
      </TitleContainer>
      <PanelContainer width={width}>
        <PanelController
          width={width * panels.length}
          position={selectedPanel}
          shouldScroll={shouldScroll}
        >
          {panelComponents}
        </PanelController>
      </PanelContainer>
    </Wrapper>
  );
};

export default MultiPanel;

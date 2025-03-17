import React, { useMemo } from 'react';
import { AnimatePresence } from 'motion/react';
import { div as AnimatedContainer } from 'motion/react-client';
import get from 'lodash/get';
import styled, { css } from 'styled-components';

import List from './list';

import { Card } from '@components/common';
import { Ticket } from '@yappy/types';
import { PossibleQueuedTicket, TicketFromQueue } from '@yappy/types/room';
import { usePrevious } from '@utils';

export enum SelectedTab {
  HISTORY = 'history',
  QUEUE = 'queue',
}

type Props = {
  search: string;
  selectedTab: SelectedTab;
  ticketLists: {
    history?: (Ticket | TicketFromQueue)[];
    queue?: PossibleQueuedTicket[];
  }
  currentTicket?: string;
};

type PanelWrapperProps = {
  height?: number;
  width?: number;
}

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
`;

const WidthHeightWithFallback = styled.div<PanelWrapperProps>`
  ${ ({ height, width }) => css`
    height ${ height ? `${ height }px` : '100%' };
    width ${ width ? `${ width }px` : '100%' };
  `}
`;

const NewPanelController = styled(WidthHeightWithFallback)`
  display: flex;
  position: absolute;
`;

const ListWrapper = styled(WidthHeightWithFallback)`
  display: flex;
`;


const FilterableList = ({ currentTicket, search, selectedTab, ticketLists }: Props) => {
  const selectedPanel = Object.keys(ticketLists).indexOf(selectedTab);
  const lastSelectedPanel = usePrevious(selectedPanel) || 0;

  const panelComponents = useMemo(
    () => Object.keys(ticketLists).map((listName, i) => {
      const list = get(ticketLists, listName, []);

      return (
        <ListWrapper key={i}>
          <List
            currentTicket={currentTicket}
            type={listName as SelectedTab}
            tickets={list}
          />
        </ListWrapper>
      );
    }),
    [ currentTicket, search, ticketLists ],
  );

  return (
    <Wrapper>
      <Card
        colorTheme='greyscale'
        overrideWidth='100%'
        style={{ flex: 1 }}
      >
        <AnimatePresence mode='wait'>
          <AnimatedContainer
            key={selectedTab}
            initial={{ opacity: 0, x: (selectedPanel - lastSelectedPanel) * 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: (selectedPanel - lastSelectedPanel) * 10 }}
            transition={{ type: 'tween', duration: 0.2 }}
            style={{
              width: '100%',
              flex: 1,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <NewPanelController>
              {panelComponents[ selectedPanel ]}
            </NewPanelController>
          </AnimatedContainer>
        </AnimatePresence>
      </Card>
    </Wrapper>
  );
};

export default FilterableList;

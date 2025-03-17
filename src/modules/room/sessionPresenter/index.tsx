import React from 'react';
import styled, { css } from 'styled-components';

import CurrentTicket from './modules/currentTicket';
import TicketList from './modules/ticketList';
import VoteComponents from './modules/votes';

import { HorizontalPaddingProps, useMobile } from '@utils/hooks/mobile';

const Wrapper = styled.div<HorizontalPaddingProps>`
  ${({ noHorizontalPadding }: HorizontalPaddingProps) => css`
    padding: 2rem ${ !noHorizontalPadding ? 0 : 2 }rem;
  `}

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  transition: all 300ms ease-out;
`;

const Flex = styled.div<{ flex?: number }>`
  ${ ({ flex = 1 }) => css`
    flex: ${ flex };
  `}

  display: flex;
`;

const FullHeightFlex = styled(Flex)`
  height: 100%;
`;

const ContentRow = styled(Flex)`
  width: 100%;
  justify-content: center;
  padding: 0 0.5rem;
`;

const CurrentTicketContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  padding-bottom: 3rem;
`;

// youarecutemydude

const SessionPresenter = () => {
  const { isBelowMaxWidth } = useMobile();

  return (
    <Wrapper id='sessionpresenter' noHorizontalPadding={isBelowMaxWidth}>
      <ContentRow id='current' flex={2} key='current-ticket'>
        <CurrentTicketContainer>
          <FullHeightFlex flex={2}>
            <CurrentTicket />
          </FullHeightFlex>
          <FullHeightFlex>
            <VoteComponents />
          </FullHeightFlex>
        </CurrentTicketContainer>
      </ContentRow>
      <ContentRow flex={3} key='all-other-tickets'>
        <TicketList />
      </ContentRow>
    </Wrapper>
  );
};

export default SessionPresenter;

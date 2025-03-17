import React from 'react';
import styled, { css } from 'styled-components';

import { useTickets } from '@modules/room/hooks';
import { JiraTicket } from '@modules/integrations/jira/types';

import DetailContainer from './detailContainer';
import Heading from './heading';
import PointingController from './pointingController';

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  margin-right: 3rem;
`;

const CurrentTicket = () => {
  const { currentTicket, shouldShowVotes } = useTickets();

  if (!currentTicket?.name) {
    return null;
  }

  const {
    id,
    name = '',
    sprint,
    type,
  } = currentTicket as JiraTicket;

  return (
    <MainContainer>
      <Heading
        iconUrl={type.iconUrl}
        title={name}
        id={id}
        sprint={sprint.name}
        type={type.name}
      />
      <DetailContainer ticketId={currentTicket.id} />
      <PointingController currentTicket={currentTicket} shouldShowVotes={shouldShowVotes} />
    </MainContainer>
  );
};

export default CurrentTicket;

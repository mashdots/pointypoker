import React from 'react';
import styled from 'styled-components';

import JiraIntegrationCard from '@modules/preferences/panes/integrations/jira';
import { NoticeWrapper } from '@modules/preferences/panes/integrations/jira/components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
`;

export const JiraReauthModal = () => (
  <Container>
    <NoticeWrapper>
        There&apos;s been an update to the Jira integration. Please reauthorize to continue using it.
    </NoticeWrapper>
    <JiraIntegrationCard />
  </Container>
);

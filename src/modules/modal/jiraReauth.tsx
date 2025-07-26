import React from 'react';
import styled from 'styled-components';

import Button from '@components/common/button';
import useJira from '@modules/integrations/jira';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
`;

const Message = styled.p`
  margin-bottom: 2rem;
`;

export const JiraReauthModal = () => {
  const { launchJiraOAuth } = useJira();

  return (
    <Container>
      <Message>
        There&apos;s been an update to the Jira integration. Please reauthorize to continue using it.
      </Message>
      <Button variation='info' textSize='small' width='half' onClick={launchJiraOAuth}>ugh, fine</Button>
    </Container>
  );
};

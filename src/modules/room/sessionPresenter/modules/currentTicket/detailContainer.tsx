import React, { useState, useEffect } from 'react';
import j2m from 'jira2md';
import { AnimatePresence } from 'motion/react';
import { div as AnimatedWrapper } from 'motion/react-client';
import Markdown from 'react-markdown';
import styled from 'styled-components';

import { useJira } from '@modules/integrations';

type Props = {
  ticketId?: string;
}

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  height: 100%;
`;

const cleanJiraDescription = (description: string) => {
  const panelRegex = /{panel:(.|\n)*{panel}\n*/gm;

  return description.replace(panelRegex, '');
};

const DetailContainer = ({ ticketId }: Props) => {
  const { getIssueDetail, isConfigured } = useJira();
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleFetchDescription = async (ticketId: string) => {
      setIsLoading(true);
      const { fields } = await getIssueDetail(ticketId);
      const jiraDescription = cleanJiraDescription(fields.description);
      const markdown = j2m.to_markdown(jiraDescription);
      setDescription(markdown);
      setIsLoading(false);
    };

    if (ticketId && isConfigured) {
      handleFetchDescription(ticketId);
    }
  }, [ticketId]);

  return (
    <AnimatePresence mode="wait">
      {description ? (
        <AnimatedWrapper
          key="ticket-details"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            display: 'flex',
            flex: 1,
            height: 'auto',
            position: 'relative',
            overflowY: 'auto',
          }}
        >

          <ContentContainer>
            <Markdown>{description}</Markdown>
          </ContentContainer>
        </AnimatedWrapper>
      ) : (
        <AnimatedWrapper
          key="ticket-details"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            display: 'flex',
            flex: 1,
            height: 'auto',
            position: 'relative',
            overflowY: 'auto',
          }}
        >
          {isLoading ? 'Loading...' : null}
        </AnimatedWrapper>
      )}

    </AnimatePresence>
  );
};

export default DetailContainer;

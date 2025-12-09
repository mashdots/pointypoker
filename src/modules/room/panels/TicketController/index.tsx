import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import styled, { css } from 'styled-components';
import { parseURL } from 'whatwg-url';

import { QueuedJiraTicket } from '@modules/integrations/jira/types';
import { useTickets } from '@modules/room/hooks';
import { useMobile } from '@utils/hooks/mobile';
import { ThemedProps } from '@utils/styles/colors/colorSystem';
import { Ticket } from '@yappy/types';
import { TicketFromQueue } from '@yappy/types/legacy/room';

import Controls from './controls';
import IssueIcon from './issueIcon';
import Subtitles from './subtitles';
import Title from './title';

type TicketControlFormat = {
  icon?: string;
  subTitle?: string;
  title: string;
  url?: string;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 1rem;
`;

const PrimaryContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 0.25rem;
`;

const InformationDisplay = styled.div<ThemedProps>`
  ${({ isNarrow }) => css`
    flex-direction: ${isNarrow ? 'column' : 'row'};
  `}

  align-items: center;
  display: flex;
  flex: 1;
`;

const Padding = styled.span`
  display: flex;
  height: 1rem;
  width: 5rem;
`;

const TicketController = () => {
  const { currentTicket } = useTickets();
  const [triggerFocus, setTriggerFocus] = useState<string | null>(null);
  const [actionSubtitle, setActionSubtitle] = useState<string | null>(null);
  const { isNarrow } = useMobile();

  const {
    title,
    subTitle,
    icon,
    url,
  } = useMemo((): TicketControlFormat => {
    const {
      id,
      name,
      url: ticketUrl,
      type,
      sprint,
    } = currentTicket ?? ({} as Ticket | TicketFromQueue);

    const title = name ?? '';
    let subTitle;
    let url;
    let icon;

    // URL will only exist if the ticket was a queued Jira ticket.
    if (ticketUrl) {
      const { name: sprintName } = sprint as QueuedJiraTicket['sprint'] ?? { name: '' };

      subTitle = `${ id } • ${type.name} ${sprintName ? 'in' : ''} ${ sprintName }`;
      url = ticketUrl;
      icon = type.icon.blobData;

      // parseURL will return null if the name is not a URL
    } else if (parseURL(title)) {
      subTitle = 'Click here to visit link';
      url = title;
    }

    return {
      icon,
      subTitle,
      title,
      url,
    };
  }, [currentTicket]);

  useEffect(() => {
    setTriggerFocus(null);
  }, [currentTicket]);

  return (
    <Wrapper>
      <PrimaryContainer>
        <IssueIcon src={icon} ticketUrl={url} />
        <Title value={title} shouldFocus={triggerFocus} />
        <Controls triggerFocus={setTriggerFocus} setSubtitle={setActionSubtitle} />
      </PrimaryContainer>
      <InformationDisplay isNarrow={isNarrow}>
        {!isNarrow && <Padding />}
        <Subtitles flex={isNarrow ? 0 : 1} content={subTitle}
          url={url} />
        <Subtitles content={actionSubtitle} />
      </InformationDisplay>
    </Wrapper>
  );
};

export default TicketController;

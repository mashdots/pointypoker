import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { parseURL } from 'whatwg-url';

import Title from './title';
import Controls from './controls';
import IssueIcon from './issueIcon';
import { useTickets } from '@modules/room/hooks';
import { Ticket } from '@yappy/types';
import { TicketFromQueue } from '@yappy/types/room';
import { QueuedJiraTicket } from '@modules/integrations/jira/types';
import Subtitles from '@modules/room/panels/ticketController/subtitles';

type TicketControlFormat = {
  iconSrc?: string;
  subTitle?: string;
  title: string;
  url?: string;
}

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

const InformationDisplay = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`;

const Padding = styled.span`
  display: flex;
  height: 1rem;
  width: 4rem;
`;

const TicketController = () => {
  const { currentTicket } = useTickets();
  const [triggerFocus, setTriggerFocus] = useState<string | null>(null);
  const [actionSubtitle, setActionSubtitle] = useState<string | null>(null);

  const { title, subTitle, iconSrc, url } = useMemo((): TicketControlFormat => {
    const { id, name, url, type, sprint } = currentTicket ?? ({} as Ticket | TicketFromQueue);
    const possibleName = name ?? '';
    const ticketData: TicketControlFormat = {
      title: possibleName,
      subTitle: ' ',
    };

    // URL will only exist if the ticket was a queued Jira ticket.
    if (url) {
      const { name: sprintName } = sprint as QueuedJiraTicket['sprint'] ?? { name: '' };

      ticketData.subTitle = `${ id } • ${type.name} ${sprintName ? 'in' : ''} ${ sprintName }`;
      ticketData.url = url;
      ticketData.iconSrc = (type as QueuedJiraTicket[ 'type' ]).iconUrl;

      // parseURL will return null if the name is not a URL
    } else if (parseURL(possibleName)) {
      ticketData.subTitle = 'Click here to visit link';
      ticketData.url = possibleName;
    }

    return ticketData;
  }, [ currentTicket ]);

  useEffect(() => {
    setTriggerFocus(null);
  }, [ currentTicket ]);

  return (
    <Wrapper>
      <PrimaryContainer>
        <IssueIcon src={iconSrc} ticketUrl={url} />
        <Title value={title} shouldFocus={triggerFocus} />
        <Controls triggerFocus={setTriggerFocus} setSubtitle={setActionSubtitle} />
      </PrimaryContainer>
      <InformationDisplay>
        <Padding />
        <Subtitles flex={1} content={subTitle} url={url} />
        <Subtitles content={actionSubtitle} />
      </InformationDisplay>
    </Wrapper>
  );
};

export default TicketController;
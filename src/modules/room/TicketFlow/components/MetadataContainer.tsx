import React from 'react';

import { JiraSprint } from '@modules/integrations/jira/types';

type Props = {
  id: string;
  url: string;
  ticketType?: string;
  sprint?: JiraSprint;
};

const MetadataContainer = ({
  id, url, ticketType, sprint,
}: Props) => {
  const typeCopy = ticketType ? ` • ${ticketType}` : '';
  const sprintCopy = ticketType && sprint ? ` in ${sprint.name}` : '';

  return <a href={url} target='_blank'
    rel="noreferrer">{id}{typeCopy}{sprintCopy}</a>;
};

export default MetadataContainer;

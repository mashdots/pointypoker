import { Timestamp } from 'firebase/firestore';

import { JiraSprint } from '@modules/integrations/jira/types';

type IssueType = {
  avatarId: number;
  description: string;
  iconUrl: string;
  id: string;
  name: string;
  icon: {
    contentType: string;
    data: string;
  }
};

type ExternalData = {
  source: string;
  sprint?: JiraSprint;
  type: IssueType;
  url: string;
  persistedToRemote: boolean;
};

type Issue = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  id: string;
  name: string;
  creatorId: string;
  createdAt: Timestamp;
  votingEndedAt: Timestamp | null;
  calculatedValue?: string | number;
  overrideValue?: string | number;
  external?: ExternalData;
};

export default Issue;

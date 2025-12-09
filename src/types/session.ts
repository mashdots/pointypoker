import { Timestamp } from 'firebase/firestore';

import Estimation from '@yappy/types/estimation';

import Issue from './issue';
import { Participant } from './user';

type Session = {
  createdAt: Timestamp;
  expiresAt: Timestamp;
  name: string;
  participants: {
    [key: Participant['id']]: Participant;
  };
  issues: {
    [key: Issue['id']]: Issue;
  };
  // Ticket management is handled by ID reference
  upcoming: string[];
  history: string[];
  currentIssue: string | null;
  estimations: Estimation[];
  // estimationSchema: EstimationSchema; <- to be defined later
};

export default Session;

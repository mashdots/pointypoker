import { Timestamp } from 'firebase/firestore';

import Estimation from '@yappy/types/estimation';

import Issue from './issue';
import { Participant } from './user';

type Session = {
  createdAt: Timestamp;
  currentIssue: string | null;
  estimations: Estimation[];
  expiresAt: Timestamp;
  history: string[];
  issues: {
    [key: Issue['id']]: Issue;
  };
  name: string;
  participants: {
    [key: Participant['id']]: Participant;
  };
  // Ticket management is handled by ID reference
  upcoming: string[];
  // estimationSchema: EstimationSchema; <- to be defined later
};

export default Session;

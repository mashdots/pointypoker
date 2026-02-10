import { Timestamp } from 'firebase/firestore';

import { QueuedJiraTicket } from '@modules/integrations/jira/types';
import { PointScheme } from '@yappy/types/estimation';

import User from '../user';

type Participant = User & {
  consecutiveMisses: number;
  inactive: boolean;
  isHost: boolean;
  isObserver: boolean;
  joinedAt: number;
};

type Vote = string | number;

type PointOptions = {
  sequence: Array<Vote>;
  exclusions: Array<Vote>;
};

type QueuedTicket = Pick<Ticket, 'id' | 'name' | 'pointOptions'>;

// These are tickets that are in the queue.
type PossibleQueuedTicket = QueuedTicket | QueuedJiraTicket;

type Ticket = {
  [key: string]: any;
  createdAt: number;
  createdBy: string;
  id: string;
  name?: string;
  pointOptions: PointScheme;
  shouldShowVotes: boolean;
  votes: {
    [key: string]: Vote;
  };
  votesShownAt: number | null;
  averagePoints?: number;
  suggestedPoints?: number | string;
  overridePoints?: number;
  fromQueue?: boolean;
};

// These tickets were in the queue and have been set as the current ticket.
type TicketFromQueue = PossibleQueuedTicket & Ticket;

type Room = {
  createdAt: number | Timestamp;
  expiresAt: number | Timestamp;
  name: string;
  participants: {
    [key: string]: Participant;
  };
  ticketQueue: Array<PossibleQueuedTicket>;
  currentTicket: Ticket | TicketFromQueue | null;
  completedTickets: Array<Ticket | TicketFromQueue>;
  // Deprecated field. Keeping it for historical data
  tickets?: {
    [key: string]: Ticket;
  };
};

type RoomUpdateObject = {
  [key: string]: any;
};

export type {
  Participant,
  PointOptions,
  Room,
  RoomUpdateObject,
  PossibleQueuedTicket,
  QueuedTicket,
  Ticket,
  TicketFromQueue,
  Vote,
};

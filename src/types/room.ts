import User from './user';
import { PointingTypes } from '@modules/room/utils';

type Participant = User & {
  consecutiveMisses: number;
  inactive: boolean;
  isHost: boolean;
  joinedAt: number;
  isObserver: boolean;
}

type Vote = string | number;

type PointOptions = {
  sequence: Array<Vote>;
  exclusions: Array<Vote>;
};

type QueuedTicket = {
  [ key: string ]: any;
  id: string;
  name: string;
  fromJira: boolean;
}

type Ticket = {
  [key: string]: any;
  createdAt: number;
  createdBy: string;
  timerStartAt?: number;
  id: string;
  name?: string;
  pointOptions: PointingTypes;
  shouldShowVotes: boolean;
  votes: {
    [key: string]: Vote;
  };
  votesShownAt: number | null;
  averagePoints?: number;
  suggestedPoints?: number | string;
}

type TicketFromQueue = QueuedTicket & Ticket;

type Room = {
  createdAt: number;
  name: string;
  participants: {
    [key: string]: Participant;
  };
  ticketQueue: Array<string>;
  currentTicket: Ticket | null;
  completedTickets: Array<Ticket>;
  // Deprecated field. Keeping it for historical data
  tickets?: {
    [key: string]: Ticket;
  };
}

type RoomUpdateObject = {
  [key: string]: any;
}

export type {
  Participant,
  PointOptions,
  Room,
  RoomUpdateObject,
  QueuedTicket,
  Ticket,
  TicketFromQueue,
  Vote,
};

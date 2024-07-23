import { PointingTypes } from '../modules/room/utils';
import User from './user';

type Participant = User & {
  consecutiveMisses: number;
  inactive: boolean;
  isHost: boolean;
  joinedAt: number;
}

type Vote = string | number;

type PointOptions = {
  sequence: Array<Vote>;
  exclusions: Array<Vote>;
};

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
  Ticket,
  Vote,
};

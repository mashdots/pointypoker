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
  suggestedPoints?: number;
}

type Room = {
  createdAt: number;
  name: string;
  participants: {
    [key: string]: Participant;
  };
  tickets: {
    [key: string]: Ticket;
  };
}

export type {
  Participant,
  PointOptions,
  Room,
  Ticket,
  Vote,
};

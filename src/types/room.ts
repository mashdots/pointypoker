import { PointingTypes } from '../modules/room/utils';
import User from './user';

type Participant = User & {
  consecutiveMisses: number;
  inactive: boolean;
  isHost: boolean;
  joinedAt: number;
}

type Vote = string | number;

type PointOptions = Array<Vote>;

type Ticket = {
  [key: string]: any;
  name?: string;
  id: string;
  shouldShowVotes: boolean;
  votes: {
    [key: string]: Vote;
  };
  createdAt: number;
  votesShownAt: number | null;
}

type Room = {
  name: string;
  createdAt: number;
  participants: Array<Participant>;
  pointOptions: PointingTypes;
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

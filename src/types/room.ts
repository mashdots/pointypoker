import User from './user';

type Participant = User & {
  consecutiveMisses: number;
  inactive: boolean;
  isHost: boolean;
  joinedAt: number;
}

type Vote = string | number;

type Ticket = {
  [key: string]: any;
  name?: string;
  id: string;
  shouldShowVotes: boolean;
  votes: {
    [key: string]: Vote;
  };
  createdAt: number;
}

type Room = {
  name: string;
  createdAt: number;
  participants: Array<Participant>;
  tickets: {
    [key: string]: Ticket;
  };
}

export type {
  Participant,
  Ticket,
  Room,
  Vote,
};

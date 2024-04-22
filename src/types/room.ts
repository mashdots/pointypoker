import User from './user';

type Participant = User & {
  consecutiveMisses: number;
  inactive: boolean;
  isHost: boolean;
  joinedAt: number;
}

type Vote = string | number;

type Issue = {
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
  issues: {
    [key: string]: Issue;
  };
}

export type {
  Participant,
  Issue,
  Room,
  Vote,
};

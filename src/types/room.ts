import User from './user';

type Participant = User & {
  consecutiveMisses: number;
  inactive: boolean;
  isHost: boolean;
  joinedAt: number;
}

type Issue = {
  name?: string;
  id: string;
  votes: {
    [ key: string ]: number
  };
}

type Room = {
  name: string;
  id: string;
  participants: Array<Participant>;
  issues: Array<Issue>;
}

export type {
  Participant,
  Issue,
  Room,
};

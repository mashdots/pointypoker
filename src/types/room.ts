import User from './user';

type Participant = User & {
  consecutiveMisses: number;
  inactive: boolean;
  isHost: boolean;
  joinedAt: number;
}

type Vote = {
  participantId: string;
  vote: string | number;
}

type Issue = {
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
  issues: Array<Issue>;
}

export type {
  Participant,
  Issue,
  Room,
};

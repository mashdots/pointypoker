import { UserPayload } from '@utils/user';

type User = Omit<UserPayload, 'created'>;

type Participant = User & {
  consecutiveMisses: number;
  inactive: boolean;
  isHost: boolean;
  isObserver: boolean;
  joinedAt: number;
};

export default User;
export type { Participant };

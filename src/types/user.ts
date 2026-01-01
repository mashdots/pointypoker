import { UserPayload } from '@utils/user';

type User = Omit<UserPayload, 'created'>;

type Participant = User & {
  consecutiveMisses: number;
  inactive: boolean;
  isHost: boolean;
  isObserver: boolean;
  joinedAt: number;
};

type AuthContext = {
  isInitialized: boolean;
  isAuthenticated: boolean;
  userId: string | null;
};

export default User;
export type { AuthContext, Participant };

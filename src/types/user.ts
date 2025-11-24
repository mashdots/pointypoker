import { UserPayload } from "@utils/user";

type User = Omit<UserPayload, 'created'>;

export default User;

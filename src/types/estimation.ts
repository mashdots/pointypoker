import { Timestamp } from 'firebase/firestore';

type Estimation = {
  id: string;
  issueID: string;
  userId: string;
  value: string;
  timestamp: Timestamp;
};

export default Estimation;

import { AnimatePresence } from 'motion/react';
import { useMemo } from 'react';

import useAuth from '@v4/hooks/useAuth';
import useRoom from '@v4/hooks/useRoom';

import Room from './room';
import Setup from './setup';

const V4Switcher = () => {
  const { userId } = useAuth();
  const { sessionName } = useRoom();

  console.log('userID', userId);
  console.log('SessionName', sessionName);

  const shouldRenderSetup = !userId || !sessionName;

  if (!userId || !sessionName) {
    return <Setup />;
  }

  // return (
  //   <AnimatePresence>

  //   </AnimatePresence>
  // )
  return <Room />;

};


export default V4Switcher;

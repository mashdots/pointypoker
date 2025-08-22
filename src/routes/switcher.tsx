import React from 'react';
import { AnimatePresence } from 'motion/react';
import { div as AnimatedWrapper } from 'motion/react-client';

import { UserSetup } from '@modules/user';
import { RoomSetup } from '@modules/room';
import useStore from '@utils/store';

/**
 * This is a hybrid module that handles:
 *
 * - User setup
 * - Room setup
 *
 * Depending on certain conditions, it will render the appropriate module needed
 * to set up the user, set up the room, or facilitate the room.
 */
const Switcher = () => {
  const user = useStore(({ preferences }) => preferences?.user);

  return (
    <AnimatePresence mode="wait">
      <AnimatedWrapper
        key={!user ? 'user' : 'room'}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        {!user ? <UserSetup /> : <RoomSetup />}
      </AnimatedWrapper>
    </AnimatePresence>
  );
};

export default Switcher;

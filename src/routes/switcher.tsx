import { AnimatePresence } from 'motion/react';
import { div as AnimatedWrapper } from 'motion/react-client';
import React, { useMemo } from 'react';

import { LoadingIcon } from '@modules/preferences/panes/integrations/jira/components';
import { RoomSetup } from '@modules/room';
import { useAuth, UserSetup } from '@modules/user';
import { useAuthorizedUser } from '@modules/user/AuthContext';

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
  const { isInitialized } = useAuthorizedUser();
  const { user } = useAuth();

  const renderComponent = useMemo(() => {
    if (!isInitialized) {
      return {
        component: <LoadingIcon />,
        key: 'loading',
      };
    }

    if (!user) {
      return {
        component: <UserSetup />,
        key: 'user',
      };
    }

    return {
      component: <RoomSetup />,
      key: 'room',
    };
  }, [
    isInitialized,
    user,
  ]);

  return (
    <AnimatePresence mode="wait">
      <AnimatedWrapper
        key={renderComponent.key}
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: -10,
        }}
        transition={{ duration: 0.2 }}
        style={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center',
        }}
      >
        {renderComponent.component}
      </AnimatedWrapper>
    </AnimatePresence>
  );
};

export default Switcher;

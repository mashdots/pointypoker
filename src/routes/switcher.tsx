import React, { useMemo } from 'react';
import { AnimatePresence } from 'motion/react';
import { div as AnimatedWrapper } from 'motion/react-client';

import { useAuth, UserSetup } from '@modules/user';
import { RoomSetup } from '@modules/room';
import { useAuthorizedUser } from '@modules/user/AuthContext';
import { LoadingIcon } from '@modules/preferences/panes/integrations/jira/components';

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
        key: 'loading',
        component: <LoadingIcon />,
      };
    }

    if (!user) {
      return {
        key: 'user',
        component: <UserSetup />,
      };
    }

    return {
      key: 'room',
      component: <RoomSetup />,
    };
  }, [isInitialized, user]);

  return (
    <AnimatePresence mode="wait">
      <AnimatedWrapper
        key={renderComponent.key}
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
        {renderComponent.component}
      </AnimatedWrapper>
    </AnimatePresence>
  );
};

export default Switcher;

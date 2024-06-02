import React, { useCallback, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import { UserSetup, useAuth } from '../user';
import { RoomSetup } from '../room';

type WrapperProps = {
  shouldShow: boolean;
};

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  transition: all 300ms ease-in-out;

  ${({ shouldShow }) => css`
    opacity: ${shouldShow ? 1 : 0};
  `}
`;

/**
 * This is a new hybrid module that handles:
 *
 * - User setup
 * - Room setup
 * - Room facilitation
 *
 * Depending on certain conditions, it will render the appropriate module needed
 * to set up the user, set up the room, or facilitate the room.
 */
const Switcher = () => {
  const { user } = useAuth();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [childComponent, setChildComponent] = useState<React.ReactNode>(null);

  const getChildComponent = useCallback(() => {
    if (!user) {
      return <UserSetup />;
    }

    return <RoomSetup />;
  }, [user]);

  useEffect(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setChildComponent(getChildComponent());
      setIsTransitioning(false);
    }, 300);

  }, [user]);

  return <Wrapper shouldShow={!isTransitioning}>{childComponent}</Wrapper>;
};

export default Switcher;

import { AnimatePresence, cubicBezier } from 'motion/react';
import { div as AnimatedBarWrapper } from 'motion/react-client';
import { useMemo, useState } from 'react';

import styled from 'styled-components';

import ZIndex from '@components/common/constants';
import { useAuth } from '@modules/user';
import useStore from '@utils/store';

import Logo from './Logo';

const BarContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.primary.accent3};
  border-radius: 10rem;
  margin: 2rem;
  z-index: ${ZIndex.CONTROL_BAR};
`;

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 1rem 2rem;
`;

const ControlBar = () => {
  const { user, signOut } = useAuth();
  const roomName = useStore(({ room }) => (room?.name.replace('-', ' ')));
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [showHistory, setShowHistory] = useState(false);


  /**
   * Icons / Buttons to render:
   *
   * - Share room link: room name
   * - Plus: Add new issues
   * -
   * - Counter-clockwise arrow: History
   * - Gear: settings
   * - Circle with first initial: user name
   */

  const renderComponent = useMemo(() => {
    if (!user) return null;

    return (
      <BarContainer>
        <ItemContainer><Logo /></ItemContainer>
      </BarContainer>
    );
  }, [user]);

  return (
    <AnimatePresence>
      <AnimatedBarWrapper
        key={user?.id ?? 'control-bar'}
        style={{
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          position: 'absolute',
          width: '100%',
        }}
        initial={{ y: 144 }}
        animate={{ y: 0 }}
        exit={{ y: 144 }}
        transition={{
          duration: 1,
          ease: cubicBezier(
            0.19,
            1,
            0.22,
            1,
          ),
        }}
        onClick={signOut}
      >
        {renderComponent}
      </AnimatedBarWrapper>
    </AnimatePresence>
  );
};

export default ControlBar;

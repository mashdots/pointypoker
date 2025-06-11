import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence } from 'motion/react';
import { div as AnimatedWrapper } from 'motion/react-client';

import YourSvg from '@assets/icons/you.svg?react';
import EveryoneSvg from '@assets/icons/everyone.svg?react';
import { Card, Tabs } from '@components/common';
import { useTickets } from '@modules/room/hooks';
import { usePrevious } from '@utils';

import ParticipantVotes from './participantVotes';
import YourVote from './yourVote';
import useStore from '@utils/store';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  min-width: 18rem;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  padding: 0.5rem 1rem 1rem;
`;

const TabContainer = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 0.5rem;
`;

const YourIcon = styled(YourSvg)`
  width: 1.5rem;
`;

const EveryoneIcon = styled(EveryoneSvg)`
  width: 1.5rem;
`;

let timeout: number;

const VoteComponents = () => {
  const { isObserving } = useStore(({ preferences }) => ({
    isObserving: preferences.isObserver,
  }));
  const { currentTicket, isWaitingOnCurrentUser } = useTickets();
  const [ activePanel, setActivePanel ] = useState(isObserving || !currentTicket ? 1 : 0);
  const [ isWaitingForUser, setIsWaitingForUser ] = useState(isWaitingOnCurrentUser);
  const lastPanel = usePrevious(activePanel) || 0;

  const handleSwitchToAllVotes = () => setActivePanel(1);
  const overrideColorTheme = isWaitingForUser ? 'warning' : 'greyscale';
  const panelOptions = [
    {
      icon: <YourIcon />,
      title: 'your vote',
      disabled: isObserving,
      component: <YourVote postVoteCallback={handleSwitchToAllVotes} />,
      disabledMessage: 'you can\'t vote while in observer mode',
    },
    {
      icon: <EveryoneIcon />,
      title: 'all votes',
      component: <ParticipantVotes />,
    },
  ];

  useEffect(() => {
    if (isWaitingOnCurrentUser) {
      timeout = setTimeout(() => {
        setActivePanel(0);
        setIsWaitingForUser(true);
      }, 10000);
    } else {
      clearTimeout(timeout);
      setIsWaitingForUser(false);
    }
  }
  , [ isWaitingOnCurrentUser ]);

  useEffect(
    () => {
      if (isObserving) {
        setActivePanel(1);
      }
    },
    [ isObserving ],
  );

  return (
    <Wrapper>
      <Card
        colorTheme={overrideColorTheme}
        direction='column'
        overrideHeight='100%'
        overrideWidth='100%'
      >
        <Container>
          <TabContainer>
            <Tabs
              controllerId='vote-components'
              tabs={panelOptions}
              onSetTab={setActivePanel}
              selectedTab={activePanel}
              stretch
            />
          </TabContainer>
          <AnimatePresence mode="wait">
            <AnimatedWrapper
              key={`${ panelOptions[ activePanel ].title }-component`}
              animate={{ opacity: 1, translateX: 0 }}
              exit={{ opacity: 0, translateX: (activePanel - lastPanel) * 24 }}
              initial={{ opacity: 0, translateX: (activePanel - lastPanel) * 24 }}
              transition={{ type: 'tween', duration: 0.25 }}
              style={{
                display: 'flex',
                width: '100%',
                height: '100%',
              }}
            >
              {panelOptions[ activePanel ].component}
            </AnimatedWrapper>
          </AnimatePresence>
        </Container>
      </Card >
    </Wrapper>
  );
};

export default VoteComponents;

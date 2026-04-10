import { AnimatePresence } from 'motion/react';
import { div as AnimatedContainer } from 'motion/react-client';
import { useState } from 'react';

import styled from 'styled-components';

import { Box } from '@mantine/core';
import { useAuth } from '@modules/user';
import { useMobile } from '@utils/hooks/mobile';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Setup = () => {
  const { user, signIn } = useAuth();
  const [name, setName] = useState('');
  const { isNarrow } = useMobile();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (name) {
      await signIn(name);
    }
  };

  const entryAndExitAnimationStyle = {
    filter: 'blur(1rem)',
    opacity: 0,
    transform: 'perspective(500px) rotateX(-10deg) translateZ(-90px) translateY(20px)',
  };

  return (
    <Wrapper>
      <AnimatePresence>
        <AnimatedContainer
          initial={{ ...entryAndExitAnimationStyle }}
          animate={{
            filter: 'blur(0rem)',
            opacity: 1,
            transform: 'perspective(500px) rotateX(0deg) translateZ(0px) translateY(0px)',
          }}
          exit={entryAndExitAnimationStyle}
          transition={{ duration: 0.3 }}
          style={{
            height: '24rem',
            width: '40rem',
          }}
        >
          <Box style={{
            border: '1px solid',
            borderRadius: '8px',
            padding: '2rem',
            width: isNarrow ? '90vw' : '40rem',
          }}>
            <h1>Setup</h1>
            <p>This is the setup page.</p>
          </Box>
        </AnimatedContainer>
      </AnimatePresence>
    </Wrapper>
  );
};

export default Setup;

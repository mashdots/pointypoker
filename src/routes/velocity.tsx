import { useVelocity } from '@modules/velocity';
import React from 'react';
import styled, { css } from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 80vh;
  width: 100%;
  overflow: auto;
`;

const Velocity = () => {
  const { sprints, tickets } = useVelocity();


  console.log('Sprints:', sprints);
  console.log('tickets:', tickets);

  return (
    <Wrapper>
      <Container>
        <h1>Velocity</h1>
        <p>This page is under construction. Please check back later!</p>
      </Container>
    </Wrapper>
  );
};

export default Velocity;

import React from 'react';
import styled, { keyframes } from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  container-name: wrapper;
`;

const movement = keyframes`
  0% {
    background-position: 5% 5%;
  }
  25% {
    background-position: 5% 95%;
    background-size: 250%;
  }
  50% {
    background-position: 95% 95%;
    background-size: 150%;
  }
  75% {
    background-position: 5% 95%;
  }
  100% {
    background-position: 5% 5%;
  }
`;

const entrance = keyframes`
  0% {
    transform: scale(0.5);
  }
  100% {
    transform: scale(1);
  }
`;

const AnimatedText = styled.h1`
  will-change: auto;
  display: block;
  text-align: center;
  background-repeat: no-repeat;
  background-image: url("https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2670&auto=format");
  background-size: 200%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;

  animation: 
    ${movement} 8s cubic-bezier(0.77, 0, 0.175, 1) 2s infinite,
    ${entrance} 500ms cubic-bezier(1,0,.7,2) forwards;

  @container wrapper (min-width: 300px) {
    font-size: 2em;
  }
`;

const Consensus = () => (
  <Wrapper>
    <AnimatedText>consensus!</AnimatedText>
  </Wrapper>
);


export default Consensus;

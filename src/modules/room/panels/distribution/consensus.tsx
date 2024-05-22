import React, { useEffect, useState } from 'react';
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

const AnimatedText = styled.h1<{ isPresented: boolean}>`
  /* font-size: 3rem; */
  will-change: auto;
  display: block;
  text-align: center;
  background-repeat: no-repeat;
  background-image: url("https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2670&auto=format");
  background-size: 200%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  animation: ${movement} 8s cubic-bezier(0.77, 0, 0.175, 1) 2s infinite;

  transition: transform 250ms cubic-bezier(.52,.13,.7,.17); 
  
  transform: scale(${({ isPresented }) => isPresented ? 1 : 0.75});

  @container wrapper (min-width: 300px) {
    font-size: 2em;
  }
`;

let timeout;

const Consensus = () => {
  const [isPresented, setIsPresented] = useState(false);

  useEffect(() => {
    timeout = setTimeout(() => {
      setIsPresented(true);
    }, 500);

    return () => {
      setIsPresented(false);
    };
  }, []);


  return (
    <Wrapper>
      <AnimatedText isPresented={isPresented}>consensus!</AnimatedText>
    </Wrapper>
  );
};

export default Consensus;

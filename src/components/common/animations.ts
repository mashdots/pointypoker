import { keyframes } from 'styled-components';

export const spinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const fadeDownEntrance = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-1rem);
    filter: blur(0.5rem);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0rem);
  }
`;

export const scaleEntrance = keyframes`
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

import React from 'react';
import { AnimatePresence } from 'motion/react';
import { div as AnimatedContainer } from 'motion/react-client';
import styled, { css } from 'styled-components';

import SkipSvg from '@assets/icons/skip.svg?react';
import { Button, Card } from '@components/common';
import { calculateSuggestedPoints } from '@modules/room/utils';
import { Room, Ticket } from '@yappy/types';
import { ThemedProps } from '@utils/styles/colors/colorSystem';

import Adjuster from './adjuster';

type Props = {
  currentTicket: Ticket;
  shouldShowVotes: boolean;
};

type ShouldShowVotesState = {
  isWrapUpState: boolean;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 18rem;
`;

const ControllerContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;


const SkipIcon = styled(SkipSvg)`
  width: 2rem;
  height: 2rem;
  transition: stroke 250ms ease-out;
  

  ${ ({ theme }: ThemedProps) => css`
    > polyline, path {
      stroke: ${ theme.error.accent11 };
    }

    > circle {
      stroke: ${ theme.greyscale.accent11 };
    }
  `};
`;


const PointingController = ({ currentTicket, shouldShowVotes }: Props) => {
  const { votes } = currentTicket;

  const { suggestedPoints } = shouldShowVotes ? calculateSuggestedPoints(currentTicket) : {};

  const primaryButton = (
    <Button refresh variation="greyscale" textSize='small'>Skip</Button>
  );

  return (
    <Wrapper>
      <AnimatePresence>
        {shouldShowVotes ? (
          <AnimatedContainer
            animate={{ opacity: 1, translateY: 0 }}
            initial={{ opacity: 0, translateY: 10 }}
            exit={{ opacity: 0, translateY: 10 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'flex-end',
            }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
            }}
          >
            <ControllerContainer>
              <Adjuster initialPoints={suggestedPoints} />
              {/* {primaryButton} */}
            </ControllerContainer>
          </AnimatedContainer>
        ) : null}
      </AnimatePresence>
    </Wrapper>
  );
};

export default PointingController;

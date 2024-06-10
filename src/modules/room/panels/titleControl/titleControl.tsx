import React, { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

import TitleInput from './titleInput';
import Button from '../../../../components/common/button';
import { useTickets } from '../../hooks';
import PlusIcon from '../../../../assets/icons/plus.svg?react';
import { useMobile } from '../../../../utils/mobile';

const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(4px); }
  50% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
  100% { transform: translateX(0); }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

const Icon = styled(PlusIcon) <{ $isHovered: boolean}>`
  width: 24px;
  margin-right: 0.5rem;
  transition: all 300ms;

  ${({ $isHovered }) => $isHovered && css`
    animation: ${shake} 300ms;
  `}
`;

const TitleControl = () => {
  const { isMobile } = useMobile();
  const [isHovered, setIsHovered] = useState(false);
  const {
    handleCreateTicket,
    shouldShowVotes,
  } = useTickets();

  return (
    <Wrapper>
      <TitleInput />
      <Button
        width='quarter'
        onClick={() => handleCreateTicket()}
        isDisabled={!shouldShowVotes}
        variation='success'
        textSize='small'
        noMargin
      >
        <>
          <Icon $isHovered={isHovered} /> next {isMobile ? '' : 'ticket'}
        </>
      </Button>
    </Wrapper>
  );
};

export default TitleControl;

import React, { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

import TitleInput from './titleInput';
import Button from '../../../../components/common/button';
import { useTickets } from '../../hooks';
import PlusIcon from '../../../../assets/icons/plus.svg?react';

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

const Icon = styled(PlusIcon) < { isHovered: boolean}>`
  width: 24px;
  margin-right: 0.5rem;
  transition: all 300ms;

  ${({ isHovered }) => isHovered && css`
    animation: ${shake} 300ms;
  `}
`;

const TitleControl = () => {
  const [isHovered, setIsHovered] = useState(false);
  const {
    handleCreateTicket,
  } = useTickets();

  return (
    <Wrapper>
      <TitleInput />
      <Button
        margin='left'
        variation='structure'
        width='quarter'
        onClick={() => handleCreateTicket()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        textSize='small'
      >
        <>
          <Icon isHovered={isHovered} /> next ticket
        </>
      </Button>
    </Wrapper>
  );
};

export default TitleControl;

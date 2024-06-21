import React from 'react';
import styled from 'styled-components';

import TitleInput from './titleInput';
import Button from '../../../../components/common/button';
import { useTickets } from '../../hooks';
import PlusIcon from '../../../../assets/icons/plus.svg?react';
import { useMobile } from '../../../../utils/mobile';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 0 1rem;
`;

const Icon = styled(PlusIcon)`
  width: 24px;
  margin-right: 0.5rem;
  transition: all 300ms;
`;

const TitleControl = () => {
  const { isMobile } = useMobile();
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
        <Icon /> next {isMobile ? '' : 'ticket'}
      </Button>
    </Wrapper>
  );
};

export default TitleControl;

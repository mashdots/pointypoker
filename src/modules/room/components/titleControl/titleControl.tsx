import React from 'react';
import styled from 'styled-components';

import TitleInput from './titleInput';
import Button from '../../../../components/common/button';
import { useTickets } from '../../hooks';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;


const TitleControl = () => {
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
        textSize='small'
      >
        next ticket
      </Button>
    </Wrapper>
  );
};

export default TitleControl;

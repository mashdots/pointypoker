import React from 'react';
import styled from 'styled-components';

import { ThemedProps } from '@utils/styles/colors/colorSystem';
import { Button } from '@components/common';
import useStore from '@utils/store';
import { MODAL_TYPES } from '@modules/modal';

const Wrapper = styled.div`
  color: ${({ theme }: ThemedProps) => theme.greyscale.accent10};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const Message = styled.p`
  display: flex;
  font-size: 1rem;
  font-weight: 400;
`;

const EmptyTicketDetail = () => {
  const openModal = useStore(({ setCurrentModal }) => () => setCurrentModal(MODAL_TYPES.TICKET));

  return (
    <Wrapper>
      <Message>you&apos;re currently not pointing a ticket</Message>
      <Button onClick={openModal} textSize='small' refresh>get started</Button>
    </Wrapper>
  );};


export default EmptyTicketDetail;

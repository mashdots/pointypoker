import React from 'react';
import styled, { css } from 'styled-components';

import { ThemedProps } from '@utils/styles/colors/colorSystem';
import { useTickets } from '@modules/room/hooks';
import useStore from '@utils/store';
import { wait } from '@utils';
import PIIReport from '@yappy/types/piiReport';
import { createPIIReport } from '@services/firebase';
import { Button } from '@components/common';

const Wrapper = styled.div`
  flex-direction: column;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const ReviewContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`;

const TicketData = styled.div`
  ${({ theme }: ThemedProps) => css`
    background-color: ${theme.primary.accent3};
  `};

  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex: 1;
`;

const NoticeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding-right: 1rem;

  > p {
    margin: 0;
    font-size: 1rem;
  }
`;

const ButtonWrapper = styled.div`
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  display: flex;
  width: 80%;
`;

const ReportPIIModal = () => {
  const { closeModal, roomName } = useStore(({ room, setCurrentModal }) => ({
    closeModal: () => setCurrentModal(null),
    roomName: room!.name,
  }));
  const { currentTicket, handleUpdateCurrentTicket } = useTickets();

  if (!currentTicket?.id) {
    return null;
  }

  const handleReport = () => {
    const piiReport: PIIReport = {
      id: currentTicket.id,
      room: roomName,
      date: new Date(),
    };

    createPIIReport(piiReport);
    handleUpdateCurrentTicket(
      'name',
      '[redacted]',
      () => {
        wait(250).then(() => {
          closeModal();
        });
      },
    );
  };

  return (
    <Wrapper>
      <ReviewContainer>
        <NoticeWrapper>
          <p>
            If the ticket summary contains any personally identifiable information (PII), <i>Submit Report</i> will clear the description from the database and notify the developer for further action.
          </p>
        </NoticeWrapper>
        <TicketData>
          <p>
            ticket number / JIRA key
            <h3>{currentTicket.id}</h3>
          </p>
          <p>
            summary
            <h3>{currentTicket.name}</h3>
          </p>
          <p>
            sprint
            <h3>{currentTicket?.sprint?.name ?? 'no sprint data found'}</h3>
          </p>
        </TicketData>
      </ReviewContainer>
      <ButtonWrapper>
        <Button
          refresh
          variation='error'
          width={12}
          textSize='small'
          onClick={closeModal}
        >
        Cancel
        </Button>
        <Button
          refresh
          variation='success'
          width={12}
          textSize='small'
          onClick={handleReport}
        >
        Submit Report
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
};

export default ReportPIIModal;

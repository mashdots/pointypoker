/* eslint-disable @typescript-eslint/no-unused-vars */
// TMP disable check for early development

import styled, { css } from 'styled-components';

import Card from '@components/common/card';
import { Ticket } from '@yappy/types';
import { TicketFromQueue } from '@yappy/types/legacy/room';

import MetadataContainer from './MetadataContainer';

type Props = Ticket | TicketFromQueue;

const ContentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

// MARK: Ticket Info
const TicketInfoContainer = styled.div`
  padding: 1rem;
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
`;

// MARK: Controller
const VoteContainer = styled.div`
  ${({ theme }) => css`
    border-left: 1px solid ${theme.primary.accent4};
  `}

  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const TicketCard = (props: Props) => {
  const {
    id,
    icon,
    name,
    sprint,
    type,
    url,
  } = props;

  return (
    <Card
      colorTheme='transparent'
      style={{
        flexDirection: 'row',
        minWidth: '50rem',
        width: '75%',
      }}
    >
      <TicketInfoContainer>
        {/* <MetadataContainer id={id} ticketType={type.name} /> */}
        <h2>icon • {props.name}</h2>
      </TicketInfoContainer>
      <VoteContainer>
        Pointing controls
      </VoteContainer>
    </Card>
  );
};

export default TicketCard;

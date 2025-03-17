import React from 'react';
import styled, { css } from 'styled-components';

import LinkSvg from '@assets/icons/link-out.svg?react';

import { Card } from '@components/common';
import { JiraTicketFromQueue } from '@modules/integrations/jira/types';
import { ThemedProps } from '@utils/styles/colors/colorSystem';
import { Link } from 'react-router-dom';

type CurrentTicketProps = {
  isCurrentTicket?: boolean;
};

type Props = JiraTicketFromQueue & CurrentTicketProps;

const Base = styled.div<CurrentTicketProps>`
  display: flex;
  width: 100%;
  overflow: hidden;
`;

const Container = styled(Base)`
  padding: 0.75rem 0;
`;

const Wrapper = styled(Base)`
  flex-direction: column;
  padding: 1rem;
  height: 100%;
`;

const LinkIcon = styled(LinkSvg)`
  height: 1rem;
  width: 1rem;
  margin-left: 0.25rem;
`;

const TicketLink = styled(Link)<CurrentTicketProps>`
  ${({ isCurrentTicket, theme }: ThemedProps & CurrentTicketProps) => css`
    color: ${ isCurrentTicket ? theme.info.accent12 : theme.greyscale.accent11 };

    &:hover {
      color: ${ theme.info.accent11};
    }
  `}

  &:hover {
    text-decoration: underline;
    text-decoration-style: dashed;
    text-decoration-thickness: 1px;
  }

  display: flex;
  text-decoration: none;
  transition: color 250ms ease-out;
`;

const SubData = styled(Base)`  
  flex: 1;
  align-items: center;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
`;

const Title = styled(Base)`
  ${({ isCurrentTicket, theme }: ThemedProps & CurrentTicketProps) => css`
    color: ${isCurrentTicket ? theme.primary.accent12 : theme.greyscale.accent11};
  `}

  max-height: 3rem;
`;

const TicketIcon = styled.img`
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
`;

const QueueItem = ({
  isCurrentTicket,
  name,
  id,
  sprint,
  estimationFieldId,
  type,
  url,
}: Props) => {

  return (
    <Container>
      <Card overrideWidth='100%' colorTheme={isCurrentTicket ? 'primary' : 'greyscale'} align='left'>
        <Wrapper isCurrentTicket={isCurrentTicket}>
          <SubData isCurrentTicket={isCurrentTicket}>
            <TicketIcon src={type.iconUrl} />
            <TicketLink isCurrentTicket={isCurrentTicket} to={url} target='_blank'>
              {id} in {sprint.name}
              <LinkIcon />
            </TicketLink>
          </SubData>
          <Title isCurrentTicket={isCurrentTicket}>
            {name}
          </Title>
        </Wrapper>
      </Card>
    </Container>
  );
};

export default QueueItem;

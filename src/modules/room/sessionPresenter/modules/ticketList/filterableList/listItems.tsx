import React, { useState } from 'react';
import styled, { css } from 'styled-components';

import { SelectedTab } from './';
import ArticleSvg from '@assets/icons/article.svg?react';
import LinkSvg from '@assets/icons/link-out.svg?react';
import PointNextSvg from '@assets/icons/sort-descending.svg?react';
import SkipSvg from '@assets/icons/skip-to.svg?react';
import RemoveFromQueueSvg from '@assets/icons/stack-minus.svg?react';
import { ButtonMenu } from '@components/common';
import { QueuedJiraTicket } from '@modules/integrations/jira/types';
import { ThemedProps } from '@utils/styles/colors/colorSystem';
import { Ticket } from '@yappy/types';
import { PossibleQueuedTicket, TicketFromQueue } from '@yappy/types/room';

export type Props = {
  isCurrentTicket: boolean;
  item: Ticket | TicketFromQueue | PossibleQueuedTicket;
  type: SelectedTab;
}

type CurrentTicketProps = Pick<Props, 'isCurrentTicket'> & ThemedProps;

const Wrapper = styled.div<CurrentTicketProps>`
  ${({ isCurrentTicket, theme }: CurrentTicketProps) => css`
    background-color: ${isCurrentTicket ? theme.transparent.accent3 : 'transparent' };
    border-bottom: 1px solid ${ theme.greyscale.accent7 };
  `}

  display: flex;
  position: relative;
  align-items: center;
  padding: 1rem 1.5rem;
  flex: 1;
  width: 100%;

  transition: all 300ms;
`;

const LinkIcon = styled(LinkSvg)<ThemedProps>`
  display: flex;
  margin-left: 0.25rem;
  height: 0.75rem;
  width: 0.75rem;
  opacity: 0;
  transition: opacity 150ms;
`;

const SkipIcon = styled(SkipSvg)<ThemedProps>`
  ${ ({ theme }: ThemedProps) => css`
    > line, polyline {
      stroke: ${ theme.info.accent11 };
    }
  `}

  width: 1.5rem;
  margin-right: 0.75rem;
`;

const PointNextIcon = styled(PointNextSvg)<ThemedProps>`
  ${ ({ theme }: ThemedProps) => css`
    > line, polyline {
      stroke: ${ theme.success.accent11 };
    }
  `}

  width: 1.5rem;
  margin-right: 0.75rem;
`;

const RemoveIcon = styled(RemoveFromQueueSvg)<ThemedProps>`
  ${ ({ theme }: ThemedProps) => css`
    > line, polyline, polygon {
      stroke: ${ theme.error.accent11 };
    }
  `}

  width: 1.5rem;
  margin-right: 0.75rem;
`;

const MainTicketContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  width: 100%;
  overflow: hidden;
`;

const IconContainer = styled.span`
  margin-right: 0.5rem;
  display: flex;
`;

const Icon = styled.img`
  height: 2rem;
  width: 2rem;
  border-radius: 0.25rem;
`;

const DefaultIcon = styled(ArticleSvg)`
  ${ ({ theme }: ThemedProps) => css`
    > line, rect {
      stroke: ${ theme.primary.accent11 };
    }
  `}
  
  width: 2rem;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  text-overflow: ellipsis;
`;

const TicketName = styled.h4<CurrentTicketProps>`
  ${({ isCurrentTicket, theme }: CurrentTicketProps) => css`
    color: ${ theme.greyscale[ isCurrentTicket ? 'accent12' : 'accent11' ] };
  `}

  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 0.5rem;
  font-weight: 500;
`;

const TicketData = styled.a<CurrentTicketProps>`
  ${({ isCurrentTicket, theme }: CurrentTicketProps) => css`
    color: ${ theme[ isCurrentTicket ? 'primary' : 'greyscale' ][ isCurrentTicket ? 'accent11' : 'accent10' ] };
    border-color: transparent;

    :hover {
      color: ${ theme.primary.accent11 };
      background-color: ${ theme.primary.accent4 };
      border-color: ${ theme.primary.accent7 };
      
      > svg {
        opacity: 1;
      }
    }
    `}

  display: flex;
  padding: 0.125rem 0.5rem;
  align-items: center;
  width: fit-content;
  font-size: 0.75rem;
  border-radius: 0.5rem;
  transition: all 150ms;
  border-width: 1px;
  border-style: solid;
  text-decoration: none;
`;



// What are these?
export const QueueItem = () => {
  return <div>QueueItem</div>;
};

// What are these?
export const HistoryItem = () => {
  return <div>HistoryItem</div>;
};

/**
 * TODO
 * - Proper types for item ticket data
 * - Individual menus for each item
 *   - Remove from queue
 *   - Point this next
 *   - Skip to here
 *
 */

const ListItem = ({ isCurrentTicket, item, type }: Props) => {
  const iconUrl = (item as QueuedJiraTicket)?.type?.iconUrl || '';
  const [isRowHovered, setIsRowHovered] = useState(false);
  const icon = iconUrl ? <Icon src={iconUrl} /> : <DefaultIcon />;

  const menuItems = [
    {
      icon: <PointNextIcon />,
      label: 'point this next',
      onClick: () => console.log('point this next'),
    },
    {
      icon: <SkipIcon />,
      label: 'skip to here',
      onClick: () => console.log('skip to here'),
    },
    {
      icon: <RemoveIcon />,
      label: 'remove from queue',
      onClick: () => console.log('remove from queue'),
    },
  ];

  return (
    <Wrapper
      onMouseEnter={() => setIsRowHovered(true)}
      onMouseLeave={() => setIsRowHovered(false)}
      isCurrentTicket={isCurrentTicket}
    >
      <MainTicketContainer>
        <IconContainer title={item?.type.name}>
          {icon}
        </IconContainer>
        <TextContainer>
          <TicketData isCurrentTicket={isCurrentTicket} href={item.url} target='_blank'>
            {item.id}&nbsp;&nbsp;|&nbsp;&nbsp;{item?.sprint?.name}<LinkIcon />
          </TicketData>
          <TicketName isCurrentTicket={isCurrentTicket}>{item.name}</TicketName>
        </TextContainer>
      </MainTicketContainer>
      <ButtonMenu menuItems={menuItems} shouldShow={isRowHovered} />
    </Wrapper>
  );
};

export default ListItem;
// youarecutemydude

import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';

import ToolbarItem, { Props as ToolbarItemProps } from './item';

import DoorSvg from '@assets/icons/door-solid.svg?react';
import GearSvg from '@assets/icons/gear.svg?react';
import JiraSvg from '@assets/icons/jira-logo.svg?react';
import SquareSvg from '@assets/icons/square-half.svg?react';

import { MODAL_TYPES } from '@modules/modal';
import { updateRoom } from '@services/firebase';
import useStore from '@utils/store';
import { ThemedProps } from '@utils/styles/colors/colorSystem';
import { RoomUpdateObject } from '@yappy/types';
import { useJira } from '@modules/integrations';

type Item = ToolbarItemProps & { shouldHide?: boolean };

type ActiveType = {
  isActive: boolean;
}

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;

  padding: 0 1rem 1rem;
`;

const Section = styled.div<ActiveType>`
  ${ ({ isActive, theme }: ActiveType & ThemedProps) => css`
    color: ${ theme.primary.accent12 };
    
    :hover {
      background-color: ${ theme.greyscale.accent3 };
    }
  `}

  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 300ms ease-out;
  overflow-x: hidden;
`;

const PreferencesIcon = styled(GearSvg)<ActiveType>`
  ${({ isActive }: ActiveType) => css`
    path {
      transform: rotate(${isActive ? 30 : 0}deg);
      transform-origin: center;
      transition: transform 300ms ease-out;
    }
  `}
`;

const LeaveIcon = styled(DoorSvg)``;

const ToolbarIcon = styled(SquareSvg)<ActiveType>`
  ${({ isActive }: ActiveType) => css`
    rect:nth-child(2) {
      x: ${isActive ? 88 : 128}px;
      width: ${isActive ? 120 : 80}px;
      transition: all 300ms ease-out;
    }
  `}
`;

const JiraIcon = styled(JiraSvg)``;

const Toolbar = () => {
  const navigate = useNavigate();
  const { isJiraModalOpen, isPrefsModalOpen, isToolbarExpanded, toggleToolbarCollapse, exitRoom, openJiraModal, openPrefsModal, storedRoomName } = useStore(
    ({ clearRoom, currentModal, preferences, setCurrentModal, setPreferences, room }) => ({
      clearRoom: clearRoom,
      exitRoom: () => {
        const userId = preferences?.user?.id;

        if (userId && room?.participants[ userId ]) {
          const updateObj: RoomUpdateObject = {};
          updateObj[ `participants.${ userId }.inactive` ] = true;

          updateRoom(room.name, updateObj);
        }

        navigate('/');
        clearRoom();
      },
      isJiraModalOpen: currentModal === MODAL_TYPES.JIRA,
      isPrefsModalOpen: currentModal === MODAL_TYPES.PREFERENCES,
      isToolbarExpanded: preferences?.isToolbarExpanded as boolean || false,
      openJiraModal: () => setCurrentModal(MODAL_TYPES.JIRA),
      openPrefsModal: () => setCurrentModal(MODAL_TYPES.PREFERENCES),
      room: room,
      storedRoomName: room?.name,
      toggleToolbarCollapse: () => setPreferences('isToolbarExpanded', !preferences?.isToolbarExpanded ),
    }),
  );
  const { isConfigured: isJiraConfigured } = useJira();
  const [roomName] = useState(storedRoomName);

  const upperItems: Item[] = [
    {
      icon: <JiraIcon />,
      label: 'import from Jira',
      onClick: openJiraModal,
      isActive: isJiraModalOpen,
      shouldHide: !isJiraConfigured,
      ignoreIconColor: true,
    },
  ];

  const lowerItems: Item[] = [
    {
      icon: <PreferencesIcon isActive={isPrefsModalOpen} />,
      label: 'preferences',
      onClick: openPrefsModal,
      isActive: isPrefsModalOpen,
    },
    {
      icon: <LeaveIcon />,
      label: `leave ${roomName}`,
      onClick: exitRoom,
      isActive: false,
    },
  ];

  return (
    <Wrapper>
      <Section key='upper' isActive={!isToolbarExpanded}>
        {upperItems.filter(({ shouldHide }) => !shouldHide).map((item, index) => (
          <ToolbarItem key={index} {...item} />
        ))}
      </Section>
      <Section key='lower' isActive={!isToolbarExpanded}>
        {lowerItems.map((item, index) => (
          <ToolbarItem key={index} {...item} />
        ))}
      </Section>
    </Wrapper>
  );
};

export default Toolbar;

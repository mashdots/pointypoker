import React from 'react';

import styled from 'styled-components';

import JiraSvg from '@assets/icons/jira-logo.svg?react';
import { MODAL_TYPES } from '@modules/modal';
import useStore from '@utils/store';
import { ThemedProps } from '@utils/styles/colors/colorSystem';

import MenuItem from './menuItem';

const Icon = styled(JiraSvg)<ThemedProps>`
  width: 1.5rem;
  margin-right: 1rem;
`;

const ImportFromJiraMenuItem = () => {
  const openModal = useStore(({ setCurrentModal }) => () => setCurrentModal(MODAL_TYPES.JIRA));

  return (
    <MenuItem
      uniqueElement={<Icon />}
      text='import from Jira'
      onClick={openModal}
    />
  );

};

export default ImportFromJiraMenuItem;

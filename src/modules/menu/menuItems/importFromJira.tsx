import React from 'react';
import styled, { css } from 'styled-components';

import MenuItem from './menuItem';
import { MODAL_TYPES } from '@modules/modal';
import JiraSvg from '@assets/icons/jira-logo.svg?react';
import useStore from '@utils/store';
import { ThemedProps } from '@utils/styles/colors/colorSystem';

const Icon = styled(JiraSvg)<ThemedProps>`
  width: 1.5rem;
  margin-right: 1rem;

  ${({ theme }: ThemedProps) => css`
    > path {
      fill: ${ theme.info.solidBg };
    }
  `}
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

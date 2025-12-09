import React from 'react';

import styled, { css } from 'styled-components';

import SettingsIcon from '@assets/icons/settings.svg?react';
import { MODAL_TYPES } from '@modules/modal';
import useStore from '@utils/store';
import { ThemedProps } from '@utils/styles/colors/colorSystem';

import MenuItem from './menuItem';


const Icon = styled(SettingsIcon)<ThemedProps>`
  width: 1.5rem;
  margin-right: 1rem;

  ${ ({ theme }: ThemedProps) => css`
    > path, circle {
      stroke: ${ theme.greyscale.accent11 };
    }
  `}
`;

const PreferencesMenuItem = () => {
  const openModal = useStore(({ setCurrentModal }) => () => setCurrentModal(MODAL_TYPES.PREFERENCES));

  return (
    <MenuItem
      uniqueElement={<Icon />}
      text='preferences'
      onClick={openModal}
    />
  );

};

export default PreferencesMenuItem;

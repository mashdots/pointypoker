import React from 'react';
import styled, { css } from 'styled-components';

import SettingsIcon from '../../../assets/icons/settings.svg?react';
import { ThemedProps } from '../../../utils/styles/colors/colorSystem';
import MenuItem from './menuItem';
import useStore from '../../../utils/store';
import { MODAL_TYPES } from '../../modal';


const Icon = styled(SettingsIcon)<ThemedProps>`
  width: 1.5rem;
  margin-right: 1rem;

  ${ ({ theme }: ThemedProps) => css`
    > path, circle {
      stroke: ${ theme.greyscale.textLow };
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

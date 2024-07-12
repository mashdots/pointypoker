import React from 'react';
import styled, { css } from 'styled-components';

import QueueIcon from '../../../assets/icons/queue.svg?react';
import { ThemedProps } from '../../../utils/styles/colors/colorSystem';
import MenuItem from './menuItem';
import useStore from '../../../utils/store';
import { MODAL_TYPES } from '../../modal';


const Icon = styled(QueueIcon) <ThemedProps>`
  width: 1.5rem;
  margin-right: 1rem;

  ${ ({ theme }: ThemedProps) => css`
    > rect {
      stroke: ${ theme.greyscale.textLow };
    }

    > line {
      stroke: ${ theme.success.textLow };
    }
  `}
`;

const QueueMenuItem = () => {
  const openModal = useStore(({ setCurrentModal }) => () => setCurrentModal(MODAL_TYPES.QUEUE));

  return (
    <MenuItem
      uniqueElement={<Icon />}
      text='build ticket queue'
      onClick={openModal}
    />
  );

};

export default QueueMenuItem;

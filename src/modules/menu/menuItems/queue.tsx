import React from 'react';
import styled, { css } from 'styled-components';

import MenuItem from './menuItem';
import { MODAL_TYPES } from '@modules/modal';
import QueueIcon from '@assets/icons/queue.svg?react';
import useStore from '@utils/store';
import { ThemedProps } from '@utils/styles/colors/colorSystem';


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

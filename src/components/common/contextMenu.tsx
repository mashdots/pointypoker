import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { isOpenProps } from '@yappy/types/ui';

const Wrapper = styled.div``;

type Props = {
  mousePosition: {
    x: number;
    y: number;
  };
  contents: React.ReactNode;
} & isOpenProps;

const ContextMenu = ({ mousePosition, contents, isOpen }: Props) => {
  return <Wrapper>ContextMenu</Wrapper>;
};

export default ContextMenu;

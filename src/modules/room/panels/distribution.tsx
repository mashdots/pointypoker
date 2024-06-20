import React from 'react';
import styled from 'styled-components';

import { GridPanel } from '../../../components/common';
import { GridPanelProps } from '../../../components/common/gridPanel';
import VoteDistribution from './distribution/voteDistribution';


const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
  width: 100%;
  overflow: hidden;
  flex-wrap: wrap;
  padding-bottom: 1rem;
`;

const Distribution = (props: GridPanelProps) => {
  return (
    <GridPanel config={props.gridConfig} title='distribution'>
      <Wrapper>
        <VoteDistribution />
      </Wrapper>
    </GridPanel>
  );
};

export default Distribution;

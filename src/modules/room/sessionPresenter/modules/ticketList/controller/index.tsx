import React from 'react';
import styled from 'styled-components';

import { Card } from '@components/common';
import { SelectedTab } from '../filterableList';
import ListSwitcher from './listSwitcher';
import { useMobile } from '@utils/hooks/mobile';
import Search from './search';

export type Props = {
  tabs: SelectedTab[];
  setSearch: (search: string) => void;
  setTab: (tab: SelectedTab) => void;
  selectedTab: SelectedTab;
}

const Wrapper = styled.div`
  width: 100%;
  margin-bottom: 2rem;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
  padding: 0 1.5rem;
`;

const Section = styled.div`
  display: flex;
  flex: 1;
  align-items: center;

  h2 {
    margin-right: 1.5rem;
    font-weight: 600;
  }
`;

const Controller = ({ tabs, setSearch, setTab, selectedTab }: Props) => {
  const { isNarrow } = useMobile();

  const searchElement = !isNarrow ? (
    <Search onChange={setSearch} />
  ) : null;

  return (
    <Wrapper>
      <Card colorTheme='greyscale' overrideWidth='100%'>
        <Container>
          <Section>
            <h2>
              tickets
            </h2>
            <ListSwitcher tabs={tabs} setTab={setTab} selectedTab={selectedTab} />
          </Section>
          <Section>
            {searchElement}
          </Section>
        </Container>
      </Card>
    </Wrapper>
  );
};

export default Controller;

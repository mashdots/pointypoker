import styled, { css } from 'styled-components';

import Toggle from '@components/common/toggle';
import {
  DEFAULT_SCENARIO_ID,
  SCENARIOS,
} from '@utils/jiraFixtures';
import useStore from '@utils/store';
import { ThemedProps } from '@utils/styles/colors/types';

import {
  Control,
  Description,
  Label,
  SetupPrefWrapper,
} from './components';

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ScenarioSelect = styled.select`
  ${({ theme }: ThemedProps) => css`
    background-color: ${theme.primary.accent3};
    color: ${theme.greyscale.accent12};
    border: 1px solid ${theme.primary.accent7};
  `}

  width: 100%;
  padding: 0.4rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  cursor: pointer;
`;

const FixtureModeSection = () => {
  const {
    useFixtures,
    scenario,
    toggleFixtures,
    setScenario,
  } = useStore(({ preferences, setPreference }) => ({
    scenario: preferences.jiraFixtureScenario ?? DEFAULT_SCENARIO_ID,
    setScenario: (id: string) => setPreference('jiraFixtureScenario', id),
    toggleFixtures: () => setPreference('useJiraFixtures', !preferences.useJiraFixtures),
    useFixtures: !!preferences.useJiraFixtures,
  }));

  return (
    <SetupPrefWrapper>
      <Header>
        <Label>Use fixture data</Label>
        <Toggle
          isOn={useFixtures}
          handleToggle={toggleFixtures}
          position='right'
        />
      </Header>
      <Description>
        Return canned Jira data instead of calling a real instance. Overrides any
        stored Jira tokens (they are kept, not cleared) and reports Jira as connected.
      </Description>
      {useFixtures && (
        <Control>
          <ScenarioSelect
            aria-label='Fixture scenario'
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
          >
            {Object.values(SCENARIOS).map((s) => (
              <option key={s.id} value={s.id}>
                {s.label} — {s.description}
              </option>
            ))}
          </ScenarioSelect>
        </Control>
      )}
    </SetupPrefWrapper>
  );
};

export default FixtureModeSection;

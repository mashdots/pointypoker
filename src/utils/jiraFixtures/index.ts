import { resolveSeed } from './scenarios';
import { buildJiraJsFixtures } from './toJiraJs';
import { buildLegacyFixtures } from './toLegacy';

export {
  SCENARIOS,
  DEFAULT_SCENARIO_ID,
} from './scenarios';
export type { FixtureScenario } from './scenarios';

/**
 * Fixture accessors for the two Jira integrations. Pass the currently selected
 * scenario id (from `preferences.jiraFixtureScenario`); unknown / empty ids
 * fall back to the default `populated` scenario.
 */
export const getLegacyFixtures = (scenarioId?: string | null) =>
  buildLegacyFixtures(resolveSeed(scenarioId));

export const getJiraJsFixtures = (scenarioId?: string | null) =>
  buildJiraJsFixtures(resolveSeed(scenarioId));

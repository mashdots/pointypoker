import { test, expect } from './support/fixtures';

/**
 * Exercises the Jira import flow against the app's built-in fixture mode
 * (src/utils/jiraFixtures) — no real Atlassian OAuth. The "populated" scenario
 * exposes a "Web App Board" with "Web App Sprint 42" containing issues
 * FIX-101…FIX-108.
 */
test.describe('Jira import (fixture mode)', () => {
  test('importing a sprint populates the queue and sets the first ticket', async ({ page, app }) => {
    // Seed fixture mode before the app boots.
    await app.enableJiraFixtures(page, 'populated');
    await app.host(page, 'Ada');

    // Fixture mode reports Jira as connected, so the import menu item appears.
    await app.openMenu(page);
    await page.getByText('import from Jira').click();
    await expect(page.getByRole('heading', { name: 'Import from Jira' })).toBeVisible();

    // Step 1: choose a board. Selecting it immediately unmounts the option list,
    // so dispatch the click directly to avoid Playwright's post-click retry race.
    await page.locator('#board-option-picker').fill('Web App');
    await page.getByText('Web App Board').dispatchEvent('click');

    // Step 2: choose a sprint (fetched for the board).
    await expect(page.getByRole('heading', { name: 'Select a sprint' })).toBeVisible();
    await page.getByText('Web App Sprint 42').dispatchEvent('click');

    // Step 3: review and add to the queue.
    await expect(page.getByRole('heading', { name: 'Review tickets' })).toBeVisible();
    await page.getByRole('button', { name: /Add to queue/ }).click();

    // Modal closes; the first imported issue becomes the current ticket.
    await expect(page.getByRole('heading', { name: 'Import from Jira' })).toHaveCount(0);
    await expect(app.roomReady(page)).toHaveText('Add dark mode toggle to settings');

    // The queue tab only renders when the ticket queue is non-empty, so its
    // appearance confirms the sprint's issues were imported into the queue.
    const panel = page.locator('#wrapper');
    await expect(panel.getByRole('heading', { name: 'queue' })).toBeVisible();
    // At least one imported FIX-1xx issue is present in the queue list.
    await expect(panel.getByRole('link', { name: /^FIX-1\d\d/ })).not.toHaveCount(0);
  });
});

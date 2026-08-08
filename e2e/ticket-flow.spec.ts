import { test, expect } from './support/fixtures';

test.describe('ticket flow', () => {
  test('creating a ticket enables voting', async ({ page, app }) => {
    await app.host(page, 'Ada');
    await expect(page.getByTestId('vote-8')).toBeDisabled();

    await app.createTicket(page, 'Estimate onboarding');
    await expect(page.getByTestId('vote-8')).toBeEnabled();
  });

  test('a voted-on ticket is archived to history when the next ticket starts', async ({ page, app }) => {
    await app.host(page, 'Ada');

    await app.createTicket(page, 'First ticket');
    await app.castVote(page, 8); // lone voter → auto reveal, suggested = 8
    await expect(page.getByTestId('result-value-suggested')).toHaveText('8');

    // Starting a new ticket moves the first one into history with its suggestion.
    await app.createTicket(page, 'Second ticket');

    const history = page.locator('#wrapper');
    await expect(history.getByText('First ticket')).toBeVisible();
    await expect(history.getByText('8', { exact: true })).toBeVisible();
  });
});

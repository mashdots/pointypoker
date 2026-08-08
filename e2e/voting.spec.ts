import { test, expect } from './support/fixtures';

test.describe('voting', () => {
  test('vote buttons are disabled until a ticket exists', async ({ page, app }) => {
    await app.host(page, 'Ada');

    // Default fibonacci scheme renders point buttons; with no current ticket they are disabled.
    await expect(page.getByTestId('vote-5')).toBeDisabled();

    await app.createTicket(page, 'Estimate the login page');
    await expect(page.getByTestId('vote-5')).toBeEnabled();
  });

  test('a lone voter auto-reveals results after voting', async ({ page, app }) => {
    await app.host(page, 'Ada');
    await app.createTicket(page, 'Estimate the login page');

    // Before voting, the suggested/average values are hidden.
    await expect(page.getByTestId('result-value-suggested')).toBeEmpty();

    await app.castVote(page, 5);

    // Sole active participant → votes reveal automatically.
    await expect(page.getByTestId('result-value-suggested')).toHaveText('5');
    await expect(page.getByTestId('result-value-average')).toHaveText('5');
  });

  test('votes can be cast with the keyboard', async ({ page, app }) => {
    await app.host(page, 'Ada');
    await app.createTicket(page, 'Estimate the login page');

    await page.keyboard.press('8');

    await expect(page.getByTestId('result-value-suggested')).toHaveText('8');
  });
});

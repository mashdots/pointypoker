import { test, expect } from './support/fixtures';

test.describe('participant management', () => {
  test('observer mode disables voting and shows a watching state to others', async ({ page, browser, app }) => {
    const slug = await app.host(page, 'Ada');
    const guest = await app.join(browser, 'Grace', slug);

    // Grace turns on observer mode.
    await app.openPreferences(guest, 'General');
    await guest.locator('#observer-switch').click();
    await app.closeModal(guest);

    // Grace can no longer vote.
    await expect(guest.getByTestId('voting-disabled')).toBeVisible();

    // The host sees Grace flagged as an observer.
    await expect(page.getByTestId('vote-row-Grace')).toHaveAttribute('data-vote-state', 'observer');
  });

  test('leaving a room redirects home and marks you inactive to others', async ({ page, browser, app }) => {
    const slug = await app.host(page, 'Ada');
    const guest = await app.join(browser, 'Grace', slug);

    await expect(page.getByTestId('vote-row-Grace')).toBeVisible();

    // Grace leaves via the menu.
    await app.openMenu(guest);
    await guest.getByText(`leave ${slug}`).click();
    await expect(guest).toHaveURL(/\/$/);

    // The host now sees Grace as having left (inactive state).
    await expect(page.getByTestId('vote-row-Grace')).toHaveAttribute('data-vote-state', 'inactive');
  });

  test('rejoining a room reactivates a previously inactive participant', async ({ page, browser, app }) => {
    const slug = await app.host(page, 'Ada');
    const guest = await app.join(browser, 'Grace', slug);

    await app.openMenu(guest);
    await guest.getByText(`leave ${slug}`).click();
    await expect(page.getByTestId('vote-row-Grace')).toHaveAttribute('data-vote-state', 'inactive');

    // Grace navigates back into the room; she is reactivated.
    await guest.goto(`/${slug}`);
    await app.roomReady(guest).waitFor();
    await expect(page.getByTestId('vote-row-Grace')).not.toHaveAttribute('data-vote-state', 'inactive');
  });
});

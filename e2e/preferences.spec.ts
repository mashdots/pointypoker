import { test, expect } from './support/fixtures';

test.describe('preferences', () => {
  test('renaming yourself updates your participant row for other players', async ({ page, browser, app }) => {
    const slug = await app.host(page, 'Ada');
    const guest = await app.join(browser, 'Grace', slug);

    // Guest initially sees the host as "Ada".
    await expect(guest.getByTestId('vote-row-Ada')).toBeVisible();

    await app.openPreferences(page, 'General');
    const nameInput = page.locator('#name-update');
    await nameInput.fill('Adelle');
    // Name update debounces for 1s before writing to the room.
    await page.waitForTimeout(1300);
    await app.closeModal(page);

    // The rename propagates to the guest's view of the participant list.
    await expect(guest.getByTestId('vote-row-Adelle')).toBeVisible();
    await expect(guest.getByTestId('vote-row-Ada')).toHaveCount(0);
  });

  test('switching the point scheme changes the available vote options', async ({ page, app }) => {
    await app.host(page, 'Ada');

    // Fibonacci (default) has no "4" option.
    await expect(page.getByTestId('vote-4')).toHaveCount(0);

    await app.openPreferences(page, 'General');
    await page.getByRole('radio', { name: /Sequential/ }).click();
    await app.closeModal(page);

    // Sequential exposes a contiguous range, including 4.
    await expect(page.getByTestId('vote-4')).toBeVisible();
  });
});

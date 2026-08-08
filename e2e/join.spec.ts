import { test, expect } from './support/fixtures';

test.describe('joining a room', () => {
  test('a second participant joins via the room URL and appears to the host', async ({ page, browser, app }) => {
    const slug = await app.host(page, 'Ada');

    const guest = await app.join(browser, 'Grace', slug);
    expect(new URL(guest.url()).pathname).toBe(`/${slug}`);

    // Host sees Grace's vote row; guest sees their own row as "you".
    await expect(page.getByTestId('vote-row-Grace')).toBeVisible();
    await expect(guest.getByTestId('vote-row-Grace')).toContainText('you');
  });

  test('navigating to a nonexistent room redirects home', async ({ page, app }) => {
    // Sign in without creating a room, so the join path runs fresh (no existing
    // room subscription to short-circuit it).
    await page.goto('/');
    await app.signIn(page, 'Ada');
    await expect(page.getByRole('heading', { name: 'ready to start?' })).toBeVisible();

    await page.goto('/this-room-does-not-exist-zzz');

    // watchRoom reports the missing room as an error and the app routes home.
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { name: 'ready to start?' })).toBeVisible();
  });
});

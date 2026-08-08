import { test, expect } from './support/fixtures';

test.describe('auth & room setup', () => {
  test('a first-time visitor picks a name and lands on the setup card', async ({ page }) => {
    await page.goto('/');

    // The name-entry card is shown first.
    await expect(page.getByText('what do we call you?')).toBeVisible();

    await page.getByPlaceholder('your name').fill('Ada');
    await page.getByPlaceholder('your name').press('Enter');

    // After signing in, the "ready to start?" setup card appears.
    await expect(page.getByRole('heading', { name: 'ready to start?' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'start a session' })).toBeVisible();
  });

  test('creating a room routes to a slug URL and opens the room', async ({ page, app }) => {
    const slug = await app.host(page, 'Ada');

    // URL now carries the generated room slug.
    expect(slug.length).toBeGreaterThan(0);
    expect(new URL(page.url()).pathname).toBe(`/${slug}`);

    // Room chrome is present.
    await expect(app.roomReady(page)).toBeVisible();
    await expect(page).toHaveTitle(/pointy poker/i);
  });
});

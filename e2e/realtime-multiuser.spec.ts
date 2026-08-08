import { test, expect } from './support/fixtures';

test.describe('real-time multi-user', () => {
  test('a guest vote propagates to the host in real time and reveals when all vote', async ({ page, browser, app }) => {
    const slug = await app.host(page, 'Ada');
    const guest = await app.join(browser, 'Grace', slug);

    await app.createTicket(page, 'Estimate the checkout flow');

    // Host votes; not everyone has voted yet, so results stay hidden.
    await app.castVote(page, 3);
    await expect(page.getByTestId('result-value-suggested')).toBeEmpty();

    // Host sees Grace's row register a vote once she votes (before reveal it shows the "voted" state).
    await app.castVote(guest, 8);

    // All active participants have voted → both clients auto-reveal.
    await expect(page.getByTestId('result-value-average')).not.toBeEmpty();
    await expect(guest.getByTestId('result-value-average')).not.toBeEmpty();

    // Revealed numeric votes are visible on the host for both participants.
    await expect(page.getByTestId('vote-row-Ada')).toContainText('3');
    await expect(page.getByTestId('vote-row-Grace')).toContainText('8');
  });

  test('the host can force a reveal with "show votes"', async ({ page, browser, app }) => {
    const slug = await app.host(page, 'Ada');
    const guest = await app.join(browser, 'Grace', slug);

    await app.createTicket(page, 'Estimate the search bar');

    await app.castVote(page, 5);
    // Only the host has voted; force reveal without waiting for Grace.
    await page.getByRole('button', { name: 'show votes' }).click();

    await expect(page.getByTestId('result-value-suggested')).not.toBeEmpty();
    // Reveal propagates to the guest too.
    await expect(guest.getByTestId('result-value-suggested')).not.toBeEmpty();
  });

  test('unanimous votes render a consensus in the distribution panel', async ({ page, browser, app }) => {
    const slug = await app.host(page, 'Ada');
    const guest = await app.join(browser, 'Grace', slug);

    await app.createTicket(page, 'Estimate the footer');

    await app.castVote(page, 5);
    await app.castVote(guest, 5);

    await expect(page.getByText('distribution')).toBeVisible();
    // Everyone agreed on 5 — the suggested value is 5 on both clients.
    await expect(page.getByTestId('result-value-suggested')).toHaveText('5');
    await expect(guest.getByTestId('result-value-suggested')).toHaveText('5');
  });
});

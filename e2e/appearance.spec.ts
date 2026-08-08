import { test, expect } from './support/fixtures';

test.describe('appearance', () => {
  test('toggling color mode flips the current mode label', async ({ page, app }) => {
    await app.host(page, 'Ada');
    await app.openPreferences(page, 'Appearance');

    const modeValue = page.getByTestId('color-mode-value');
    const before = (await modeValue.textContent())?.trim() ?? '';
    expect(before.length).toBeGreaterThan(0);

    await page.locator('#color-mode-toggle').click();

    await expect(modeValue).not.toHaveText(before);
  });

  test('selecting a theme swatch persists the chosen theme', async ({ page, app }) => {
    await app.host(page, 'Ada');
    await app.openPreferences(page, 'Appearance');

    // Theme swatches are <label>s wrapping a hidden radio; click the label.
    const swatches = page.locator('label:has(input[name="theme"])');
    const count = await swatches.count();
    expect(count).toBeGreaterThan(1);

    const value = await swatches.nth(1).locator('input[name="theme"]').getAttribute('value');
    await swatches.nth(1).click();

    // The selection is written through to persisted preferences.
    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem('theme')))
      .toBe(JSON.stringify(value));
  });
});

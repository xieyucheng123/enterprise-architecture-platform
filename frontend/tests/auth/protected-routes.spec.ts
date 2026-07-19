// spec: specs/eap-test-plan.md
import { test, expect } from '@playwright/test';
import { login, ensureLoggedOut } from '../helpers/auth';

test.describe('Authentication - Protected Routes', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedOut(page);
  });

  test('Unauthenticated user redirected from protected routes', async ({ page }) => {
    const protectedRoutes = [
      '/architectures/value-streams',
      '/architectures/capabilities',
      '/architectures/processes',
    ];

    for (const route of protectedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL('/login');
      await expect(page.getByText('企业架构平台')).toBeVisible();
      await page.evaluate(() => localStorage.clear());
    }
  });

  test('Authenticated user can access protected routes', async ({ page }) => {
    await login(page);

    const routes = [
      { url: '/architectures/value-streams', text: '价值流' },
      { url: '/architectures/capabilities', text: '业务能力' },
      { url: '/architectures/processes', text: '业务流程' },
    ];

    for (const r of routes) {
      await page.goto(r.url);
      await expect(page).toHaveURL(r.url);
      await expect(page.getByText(r.text)).toBeVisible({ timeout: 5000 });
    }
  });

  test('Session persistence across navigation', async ({ page }) => {
    await login(page);

    await page.goto('/architectures/capabilities');
    await expect(page).toHaveURL('/architectures/capabilities');

    await page.goto('/architectures/processes');
    await expect(page).toHaveURL('/architectures/processes');

    await page.goto('/architectures/value-streams');
    await expect(page).toHaveURL('/architectures/value-streams');
  });

  test('Manual token removal triggers logout', async ({ page }) => {
    await login(page);

    await page.evaluate(() => localStorage.removeItem('access_token'));
    await page.reload();

    await expect(page).toHaveURL('/login', { timeout: 5000 });
  });
});

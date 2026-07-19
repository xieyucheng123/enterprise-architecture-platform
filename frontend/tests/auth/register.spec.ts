// spec: specs/eap-test-plan.md
import { test, expect } from '@playwright/test';

test.describe('Authentication - Registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('Happy Path - User Registration', async ({ page }) => {
    await page.goto('/login');
    
    // Click register tab
    await page.getByRole('tab', { name: '注册' }).click();
    await page.waitForTimeout(300);
    
    // Generate unique email
    const uniqueEmail = `test${Date.now()}@example.com`;
    
    // Fill registration form
    await page.fill('#reg-name', '测试用户');
    await page.fill('#reg-email', uniqueEmail);
    await page.fill('#reg-password', 'Password123!');
    await page.press('#reg-password', 'Enter');
    
    // Verify redirect to value streams
    await expect(page).toHaveURL('/architectures/value-streams', { timeout: 10000 });
    await expect(page.getByText('测试用户')).toBeVisible({ timeout: 5000 });
  });

  test('Edge Case - Empty Fields Validation', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('tab', { name: '注册' }).click();
    await page.waitForTimeout(300);
    
    // Try to submit empty form - browser validation should prevent it
    await page.press('#reg-password', 'Enter');
    
    // Should still be on login page
    await expect(page).toHaveURL('/login');
  });

  test('Edge Case - Invalid Email Format', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('tab', { name: '注册' }).click();
    await page.waitForTimeout(300);
    
    await page.fill('#reg-name', '测试用户');
    await page.fill('#reg-email', 'invalid-email');
    await page.fill('#reg-password', 'Password123!');
    await page.press('#reg-password', 'Enter');
    
    // Browser email validation should prevent submission
    await expect(page).toHaveURL('/login');
  });

  test('Edge Case - Duplicate Email', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('tab', { name: '注册' }).click();
    await page.waitForTimeout(300);
    
    // Use existing email
    await page.fill('#reg-name', '重复用户');
    await page.fill('#reg-email', 'e2e2@test.com');
    await page.fill('#reg-password', 'Password123!');
    await page.press('#reg-password', 'Enter');
    
    // Should show error and stay on login page
    await expect(page.getByText(/already exists|conflict/i)).toBeVisible({ timeout: 5000 });
    await expect(page).toHaveURL('/login');
  });
});

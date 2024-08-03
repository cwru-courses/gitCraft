import { test, expect } from '@playwright/test';


test('user/login', async ({ page }) => {
  await page.goto('https://merry-khapse-6dd1d8.netlify.app/');
  await page.getByPlaceholder('pat@example.com').click();
  await page.getByPlaceholder('pat@example.com').fill('lxp334@case.edu');
  await page.getByPlaceholder('pat@example.com').press('Tab');
  await page.getByLabel('Enter your password').fill('Lokesh@2');
  await page.getByLabel('Enter your password').press('Tab');
  await page.getByRole('button', { name: 'Login' }).press('Shift+Enter');
  await expect(page).toHaveTitle(/GitCraftNg/);
  await expect(page.getByRole('tab', { name: 'Community' })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Public' })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Private' })).toBeVisible();
});



test('user/signup', async ({ page }) => {
  await page.goto('https://merry-khapse-6dd1d8.netlify.app/');
  await page.getByRole('button', { name: 'Want to sign up?' }).click();
  await page.getByText('Enter your name').click();
  await page.getByPlaceholder('john_doe').fill('lokesh');
  await page.getByPlaceholder('john_doe').press('Tab');
  await page.getByPlaceholder('pat@example.com').click();
  await page.getByPlaceholder('pat@example.com').fill('lokeshlo2@gmail.com');
  await page.getByText('Enter your password').click();
  await page.getByLabel('Enter your password').fill('Lokesh@2');
  await page.getByLabel('Hide password').click();
  await page.getByLabel('Hide password').click();
  await page.getByRole('button', { name: 'Signup' }).click();
  await page.getByText('Verify Account').click();
  await expect(page.getByText('Verify Account')).toBeVisible();
});

test('user/logout', async ({ page }) => {
  await page.goto('https://merry-khapse-6dd1d8.netlify.app/');
  await page.getByPlaceholder('pat@example.com').click();
  await page.getByPlaceholder('pat@example.com').fill('lxp334@case.edu');
  await page.getByPlaceholder('pat@example.com').press('Tab');
  await page.getByLabel('Enter your password').fill('Lokesh@2');
  await page.getByLabel('Enter your password').press('Tab');
  await page.getByRole('button', { name: 'Login' }).press('Shift+Enter');
  await expect(page).toHaveTitle(/GitCraftNg/);
  await expect(page.getByRole('tab', { name: 'Community' })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Public' })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Private' })).toBeVisible();
  await page.locator('button').filter({ hasText: 'logout' }).click();
  await expect(page.getByText('Log In')).toBeVisible();
});

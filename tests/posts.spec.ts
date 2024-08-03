import { test, expect } from '@playwright/test';


test('post/create', async ({ page }) => {
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
  await page.getByLabel('Speed Dial').click();
  await page.getByRole('menuitem', { name: 'Create' }).click();
  await expect(page.getByText('Create Post post_add')).toBeVisible();
});



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


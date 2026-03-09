import { test, expect, Page } from '@playwright/test';

test('Debug: Create Task', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  
  console.log('1. Clicking add button...');
  await page.click('[aria-label="添加新任务"]');
  
  console.log('2. Waiting for modal...');
  await page.waitForSelector('.task-form-modal', { state: 'visible', timeout: 5000 });
  
  console.log('3. Fill title...');
  await page.fill('#title', '测试任务1');
  
  console.log('4. Click submit button...');
  await page.click('.btn-primary:has-text("添加任务")');
  
  console.log('5. Wait for modal to hide...');
  await page.waitForTimeout(2000);
  
  const modalVisible = await page.locator('.task-form-modal').isVisible();
  console.log('Modal visible after submit:', modalVisible);
  
  const taskCount = await page.locator('.task-card').count();
  console.log('Task count:', taskCount);
});

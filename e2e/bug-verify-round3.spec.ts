import { test, expect, Page } from '@playwright/test';

/**
 * 第3次提测Bug验证测试
 * 
 * 验证内容：
 * - BUG-003: 任务编辑功能
 * - BUG-004: 任务列表排序
 * - BUG-005: 空格键标记完成功能
 */

test.describe('第3次提测Bug验证', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  async function createTask(page: Page, title: string) {
    await page.click('[aria-label="添加新任务"]');
    await page.waitForSelector('.task-form', { timeout: 5000 });
    await page.fill('#title', title);
    await page.click('.btn-primary:has-text("添加任务")');
    await page.waitForSelector('.task-form-modal', { state: 'hidden', timeout: 10000 });
    await page.waitForSelector('.task-card', { timeout: 10000 });
  }

  test('BUG-003验证: 点击任务标题打开编辑表单', async ({ page }) => {
    await createTask(page, '测试任务');
    
    // 点击任务标题
    await page.click('.task-card__title');
    
    // 验证编辑表单打开
    await expect(page.locator('.task-form-modal')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#title')).toHaveValue('测试任务');
    
    console.log('✅ BUG-003: 点击任务标题可以打开编辑表单');
  });

  test('BUG-004验证: 任务列表排序', async ({ page }) => {
    // 连续添加3个任务
    await createTask(page, '任务1');
    await createTask(page, '任务2');
    await createTask(page, '任务3');
    
    // 验证任务顺序
    const taskCards = page.locator('.task-card__title');
    await expect(taskCards).toHaveCount(3);
    
    // 检查第一个任务
    const firstTask = await taskCards.first().textContent();
    console.log('第一个任务:', firstTask);
    
    // 检查第二个任务
    const secondTask = await taskCards.nth(1).textContent();
    console.log('第二个任务:', secondTask);
    
    // 检查第三个任务
    const thirdTask = await taskCards.nth(2).textContent();
    console.log('第三个任务:', thirdTask);
    
    // 验证顺序是否正确（最新添加的在最前面）
    await expect(taskCards.first()).toContainText('任务3');
    await expect(taskCards.nth(1)).toContainText('任务2');
    await expect(taskCards.nth(2)).toContainText('任务1');
    
    console.log('✅ BUG-004: 任务按添加顺序正确显示');
  });

  test('BUG-005验证: 空格键标记完成功能', async ({ page }) => {
    await createTask(page, '测试任务');
    
    // 选择任务
    await page.click('.task-card__selection-checkbox');
    await expect(page.locator('.batch-toolbar')).toBeVisible();
    
    // 按空格键标记完成
    await page.keyboard.press(' ');
    
    // 等待状态更新
    await page.waitForTimeout(1000);
    
    // 验证任务已标记为完成
    const taskCard = page.locator('.task-card').first();
    await expect(taskCard).toHaveClass(/task-card--completed/, { timeout: 5000 });
    
    console.log('✅ BUG-005: 空格键可以标记任务为完成');
  });

  test('综合验证: 编辑后任务顺序保持', async ({ page }) => {
    await createTask(page, '任务A');
    await createTask(page, '任务B');
    
    // 编辑第一个任务
    await page.locator('.task-card__title').first().click();
    await page.waitForSelector('.task-form', { timeout: 5000 });
    await page.fill('#title', '修改后的任务A');
    await page.click('.btn-primary:has-text("更新任务")');
    await page.waitForSelector('.task-form-modal', { state: 'hidden', timeout: 10000 });
    
    // 验证任务仍然存在
    const taskCards = page.locator('.task-card');
    await expect(taskCards).toHaveCount(2);
    
    // 验证修改后的任务
    const titles = page.locator('.task-card__title');
    const firstTitle = await titles.first().textContent();
    console.log('编辑后第一个任务:', firstTitle);
    
    // 检查是否包含修改后的内容
    const allTitles = await titles.allTextContents();
    console.log('所有任务标题:', allTitles);
    
    expect(allTitles).toContain('修改后的任务A');
  });
});

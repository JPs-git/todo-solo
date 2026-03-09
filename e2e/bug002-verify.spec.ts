import { test, expect, Page } from '@playwright/test';

/**
 * Bug #002 验证测试：全选按钮问题
 * 
 * 测试目标：验证全选按钮的行为
 */

test.describe('Bug #002 验证：全选按钮问题', () => {
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

  test('验证全选按钮状态', async ({ page }) => {
    // 添加一个任务
    await createTask(page, '测试任务');
    
    // 选择任务
    await page.click('.task-card__selection-checkbox');
    
    // 验证批量工具栏显示
    await expect(page.locator('.batch-toolbar')).toBeVisible();
    await expect(page.locator('.batch-toolbar__count')).toContainText('已选择 1 个任务');
    
    // 检查全选按钮状态
    const selectAllButton = page.locator('[data-testid="select-all-button"]');
    const isDisabled = await selectAllButton.isDisabled();
    
    console.log('全选按钮是否禁用:', isDisabled);
    
    // 检查全选按钮文本
    const buttonText = await selectAllButton.textContent();
    console.log('全选按钮文本:', buttonText);
    
    // 检查全选按钮是否存在
    const buttonExists = await selectAllButton.count() > 0;
    console.log('全选按钮是否存在:', buttonExists);
    
    // 尝试点击全选按钮（应该被禁用）
    try {
      await selectAllButton.click();
      console.log('成功点击全选按钮');
    } catch (error) {
      console.log('点击全选按钮失败:', error.message);
    }
    
    // 验证状态
    await expect(page.locator('.batch-toolbar__count')).toContainText('已选择 1 个任务');
  });

  test('验证多个任务时的全选按钮', async ({ page }) => {
    // 添加两个任务
    await createTask(page, '任务1');
    await createTask(page, '任务2');
    
    // 选择一个任务
    await page.locator('.task-card__selection-checkbox').first().click();
    
    // 验证批量工具栏显示
    await expect(page.locator('.batch-toolbar')).toBeVisible();
    await expect(page.locator('.batch-toolbar__count')).toContainText('已选择 1 个任务');
    
    // 检查全选按钮状态（应该可用）
    const selectAllButton = page.locator('[data-testid="select-all-button"]');
    const isDisabled = await selectAllButton.isDisabled();
    
    console.log('两个任务时全选按钮是否禁用:', isDisabled);
    
    // 点击全选按钮
    if (!isDisabled) {
      await selectAllButton.click();
      await expect(page.locator('.batch-toolbar__count')).toContainText('已选择 2 个任务');
      console.log('成功点击全选按钮，所有任务已选中');
    }
  });
});

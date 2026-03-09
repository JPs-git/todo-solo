import { test, expect } from '@playwright/test';

/**
 * BUG 验证测试：连续添加任务问题
 * 
 * BUG 描述：连续添加两个新任务，第二个新任务无法修改任务标题等任何内容，也无法点击添加任务按钮
 * 
 * 测试目标：验证 BUG 是否存在
 */

test.describe('BUG验证：连续添加任务问题', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('验证连续添加两个任务的BUG', async ({ page }) => {
    // 步骤1：添加第一个任务
    await page.click('[aria-label="添加新任务"]');
    await page.waitForSelector('.task-form', { timeout: 5000 });
    
    // 验证输入框可用
    const titleInput1 = page.locator('#title');
    await expect(titleInput1).toBeEnabled();
    
    await page.fill('#title', '第一个任务');
    await page.click('.btn-primary:has-text("添加任务")');
    
    // 等待第一个任务创建成功
    await page.waitForSelector('.task-form-modal', { state: 'hidden', timeout: 10000 });
    await page.waitForSelector('.task-card', { timeout: 10000 });
    
    // 验证第一个任务已创建
    await expect(page.locator('.task-card__title')).toContainText('第一个任务');
    
    // 步骤2：添加第二个任务
    await page.click('[aria-label="添加新任务"]');
    await page.waitForSelector('.task-form', { timeout: 5000 });
    
    // 验证输入框状态
    const titleInput2 = page.locator('#title');
    const isEnabled = await titleInput2.isEnabled();
    
    // 记录输入框状态
    console.log('第二个任务输入框是否可用:', isEnabled);
    
    // 尝试填写第二个任务
    await page.fill('#title', '第二个任务');
    
    // 验证添加按钮状态
    const submitButton = page.locator('.btn-primary:has-text("添加任务")');
    const buttonIsVisible = await submitButton.isVisible();
    const buttonIsEnabled = await submitButton.isEnabled();
    
    console.log('添加按钮是否可见:', buttonIsVisible);
    console.log('添加按钮是否可用:', buttonIsEnabled);
    
    // 如果输入框被禁用，记录BUG
    if (!isEnabled) {
      console.log('BUG确认：第二个任务的输入框被禁用');
    }
    
    // 尝试点击添加按钮
    if (buttonIsEnabled) {
      await page.click('.btn-primary:has-text("添加任务")');
      await page.waitForSelector('.task-card', { timeout: 5000 });
      
      // 验证第二个任务是否创建成功
      const taskCards = page.locator('.task-card');
      const count = await taskCards.count();
      console.log('任务数量:', count);
      
      if (count === 1) {
        console.log('BUG确认：第二个任务未能成功创建');
      }
    }
    
    // 预期结果：应该可以连续添加任意个任务
    // 实际结果（BUG）：第二个任务无法修改任何内容，也无法点击添加任务按钮
    await expect(isEnabled).toBe(true);
    await expect(buttonIsEnabled).toBe(true);
  });
});

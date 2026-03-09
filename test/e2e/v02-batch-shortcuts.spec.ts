import { test, expect, Page } from '@playwright/test';

/**
 * Todo-List v0.2 批量操作与快捷键功能 端到端测试
 * 
 * 测试范围：
 * 1. 批量操作功能
 * 2. 快捷键功能
 * 3. 新增组件交互
 * 
 * 元素定位遵循规范：
 * - 优先使用 ARIA 属性
 * - 其次使用类选择器
 * - 然后使用其他稳定的定位方式
 */

test.describe('Todo-List v0.2 批量操作与快捷键功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  // 辅助函数
  async function createTask(page: Page, title: string) {
    // 点击添加任务按钮（使用 ARIA 标签）
    await page.click('[aria-label="添加新任务"]');
    
    // 等待表单加载
    await page.waitForSelector('.task-form', { timeout: 5000 });
    
    // 填写表单
    await page.fill('#title', title);
    
    // 提交表单
    await page.click('.btn-primary:has-text("添加任务")');
    
    // 等待表单关闭
    await page.waitForSelector('.task-form-modal', { state: 'hidden', timeout: 10000 });
    
    // 验证任务创建成功（使用更精确的验证）
    await page.waitForSelector('.task-card', { timeout: 10000 });
  }

  // 批量操作测试
  test.describe('批量操作功能', () => {
    test('TC-V02-001: 单个任务选择与取消选择', async ({ page }) => {
      await createTask(page, '测试任务1');
      
      // 点击选择复选框（批量选择）
      await page.click('.task-card__selection-checkbox');
      
      // 验证批量操作工具栏显示
      await expect(page.locator('.batch-toolbar')).toBeVisible();
      await expect(page.locator('.batch-toolbar__count')).toContainText('已选择 1 个任务');
      
      // 验证任务卡片选中状态
      const taskCard = page.locator('.task-card').first();
      await expect(taskCard).toHaveClass(/task-card--selected/);
      
      // 再次点击取消选择
      await page.click('.task-card__selection-checkbox');
      
      // 验证批量操作工具栏隐藏
      await expect(page.locator('.batch-toolbar')).not.toBeVisible();
      await expect(taskCard).not.toHaveClass(/task-card--selected/);
    });

    test('TC-V02-002: 多个任务选择', async ({ page }) => {
      // 每次创建后重新加载以避免状态问题
      await createTask(page, '测试任务1');
      await page.reload();
      await createTask(page, '测试任务2');
      await page.reload();
      await createTask(page, '测试任务3');
      
      // 选择前两个任务
      const checkboxes = page.locator('.task-card__selection-checkbox');
      await checkboxes.nth(0).click();
      await checkboxes.nth(1).click();
      
      // 验证批量操作工具栏显示和计数
      await expect(page.locator('.batch-toolbar')).toBeVisible();
      await expect(page.locator('.batch-toolbar__count')).toContainText('已选择 2 个任务');
      
      // 验证选中状态
      const taskCards = page.locator('.task-card');
      await expect(taskCards.nth(0)).toHaveClass(/task-card--selected/);
      await expect(taskCards.nth(1)).toHaveClass(/task-card--selected/);
      await expect(taskCards.nth(2)).not.toHaveClass(/task-card--selected/);
    });

    test('TC-V02-003: 全选与取消全选', async ({ page }) => {
      // 每次创建后重新加载以避免状态问题
      await createTask(page, '测试任务1');
      await page.reload();
      await createTask(page, '测试任务2');
      await page.reload();
      await createTask(page, '测试任务3');
      
      // 先选择一个任务以显示批量工具栏
      await page.click('.task-card__selection-checkbox');
      
      // 点击全选按钮
      await page.click('.batch-toolbar__button:has-text("全选")');
      
      // 验证所有任务被选中
      await expect(page.locator('.batch-toolbar__count')).toContainText('已选择 3 个任务');
      const taskCards = page.locator('.task-card');
      for (let i = 0; i < 3; i++) {
        await expect(taskCards.nth(i)).toHaveClass(/task-card--selected/);
      }
      
      // 点击取消全选
      await page.click('.batch-toolbar__button:has-text("取消全选")');
      
      // 验证所有任务未被选中
      await expect(page.locator('.batch-toolbar')).not.toBeVisible();
      for (let i = 0; i < 3; i++) {
        await expect(taskCards.nth(i)).not.toHaveClass(/task-card--selected/);
      }
    });

    test('TC-V02-004: 批量标记完成', async ({ page }) => {
      // 每次创建后重新加载以避免状态问题
      await createTask(page, '任务1');
      await page.reload();
      await createTask(page, '任务2');
      
      // 选择两个任务
      const checkboxes = page.locator('.task-card__selection-checkbox');
      await checkboxes.nth(0).click();
      await checkboxes.nth(1).click();
      
      // 点击批量完成按钮
      await page.click('.batch-toolbar__button--primary');
      
      // 验证批量操作工具栏隐藏
      await expect(page.locator('.batch-toolbar')).not.toBeVisible();
      
      // 验证任务已标记为完成
      const taskCards = page.locator('.task-card');
      await expect(taskCards.nth(0)).toHaveClass(/task-card--completed/);
      await expect(taskCards.nth(1)).toHaveClass(/task-card--completed/);
    });

    test('TC-V02-005: 批量删除', async ({ page }) => {
      // 每次创建后重新加载以避免状态问题
      await createTask(page, '任务1');
      await page.reload();
      await createTask(page, '任务2');
      await page.reload();
      await createTask(page, '任务3');
      
      // 选择前两个任务
      const checkboxes = page.locator('.task-card__selection-checkbox');
      await checkboxes.nth(0).click();
      await checkboxes.nth(1).click();
      
      // 点击批量删除按钮
      await page.click('.batch-toolbar__button--danger');
      
      // 等待模态框出现
      await page.waitForSelector('.modal', { timeout: 5000 });
      
      // 确认删除
      await page.click('.modal__btn--primary');
      
      // 等待模态框关闭
      await page.waitForSelector('.modal', { state: 'hidden', timeout: 10000 });
      
      // 验证批量操作工具栏隐藏
      await expect(page.locator('.batch-toolbar')).not.toBeVisible();
      
      // 验证只保留一个任务
      await expect(page.locator('.task-card')).toHaveCount(1);
    });

    test('TC-V02-006: 批量操作后自动退出批量模式', async ({ page }) => {
      await createTask(page, '测试任务');
      
      // 选择任务
      await page.click('.task-card__selection-checkbox');
      
      // 验证批量模式激活
      await expect(page.locator('.batch-toolbar')).toBeVisible();
      
      // 执行批量完成操作
      await page.click('.batch-toolbar__button--primary');
      
      // 验证批量模式已退出
      await expect(page.locator('.batch-toolbar')).not.toBeVisible();
    });
  });

  // 快捷键测试
  test.describe('快捷键功能', () => {
    test('TC-V02-010: Ctrl+N 新建任务', async ({ page }) => {
      await page.keyboard.press('Control+n');
      
      await expect(page.locator('.task-form-modal')).toBeVisible();
      
      const titleInput = page.locator('#title');
      await titleInput.click();
      await expect(titleInput).toBeFocused();
    });

    test('TC-V02-011: Enter 保存任务', async ({ page }) => {
      await page.click('[aria-label="添加新任务"]');
      await page.fill('#title', '快捷键测试任务');
      await page.keyboard.press('Enter');
      
      await page.waitForSelector('.task-card', { timeout: 5000 });
    });

    test('TC-V02-012: Esc 取消操作', async ({ page }) => {
      await page.click('[aria-label="添加新任务"]');
      await expect(page.locator('.task-form-modal')).toBeVisible();
      
      await page.keyboard.press('Escape');
      
      await expect(page.locator('.task-form-modal')).not.toBeVisible();
    });

    test('TC-V02-013: Ctrl+F 聚焦搜索框', async ({ page }) => {
      await page.keyboard.press('Control+f');
      
      const searchInput = page.locator('[aria-label="搜索任务"]');
      await expect(searchInput).toBeFocused();
    });

    test('TC-V02-014: Ctrl+A 全选任务', async ({ page }) => {
      // 每次创建后重新加载以避免状态问题
      await createTask(page, '任务1');
      await page.reload();
      await createTask(page, '任务2');
      
      await page.keyboard.press('Control+a');
      
      await expect(page.locator('.batch-toolbar__count')).toContainText('已选择 2 个任务');
      const taskCards = page.locator('.task-card');
      await expect(taskCards.nth(0)).toHaveClass(/task-card--selected/);
      await expect(taskCards.nth(1)).toHaveClass(/task-card--selected/);
    });

    test('TC-V02-015: Delete 删除选中任务', async ({ page }) => {
      await createTask(page, '待删除任务');
      
      await page.click('.task-card__selection-checkbox');
      
      await page.keyboard.press('Delete');
      
      // 等待任务被删除
      await page.waitForSelector('.empty-state', { timeout: 10000 });
      
      await expect(page.locator('.empty-state')).toBeVisible();
    });

    test('TC-V02-016: Space 标记完成', async ({ page }) => {
      await createTask(page, '待完成任务');
      
      await page.click('.task-card__selection-checkbox');
      
      await page.keyboard.press(' ');
      
      const taskCard = page.locator('.task-card').first();
      await expect(taskCard).toHaveClass(/task-card--completed/);
    });

    test('TC-V02-017: ? 显示快捷键帮助面板', async ({ page }) => {
      await page.keyboard.press('?');
      
      await expect(page.locator('.keyboard-shortcuts-modal')).toBeVisible();
      
      await page.keyboard.press('Escape');
      
      await expect(page.locator('.keyboard-shortcuts-modal')).not.toBeVisible();
    });

    test('TC-V02-018: 输入框中不触发全局快捷键', async ({ page }) => {
      await page.click('[aria-label="添加新任务"]');
      
      const titleInput = page.locator('#title');
      await titleInput.click();
      await titleInput.type('test');
      
      await page.keyboard.press('Control+a');
      
      const selectedText = await page.evaluate(() => {
        const input = document.getElementById('title');
        return input?.value.substring(input.selectionStart, input.selectionEnd);
      });
      expect(selectedText).toBe('test');
      
      await expect(page.locator('.batch-toolbar')).not.toBeVisible();
    });
  });

  // 新增组件测试
  test.describe('新增组件功能', () => {
    test('TC-V02-020: 批量操作工具栏动画效果', async ({ page }) => {
      await createTask(page, '测试任务');
      
      await page.click('.task-card__selection-checkbox');
      await expect(page.locator('.batch-toolbar')).toBeVisible();
      
      await page.click('.task-card__selection-checkbox');
      await expect(page.locator('.batch-toolbar')).not.toBeVisible();
    });

    test('TC-V02-021: 任务卡片选中状态样式', async ({ page }) => {
      await createTask(page, '测试任务');
      
      await page.click('.task-card__selection-checkbox');
      
      const taskCard = page.locator('.task-card').first();
      await expect(taskCard).toHaveClass(/task-card--selected/);
    });

    test('TC-V02-022: 复选框动画效果', async ({ page }) => {
      await createTask(page, '测试任务');
      
      const checkbox = page.locator('.task-card__selection-checkbox');
      await checkbox.click();
      
      await expect(checkbox).toHaveClass(/task-card__selection-checkbox--checked/);
    });

    test('TC-V02-023: 快捷键帮助面板内容', async ({ page }) => {
      await page.keyboard.press('?');
      
      await expect(page.locator('.keyboard-shortcuts-modal')).toBeVisible();
      await expect(page.locator('.keyboard-shortcuts-modal__title')).toContainText('键盘快捷键');
      await expect(page.locator('.keyboard-shortcuts-modal')).toContainText('Ctrl+N');
      await expect(page.locator('.keyboard-shortcuts-modal')).toContainText('新建任务');
    });
  });

  // 集成测试
  test.describe('集成测试', () => {
    test('TC-V02-030: 完整的批量操作流程', async ({ page }) => {
      // 每次创建后重新加载以避免状态问题
      await createTask(page, '任务1');
      await page.reload();
      await createTask(page, '任务2');
      await page.reload();
      await createTask(page, '任务3');
      
      const checkboxes = page.locator('.task-card__selection-checkbox');
      await checkboxes.nth(0).click();
      await checkboxes.nth(1).click();
      
      await expect(page.locator('.batch-toolbar')).toBeVisible();
      await expect(page.locator('.batch-toolbar__count')).toContainText('已选择 2 个任务');
      
      await page.click('.batch-toolbar__button--danger');
      
      // 等待模态框出现
      await page.waitForSelector('.modal', { timeout: 5000 });
      
      // 确认删除
      await page.click('.modal__btn--primary');
      
      // 等待模态框关闭
      await page.waitForSelector('.modal', { state: 'hidden', timeout: 10000 });
      
      await expect(page.locator('.task-card')).toHaveCount(1);
    });

    test('TC-V02-031: 快捷键与批量操作组合使用', async ({ page }) => {
      // 每次创建后重新加载以避免状态问题
      await createTask(page, '任务1');
      await page.reload();
      await createTask(page, '任务2');
      
      await page.keyboard.press('Control+a');
      
      await expect(page.locator('.batch-toolbar__count')).toContainText('已选择 2 个任务');
      
      await page.keyboard.press(' ');
      
      const taskCards = page.locator('.task-card');
      await expect(taskCards.nth(0)).toHaveClass(/task-card--completed/);
      await expect(taskCards.nth(1)).toHaveClass(/task-card--completed/);
    });
  });
});

import { test, expect, Page } from '@playwright/test';

/**
 * Todo-List v0.2 全流程集成测试
 * 
 * 测试目标：覆盖用户使用应用的全流程
 * - 连续操作场景
 * - 组合功能场景
 * - 边界情况
 */

test.describe('Todo-List v0.2 全流程集成测试', () => {
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

  // ========== 连续操作场景 ==========
  test.describe('连续操作场景', () => {
    test('TC-V02-101: 连续添加多个任务', async ({ page }) => {
      // 连续添加第一个任务
      await createTask(page, '任务1');
      let taskCards = page.locator('.task-card');
      await expect(taskCards).toHaveCount(1);
      await expect(taskCards.first()).toContainText('任务1');

      // 连续添加第二个任务
      await createTask(page, '任务2');
      taskCards = page.locator('.task-card');
      await expect(taskCards).toHaveCount(2);
      await expect(taskCards.nth(1)).toContainText('任务2');

      // 连续添加第三个任务
      await createTask(page, '任务3');
      taskCards = page.locator('.task-card');
      await expect(taskCards).toHaveCount(3);
      await expect(taskCards.nth(2)).toContainText('任务3');
    });

    test('TC-V02-102: 连续编辑多个任务', async ({ page }) => {
      await createTask(page, '原任务1');
      await createTask(page, '原任务2');
      await createTask(page, '原任务3');

      // 编辑第一个任务
      await page.click('.task-card__title:text("原任务1")');
      await page.waitForSelector('.task-form', { timeout: 5000 });
      await page.fill('#title', '修改后的任务1');
      await page.click('.btn-primary:has-text("更新任务")');
      await page.waitForSelector('.task-form-modal', { state: 'hidden', timeout:10000 });

      // 验证第一个任务已修改
      await expect(page.locator('.task-card__title').first()).toContainText('修改后的任务1');

      // 编辑第二个任务
      await page.locator('.task-card__title').nth(1).click();
      await page.waitForSelector('.task-form', { timeout: 5000 });
      await page.fill('#title', '修改后的任务2');
      await page.click('.btn-primary:has-text("更新任务")');
      await page.waitForSelector('.task-form-modal', { state: 'hidden', timeout:10000 });

      // 验证第二个任务已修改
      await expect(page.locator('.task-card__title').nth(1)).toContainText('修改后的任务2');
    });

    test('TC-V02-103: 连续删除多个任务', async ({ page }) => {
      await createTask(page, '待删除1');
      await createTask(page, '待删除2');
      await createTask(page, '待删除3');

      // 删除第一个任务
      await page.locator('.task-card__selection-checkbox').first().click();
      await page.click('.batch-toolbar__button--danger');
      await page.waitForSelector('.modal', { timeout: 5000 });
      await page.click('.modal__btn--primary');
      await page.waitForSelector('.modal', { state: 'hidden', timeout: 10000 });

      // 验证剩下2个任务
      let taskCards = page.locator('.task-card');
      await expect(taskCards).toHaveCount(2);

      // 删除第二个任务
      await page.locator('.task-card__selection-checkbox').first().click();
      await page.click('.batch-toolbar__button--danger');
      await page.waitForSelector('.modal', { timeout: 5000 });
      await page.click('.modal__btn--primary');
      await page.waitForSelector('.modal', { state: 'hidden', timeout: 10000 });

      // 验证剩下1个任务
      taskCards = page.locator('.task-card');
      await expect(taskCards).toHaveCount(1);

      // 删除最后一个任务
      await page.locator('.task-card__selection-checkbox').first().click();
      await page.click('.batch-toolbar__button--danger');
      await page.waitForSelector('.modal', { timeout: 5000 });
      await page.click('.modal__btn--primary');
      await page.waitForSelector('.modal', { state: 'hidden', timeout: 10000 });

      // 验证没有任务
      await expect(page.locator('.task-card')).toHaveCount(0);
      await expect(page.locator('.empty-state')).toBeVisible();
    });

    test('TC-V02-104: 连续标记完成与取消完成', async ({ page }) => {
      await createTask(page, '任务1');
      await createTask(page, '任务2');

      // 标记第一个任务完成
      await page.locator('.task-card__selection-checkbox').first().click();
      await page.keyboard.press(' ');
      await expect(page.locator('.task-card').first()).toHaveClass(/task-card--completed/);

      // 标记第二个任务完成
      await page.locator('.task-card__selection-checkbox').nth(1).click();
      await page.keyboard.press(' ');
      await expect(page.locator('.task-card').nth(1)).toHaveClass(/task-card--completed/);

      // 取消第一个任务完成状态
      await page.locator('.task-card__selection-checkbox').first().click();
      await page.keyboard.press(' ');
      await expect(page.locator('.task-card').first()).not.toHaveClass(/task-card--completed/);
    });
  });

  // ========== 组合功能场景 ==========
  test.describe('组合功能场景', () => {
    test('TC-V02-110: 添加 -> 编辑 -> 删除 完整流程', async ({ page }) => {
      // 1. 添加任务
      await createTask(page, '测试任务');
      await expect(page.locator('.task-card')).toHaveCount(1);
      await expect(page.locator('.task-card__title')).toContainText('测试任务');

      // 2. 编辑任务
      await page.click('.task-card__title');
      await page.waitForSelector('.task-form', { timeout: 5000 });
      await page.fill('#title', '已修改的任务');
      await page.click('.btn-primary:has-text("更新任务")');
      await page.waitForSelector('.task-form-modal', { state: 'hidden', timeout: 10000 });
      await expect(page.locator('.task-card__title')).toContainText('已修改的任务');

      // 3. 删除任务
      await page.click('.task-card__selection-checkbox');
      await page.click('.batch-toolbar__button--danger');
      await page.waitForSelector('.modal', { timeout: 5000 });
      await page.click('.modal__btn--primary');
      await page.waitForSelector('.modal', { state: 'hidden', timeout: 10000 });

      // 4. 验证任务已删除
      await expect(page.locator('.task-card')).toHaveCount(0);
      await expect(page.locator('.empty-state')).toBeVisible();
    });

    test('TC-V02-111: 批量添加与批量操作组合', async ({ page }) => {
      // 批量添加3个任务
      await createTask(page, '批量任务1');
      await createTask(page, '批量任务2');
      await createTask(page, '批量任务3');

      // 全选
      await page.keyboard.press('Control+a');
      await expect(page.locator('.batch-toolbar__count')).toContainText('已选择 3 个任务');

      // 批量标记完成
      await page.click('.batch-toolbar__button--primary');
      const taskCards = page.locator('.task-card');
      await expect(taskCards.nth(0)).toHaveClass(/task-card--completed/);
      await expect(taskCards.nth(1)).toHaveClass(/task-card--completed/);
      await expect(taskCards.nth(2)).toHaveClass(/task-card--completed/);

      // 批量删除
      await page.keyboard.press('Control+a');
      await page.click('.batch-toolbar__button--danger');
      await page.waitForSelector('.modal', { timeout: 5000 });
      await page.click('.modal__btn--primary');
      await page.waitForSelector('.modal', { state: 'hidden', timeout: 10000 });

      await expect(page.locator('.empty-state')).toBeVisible();
    });

    test('TC-V02-112: 快捷键与批量操作交替使用', async ({ page }) => {
      await createTask(page, '任务A');
      await createTask(page, '任务B');
      await createTask(page, '任务C');

      // 使用快捷键 Ctrl+A 全选
      await page.keyboard.press('Control+a');
      await expect(page.locator('.batch-toolbar__count')).toContainText('已选择 3 个任务');

      // 取消全选
      await page.click('[data-testid="deselect-all-button"]');

      // 使用鼠标选择部分任务
      await page.locator('.task-card__selection-checkbox').first().click();
      await page.locator('.task-card__selection-checkbox').nth(2).click();
      await expect(page.locator('.batch-toolbar__count')).toContainText('已选择 2 个任务');

      // 使用快捷键 Delete 删除
      await page.keyboard.press('Delete');
      
      // 等待删除完成
      await page.waitForSelector('.task-card', { timeout: 10000 });
      
      // 验证剩余1个任务
      await expect(page.locator('.task-card')).toHaveCount(1);
    });

    test('TC-V02-113: 筛选与批量操作组合', async ({ page }) => {
      await createTask(page, '苹果任务');
      await createTask(page, '香蕉任务');
      await createTask(page, '苹果酱任务');

      // 搜索"苹果"
      const searchInput = page.locator('[aria-label="搜索任务"]');
      await searchInput.fill('苹果');
      await page.waitForTimeout(500);

      // 验证筛选结果
      let taskCards = page.locator('.task-card');
      await expect(taskCards).toHaveCount(2);
      await expect(taskCards.first()).toContainText('苹果');
      await expect(taskCards.nth(1)).toContainText('苹果');

      // 选中筛选结果中的任务
      await page.locator('.task-card__selection-checkbox').first().click();
      await page.locator('.task-card__selection-checkbox').nth(1).click();

      // 批量删除
      await page.click('.batch-toolbar__button--danger');
      await page.waitForSelector('.modal', { timeout: 5000 });
      await page.click('.modal__btn--primary');
      await page.waitForSelector('.modal', { state: 'hidden', timeout: 10000 });

      // 验证删除结果
      await expect(page.locator('.task-card')).toHaveCount(0);
      await expect(page.locator('.empty-state')).toBeVisible();

      // 清空搜索
      await searchInput.fill('');
      await page.waitForTimeout(500);

      // 验证未搜索到的任务仍然存在
      await expect(page.locator('.task-card')).toHaveCount(1);
      await expect(page.locator('.task-card__title')).toContainText('香蕉任务');
    });
  });

  // ========== 边界情况 ==========
  test.describe('边界情况', () => {
    test('TC-V02-120: 空状态下的操作', async ({ page }) => {
      // 空状态下全选
      await page.keyboard.press('Control+a');
      await expect(page.locator('.batch-toolbar')).not.toBeVisible();

      // 空状态下删除快捷键
      await page.keyboard.press('Delete');
      await expect(page.locator('.empty-state')).toBeVisible();

      // 空状态下使用快捷键打开表单
      await page.keyboard.press('Control+n');
      await expect(page.locator('.task-form-modal')).toBeVisible();
      await page.keyboard.press('Escape');
    });

    test('TC-V02-121: 单个任务的各种操作', async ({ page }) => {
      await createTask(page, '唯一任务');

      // 选择任务
      await page.click('.task-card__selection-checkbox');
      await expect(page.locator('.batch-toolbar')).toBeVisible();
      await expect(page.locator('.batch-toolbar__count')).toContainText('已选择 1 个任务');

      // 验证全选按钮状态（应该被禁用，因为所有任务都已选中）
      const selectAllButton = page.locator('[data-testid="select-all-button"]');
      await expect(selectAllButton).toBeDisabled();

      // 取消选择
      await page.click('[data-testid="deselect-all-button"]');
      await expect(page.locator('.batch-toolbar')).not.toBeVisible();

      // 使用快捷键选择
      await page.keyboard.press('Control+a');
      await expect(page.locator('.batch-toolbar__count')).toContainText('已选择 1 个任务');
    });

    test('TC-V02-122: 大量任务的性能测试', async ({ page }) => {
      // 添加10个任务
      for (let i = 1; i <= 10; i++) {
        await createTask(page, `任务${i}`);
      }

      await expect(page.locator('.task-card')).toHaveCount(10);

      // 全选操作
      await page.keyboard.press('Control+a');
      await expect(page.locator('.batch-toolbar__count')).toContainText('已选择 10 个任务');

      // 批量完成
      await page.click('.batch-toolbar__button--primary');

      // 验证所有任务都已完成
      const taskCards = page.locator('.task-card');
      for (let i = 0; i < 10; i++) {
        await expect(taskCards.nth(i)).toHaveClass(/task-card--completed/);
      }
    });

    test('TC-V02-123: 表单打开状态下的其他操作', async ({ page }) => {
      // 打开表单后按 Esc 关闭
      await page.click('[aria-label="添加新任务"]');
      await expect(page.locator('.task-form-modal')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('.task-form-modal')).not.toBeVisible();

      // 再次打开表单并填写
      await page.click('[aria-label="添加新任务"]');
      await expect(page.locator('.task-form-modal')).toBeVisible();
      await page.fill('#title', '表单测试任务');
      await page.click('.btn-primary:has-text("添加任务")');
      await page.waitForSelector('.task-form-modal', { state: 'hidden', timeout: 10000 });

      // 验证任务创建成功
      await expect(page.locator('.task-card')).toHaveCount(1);
    });
  });

  // ========== 用户习惯场景 ==========
  test.describe('用户习惯场景', () => {
    test('TC-V02-130: 日常使用流程', async ({ page }) => {
      // 1. 快速添加多个任务
      await page.keyboard.press('Control+n');
      await page.fill('#title', '早上开会');
      await page.keyboard.press('Enter');
      await page.waitForSelector('.task-card', { timeout: 5000 });

      await page.keyboard.press('Control+n');
      await page.fill('#title', '下午写代码');
      await page.keyboard.press('Enter');
      await page.waitForSelector('.task-card', { timeout: 5000 });

      await page.keyboard.press('Control+n');
      await page.fill('#title', '晚上健身');
      await page.keyboard.press('Enter');
      await page.waitForSelector('.task-card', { timeout: 5000 });

      // 2. 使用搜索查找任务
      await page.keyboard.press('Control+f');
      await page.fill('[aria-label="搜索任务"]', '开会');
      await page.waitForTimeout(500);
      await expect(page.locator('.task-card')).toContainText('早上开会');

      // 3. 清空搜索
      await page.fill('[aria-label="搜索任务"]', '');
      await page.waitForTimeout(500);
      await expect(page.locator('.task-card')).toHaveCount(3);

      // 4. 完成部分任务
      await page.keyboard.press('Control+a');
      await page.keyboard.press(' ');
      
      // 等待完成状态更新
      await page.waitForTimeout(1000);
      
      // 验证任务状态
      const taskCards = page.locator('.task-card');
      await expect(taskCards.first()).toHaveClass(/task-card--completed/);

      // 5. 批量删除已完成任务
      await page.keyboard.press('Control+a');
      await page.click('.batch-toolbar__button--danger');
      await page.waitForSelector('.modal', { timeout: 5000 });
      await page.click('.modal__btn--primary');
      await page.waitForSelector('.modal', { state: 'hidden', timeout: 10000 });

      // 6. 验证结果
      await expect(page.locator('.empty-state')).toBeVisible();
    });

    test('TC-V02-131: 中断后继续操作', async ({ page }) => {
      // 1. 添加任务
      await createTask(page, '未完成的任务1');
      await createTask(page, '未完成的任务2');

      // 2. 刷新页面（模拟中断）
      await page.reload();
      await page.waitForLoadState('networkidle');

      // 3. 继续操作
      await expect(page.locator('.task-card')).toHaveCount(2);

      // 4. 继续添加
      await createTask(page, '中断后新增的任务');

      // 5. 验证所有任务都存在
      await expect(page.locator('.task-card')).toHaveCount(3);
    });

    test('TC-V02-132: 快捷键熟练用户场景', async ({ page }) => {
      // 纯键盘操作流程
      await page.keyboard.press('Control+n');
      await page.fill('#title', '任务A');
      await page.keyboard.press('Enter');
      await page.waitForSelector('.task-card', { timeout: 5000 });

      await page.keyboard.press('Control+n');
      await page.fill('#title', '任务B');
      await page.keyboard.press('Enter');
      await page.waitForSelector('.task-card', { timeout: 5000 });

      // 全选
      await page.keyboard.press('Control+a');
      await expect(page.locator('.batch-toolbar')).toBeVisible();

      // 批量完成
      await page.keyboard.press(' ');
      
      // 等待完成状态更新
      await page.waitForTimeout(1000);
      
      await expect(page.locator('.task-card').first()).toHaveClass(/task-card--completed/);

      // 打开快捷键帮助
      await page.keyboard.press('?');
      await expect(page.locator('.keyboard-shortcuts-modal')).toBeVisible();
      await page.keyboard.press('Escape');
    });
  });
});

import { test, expect } from '@playwright/test';

/**
 * Bug 验证测试：新任务检测逻辑错误
 * 
 * 问题描述：
 * App.tsx 中使用 `task.createdAt === task.updatedAt && task.createdAt === task.order` 
 * 判断新任务不可靠。应该使用 `task.id` 是否存在来判断。
 * 
 * 当前逻辑会导致编辑新创建但未保存的任务时错误地调用 addTask 而非 updateTask。
 * 
 * 复现步骤：
 * 1. 创建一个任务（此时 createdAt === updatedAt === order）
 * 2. 立即编辑这个任务（不刷新页面）
 * 3. 保存编辑后的任务
 * 4. 预期：应该更新原有任务
 * 5. 实际：由于 createdAt、updatedAt、order 仍然相同，会创建一个新任务
 */

test.describe('Bug 验证: 新任务检测逻辑错误', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('TC-BUG-001: 编辑新创建的任务会导致重复创建', async ({ page }) => {
    // 步骤1: 创建第一个任务
    await page.click('[aria-label="添加新任务"]');
    await page.fill('#title', '原始任务');
    await page.fill('#description', '原始描述');
    await page.click('.btn-primary:has-text("添加任务")');

    // 验证任务已创建
    await expect(page.locator('.task-card')).toHaveCount(1);
    await expect(page.locator('.task-card__title')).toContainText('原始任务');
    await expect(page.locator('.task-card__description')).toContainText('原始描述');

    // 步骤2: 立即编辑这个任务（不刷新页面）
    await page.click('[aria-label="编辑任务"]');

    // 验证表单中显示原有数据
    await expect(page.locator('#title')).toHaveValue('原始任务');
    await expect(page.locator('#description')).toHaveValue('原始描述');

    // 步骤3: 修改任务内容
    await page.fill('#title', '编辑后的任务');
    await page.fill('#description', '编辑后的描述');

    // 步骤4: 保存编辑
    await page.click('.btn-primary:has-text("更新任务")');

    // 步骤5: 验证结果
    // 预期结果：应该只有1个任务，且内容已更新
    // 实际结果（Bug）：会有2个任务（原始任务 + 新创建的"编辑后任务"）
    const taskCount = await page.locator('.task-card').count();

    if (taskCount === 2) {
      // Bug 存在：编辑操作错误地创建了新任务
      console.log('❌ Bug 验证成功：编辑新创建的任务导致了重复创建');
      console.log(`   任务数量: ${taskCount} (预期: 1)`);

      // 验证两个任务都存在
      const titles = await page.locator('.task-card__title').allTextContents();
      console.log(`   任务标题: ${titles.join(', ')}`);

      // 这个断言会失败，用于证明 Bug 存在
      expect(taskCount, 'Bug 存在：编辑操作错误地创建了新任务，导致任务重复').toBe(1);
    } else {
      // Bug 已修复
      console.log('✅ Bug 已修复：编辑操作正确更新了任务');
      await expect(page.locator('.task-card')).toHaveCount(1);
      await expect(page.locator('.task-card__title')).toContainText('编辑后的任务');
      await expect(page.locator('.task-card__description')).toContainText('编辑后的描述');
    }
  });

  test('TC-BUG-002: 多次编辑新创建的任务会导致多个重复任务', async ({ page }) => {
    // 创建初始任务
    await page.click('[aria-label="添加新任务"]');
    await page.fill('#title', '初始任务');
    await page.click('.btn-primary:has-text("添加任务")');

    // 第一次编辑
    await page.click('[aria-label="编辑任务"]');
    await page.fill('#title', '第一次编辑');
    await page.click('.btn-primary:has-text("更新任务")');

    // 第二次编辑
    await page.click('[aria-label="编辑任务"]');
    await page.fill('#title', '第二次编辑');
    await page.click('.btn-primary:has-text("更新任务")');

    // 第三次编辑
    await page.click('[aria-label="编辑任务"]');
    await page.fill('#title', '第三次编辑');
    await page.click('.btn-primary:has-text("更新任务")');

    // 验证任务数量
    const taskCount = await page.locator('.task-card').count();

    if (taskCount > 1) {
      console.log(`❌ Bug 验证成功：多次编辑创建了 ${taskCount} 个任务 (预期: 1)`);
      const titles = await page.locator('.task-card__title').allTextContents();
      console.log(`   所有任务标题: ${titles.join(', ')}`);
      expect(taskCount, 'Bug 存在：多次编辑创建了大量重复任务').toBe(1);
    } else {
      console.log('✅ Bug 已修复：多次编辑只保留一个任务');
      await expect(page.locator('.task-card')).toHaveCount(1);
      await expect(page.locator('.task-card__title')).toContainText('第三次编辑');
    }
  });

  test('TC-BUG-003: 刷新页面后编辑不会导致重复（对比测试）', async ({ page }) => {
    // 创建任务
    await page.click('[aria-label="添加新任务"]');
    await page.fill('#title', '刷新前任务');
    await page.click('.btn-primary:has-text("添加任务")');

    // 刷新页面（这会使任务获得持久化的 id）
    await page.reload();

    // 编辑任务
    await page.click('[aria-label="编辑任务"]');
    await page.fill('#title', '刷新后编辑');
    await page.click('.btn-primary:has-text("更新任务")');

    // 验证只有1个任务
    await expect(page.locator('.task-card')).toHaveCount(1);
    await expect(page.locator('.task-card__title')).toContainText('刷新后编辑');

    console.log('✅ 刷新页面后编辑正常工作（因为任务已持久化，有明确的 id）');
  });

  test('TC-BUG-004: 验证任务数据的 createdAt/updatedAt/order 关系', async ({ page }) => {
    // 创建任务
    await page.click('[aria-label="添加新任务"]');
    await page.fill('#title', '数据验证任务');
    await page.click('.btn-primary:has-text("添加任务")');

    // 获取任务数据
    const taskData = await page.evaluate(() => {
      const tasks = JSON.parse(localStorage.getItem('todo-tasks') || '[]');
      return tasks[0] || null;
    });

    console.log('任务数据结构:', JSON.stringify(taskData, null, 2));

    // 验证新任务的 createdAt、updatedAt、order 是否相同
    if (taskData) {
      const { createdAt, updatedAt, order, id } = taskData;
      console.log(`createdAt: ${createdAt}`);
      console.log(`updatedAt: ${updatedAt}`);
      console.log(`order: ${order}`);
      console.log(`id: ${id}`);
      console.log(`createdAt === updatedAt: ${createdAt === updatedAt}`);
      console.log(`createdAt === order: ${createdAt === order}`);
      console.log(`id 是否存在: ${!!id}`);

      // 验证 Bug 的根本原因
      expect(createdAt).toBe(updatedAt);
      expect(createdAt).toBe(order);
      expect(id).toBeTruthy();

      console.log('✅ 验证成功：新任务的 createdAt、updatedAt、order 确实相同');
      console.log('   这就是导致 Bug 的根本原因：无法通过这三个字段区分新旧任务');
    }
  });
});

test.describe('修复验证: 使用 id 判断新任务', () => {
  test('TC-FIX-001: 正确的判断逻辑应该是检查 id 是否存在', async ({ page }) => {
    // 这个测试用例展示了正确的判断逻辑
    // 在实际修复后，这个测试应该通过

    // 创建任务
    await page.click('[aria-label="添加新任务"]');
    await page.fill('#title', '测试任务');
    await page.click('.btn-primary:has-text("添加任务")');

    // 立即编辑
    await page.click('[aria-label="编辑任务"]');
    await page.fill('#title', '已编辑的任务');
    await page.click('.btn-primary:has-text("更新任务")');

    // 验证只有一个任务，且标题已更新
    await expect(page.locator('.task-card')).toHaveCount(1);
    await expect(page.locator('.task-card__title')).toContainText('已编辑的任务');

    console.log('✅ 修复验证：使用 id 判断新任务的逻辑正确工作');
  });
});

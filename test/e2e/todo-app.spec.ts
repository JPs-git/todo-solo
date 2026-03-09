import { test, expect } from "@playwright/test";

test.describe("Todo-List 端到端测试", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test.describe("核心功能", () => {
    test("TC-001: 正常创建任务", async ({ page }) => {
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", "测试任务1");
      await page.fill("#description", "这是测试任务的描述");
      await page.selectOption("#priority", "high");
      await page.click('.btn-primary:has-text("添加任务")');
      await expect(page.locator(".task-card__title")).toContainText(
        "测试任务1"
      );
    });

    test("TC-002: 创建空任务应该失败", async ({ page }) => {
      await page.click('[aria-label="添加新任务"]');
      const submitButton = page.locator(".btn-primary");
      await expect(submitButton).toBeDisabled();
    });

    test("TC-003: 创建长标题任务", async ({ page }) => {
      const longTitle = "这是一个非常长的任务标题".repeat(10);
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", longTitle);
      await page.click('.btn-primary:has-text("添加任务")');
      await expect(page.locator(".task-card__title")).toContainText(
        longTitle.substring(0, 50)
      );
    });

    test("TC-004: 编辑任务", async ({ page }) => {
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", "原始任务");
      await page.click('.btn-primary:has-text("添加任务")');
      await page.click('[aria-label="编辑任务"]');
      await page.fill("#title", "已编辑的任务");
      await page.click('.btn-primary:has-text("更新任务")');
      await expect(page.locator(".task-card__title")).toContainText(
        "已编辑的任务"
      );
    });

    test("TC-007: 删除任务", async ({ page }) => {
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", "待删除任务");
      await page.click('.btn-primary:has-text("添加任务")');
      await page.click('[aria-label="删除任务"]');
      await page.click(".modal__btn--primary");
      await expect(page.locator(".empty-state")).toBeVisible();
    });

    test("TC-009: 标记任务为完成", async ({ page }) => {
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", "待完成任务");
      await page.click('.btn-primary:has-text("添加任务")');
      await page.click('[role="checkbox"]');
      const taskCard = page.locator(".task-card").first();
      await expect(taskCard).toHaveClass(/task-card--completed/);
    });

    test("TC-010: 取消任务完成状态", async ({ page }) => {
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", "已完成任务");
      await page.click('.btn-primary:has-text("添加任务")');
      await page.click('[role="checkbox"]');
      await page.click('[role="checkbox"]');
      const taskCard = page.locator(".task-card").first();
      await expect(taskCard).not.toHaveClass(/task-card--completed/);
    });

    test("TC-011: 显示任务列表", async ({ page }) => {
      for (let i = 1; i <= 3; i++) {
        await page.click('[aria-label="添加新任务"]');
        await page.fill("#title", `任务${i}`);
        await page.click('.btn-primary:has-text("添加任务")');
      }
      await expect(page.locator(".task-card")).toHaveCount(3);
    });

    test("TC-012: 显示空列表状态", async ({ page }) => {
      await expect(page.locator(".empty-state")).toBeVisible();
      await expect(page.locator(".empty-state__title")).toContainText(
        "暂无任务"
      );
    });

    test("TC-013: 刷新页面数据保持", async ({ page }) => {
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", "持久化任务");
      await page.click('.btn-primary:has-text("添加任务")');
      await page.reload();
      await expect(page.locator(".task-card__title")).toContainText(
        "持久化任务"
      );
    });
  });

  test.describe("基础功能", () => {
    test("TC-015: 搜索存在的任务", async ({ page }) => {
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", "测试任务1");
      await page.click('.btn-primary:has-text("添加任务")');
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", "测试任务2");
      await page.click('.btn-primary:has-text("添加任务")');
      await page.fill('[aria-label="搜索任务"]', "任务1");
      await expect(page.locator(".task-card")).toHaveCount(1);
      await expect(page.locator(".task-card__title")).toContainText(
        "测试任务1"
      );
    });

    test("TC-016: 搜索不存在的任务", async ({ page }) => {
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", "测试任务");
      await page.click('.btn-primary:has-text("添加任务")');
      await page.fill('[aria-label="搜索任务"]', "不存在");
      await expect(page.locator(".empty-state")).toBeVisible();
    });

    test("TC-018: 筛选全部任务", async ({ page }) => {
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", "未完成任务");
      await page.click('.btn-primary:has-text("添加任务")');
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", "已完成任务");
      await page.click('.btn-primary:has-text("添加任务")');
      await page.click('[role="checkbox"]');
      await page.selectOption('[aria-label="筛选任务"]', "all");
      await expect(page.locator(".task-card")).toHaveCount(2);
    });

    test("TC-019: 筛选已完成任务", async ({ page }) => {
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", "未完成任务");
      await page.click('.btn-primary:has-text("添加任务")');
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", "已完成任务");
      await page.click('.btn-primary:has-text("添加任务")');
      await page.click('[role="checkbox"]');
      await page.selectOption('[aria-label="筛选任务"]', "completed");
      await expect(page.locator(".task-card")).toHaveCount(1);
      await expect(page.locator(".task-card__title")).toContainText(
        "已完成任务"
      );
    });

    test("TC-020: 筛选未完成任务", async ({ page }) => {
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", "未完成任务");
      await page.click('.btn-primary:has-text("添加任务")');
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", "已完成任务");
      await page.click('.btn-primary:has-text("添加任务")');
      await page.click('[role="checkbox"]');
      await page.selectOption('[aria-label="筛选任务"]', "active");
      await expect(page.locator(".task-card")).toHaveCount(1);
      await expect(page.locator(".task-card__title")).toContainText(
        "未完成任务"
      );
    });

    test("TC-021: 按创建时间排序", async ({ page }) => {
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", "任务1");
      await page.click('.btn-primary:has-text("添加任务")');
      await page.waitForTimeout(100);
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", "任务2");
      await page.click('.btn-primary:has-text("添加任务")');
      await page.selectOption('[aria-label="排序任务"]', "createdAt");
      const tasks = page.locator(".task-card__title");
      await expect(tasks.first()).toContainText("任务2");
    });

    test("TC-022: 按完成状态排序", async ({ page }) => {
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", "未完成任务");
      await page.click('.btn-primary:has-text("添加任务")');
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", "已完成任务");
      await page.click('.btn-primary:has-text("添加任务")');
      await page.click('[role="checkbox"]');
      await page.selectOption('[aria-label="排序任务"]', "completed");
      const tasks = page.locator(".task-card__title");
      await expect(tasks.first()).toContainText("未完成任务");
    });
  });

  test.describe("增强功能", () => {
    test("TC-025: 查看任务详情", async ({ page }) => {
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", "详细任务");
      await page.fill("#description", "任务详细描述");
      await page.selectOption("#priority", "high");
      await page.click('.btn-primary:has-text("添加任务")');
      await expect(page.locator(".task-card__title")).toContainText("详细任务");
      await expect(page.locator(".task-card__description")).toContainText(
        "任务详细描述"
      );
    });

    test("TC-033: 特殊字符输入", async ({ page }) => {
      const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", `特殊字符${specialChars}`);
      await page.click('.btn-primary:has-text("添加任务")');
      await expect(page.locator(".task-card__title")).toContainText("特殊字符");
    });
  });

  test.describe("v0.2 新增功能", () => {
    test("创建带优先级的任务", async ({ page }) => {
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", "高优先级任务");
      await page.selectOption("#priority", "high");
      await page.click('.btn-primary:has-text("添加任务")');
      const taskCard = page.locator(".task-card").first();
      await expect(taskCard).toContainText("高优先级任务");
      await expect(page.locator(".task-card__priority")).toBeVisible();
    });

    test("创建带截止日期的任务", async ({ page }) => {
      const today = new Date().toISOString().split("T")[0];
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", "有截止日期的任务");
      await page.fill("#dueDate", today);
      await page.click('.btn-primary:has-text("添加任务")');
      await expect(page.locator(".task-card__title")).toContainText(
        "有截止日期的任务"
      );
      await expect(page.locator(".task-card__due-date")).toContainText(
        "截止日期"
      );
    });

    test("创建带标签的任务", async ({ page }) => {
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", "带标签的任务");
      await page.fill("#tags", "工作,紧急");
      await page.click('.btn-primary:has-text("添加任务")');
      await expect(page.locator(".task-card__title")).toContainText(
        "带标签的任务"
      );
      await expect(page.locator(".task-card__tag")).toHaveCount(2);
    });

    test("按标签筛选任务", async ({ page }) => {
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", "工作任务");
      await page.fill("#tags", "工作");
      await page.click('.btn-primary:has-text("添加任务")');
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", "个人任务");
      await page.fill("#tags", "个人");
      await page.click('.btn-primary:has-text("添加任务")');
      await page.selectOption('[aria-label="按标签筛选"]', "工作");
      await expect(page.locator(".task-card")).toHaveCount(1);
      await expect(page.locator(".task-card__title")).toContainText("工作任务");
    });

    test("按优先级排序", async ({ page }) => {
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", "低优先级任务");
      await page.selectOption("#priority", "low");
      await page.click('.btn-primary:has-text("添加任务")');
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", "高优先级任务");
      await page.selectOption("#priority", "high");
      await page.click('.btn-primary:has-text("添加任务")');
      await page.selectOption('[aria-label="排序任务"]', "priority");
      const tasks = page.locator(".task-card__title");
      await expect(tasks.first()).toContainText("高优先级任务");
    });
  });

  test.describe("性能测试", () => {
    test("TC-036: 页面加载时间", async ({ page }) => {
      const startTime = Date.now();
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(2000);
    });

    test("TC-037: 任务操作响应时间", async ({ page }) => {
      await page.click('[aria-label="添加新任务"]');
      await page.fill("#title", "响应测试任务");
      const startTime = Date.now();
      await page.click('.btn-primary:has-text("添加任务")');
      await page.waitForSelector(".task-card");
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(300);
    });

    test("TC-032: 大量任务测试", async ({ page }) => {
      for (let i = 1; i <= 20; i++) {
        await page.click('[aria-label="添加新任务"]');
        await page.fill("#title", `批量任务${i}`);
        await page.click('.btn-primary:has-text("添加任务")');
      }
      await expect(page.locator(".task-card")).toHaveCount(20);
      await page.click('[aria-label="添加新任务"]');
      await expect(page.locator(".task-form-modal")).toBeVisible();
    });
  });
});

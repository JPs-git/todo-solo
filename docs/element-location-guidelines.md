# Todo-List 元素定位规范指南

## 文档信息

| 项目     | 内容                |
| -------- | ------------------- |
| 产品名称 | Todo-List           |
| 文档版本 | v1.0                |
| 创建日期 | 2026-03-09          |
| 文档状态 | 正式发布            |

---

## 一、规范目的

为了解决开发和测试过程中元素定位方式不一致导致的测试失败问题，本规范定义了统一的元素定位策略，确保：

- **一致性**：开发和测试使用相同的定位方式
- **可靠性**：定位方式不受样式变更影响
- **可维护性**：定位策略清晰易懂，便于维护
- **可扩展性**：支持新功能和组件的定位需求

---

## 二、定位策略优先级

### 2.1 推荐的定位方式（按优先级排序）

| 优先级 | 定位方式 | 示例 | 适用场景 | 优势 |
|--------|---------|------|----------|------|
| 1 | `data-testid` 属性 | `[data-testid="add-task-button"]` | 所有可交互元素 | 唯一、稳定、语义化 |
| 2 | ARIA 属性 | `[aria-label="添加新任务"]` | 可访问性元素 | 支持屏幕阅读器 |
| 3 | 角色属性 | `[role="checkbox"]` | 具有明确角色的元素 | 语义化、稳定 |
| 4 | ID 选择器 | `#title` | 表单输入框 | 唯一、快速 |
| 5 | 类选择器 | `.task-card` | 容器元素 | 稳定、语义化 |
| 6 | 组合选择器 | `.btn-primary:has-text("添加任务")` | 特定上下文元素 | 上下文相关 |

### 2.2 不推荐的定位方式

- **不使用**：动态生成的类名（如 `_123abc`）
- **不使用**：CSS 路径（如 `div > span > button`）
- **不使用**：基于索引的定位（如 `nth-child(2)`）
- **谨慎使用**：基于文本内容的定位（易受国际化影响）

---

## 三、`data-testid` 命名规范

### 3.1 命名格式

```
[data-testid="{组件名}-{功能描述}-{序号}"]
```

### 3.2 命名规则

1. **组件名**：使用 PascalCase（如 `TaskItem`）
2. **功能描述**：使用 kebab-case（如 `add-button`）
3. **序号**：仅在同一组件内有多个相同功能元素时使用
4. **使用语义化名称**：避免使用 `btn1`、`input2` 等无意义名称
5. **保持一致性**：相同功能的元素使用相同的命名模式

### 3.3 示例

| 元素 | 推荐的 `data-testid` | 不推荐的 `data-testid` |
|------|---------------------|-----------------------|
| 添加任务按钮 | `add-task-button` | `btn1`, `addBtn` |
| 任务标题输入框 | `task-title-input` | `input1`, `title` |
| 任务卡片 | `task-item-{id}` | `card1`, `task1` |
| 批量操作工具栏 | `batch-toolbar` | `toolbar2`, `batch` |
| 全选按钮 | `select-all-button` | `btn-select`, `all` |

---

## 四、组件元素定位规范

### 4.1 核心组件

#### 4.1.1 App 组件

| 元素 | data-testid | ARIA 属性 | 其他定位 |
|------|------------|-----------|----------|
| 应用容器 | `app-container` | - | - |
| 主内容区 | `main-content` | - | - |

#### 4.1.2 Header 组件

| 元素 | data-testid | ARIA 属性 | 其他定位 |
|------|------------|-----------|----------|
| 标题 | `header-title` | - | `.header__title` |
| 添加任务按钮 | `add-task-button` | `aria-label="添加新任务"` | - |

#### 4.1.3 SearchBar 组件

| 元素 | data-testid | ARIA 属性 | 其他定位 |
|------|------------|-----------|----------|
| 搜索输入框 | `search-input` | `aria-label="搜索任务"` | `#search-input` |
| 搜索清除按钮 | `search-clear-button` | `aria-label="清除搜索"` | - |

#### 4.1.4 Toolbar 组件

| 元素 | data-testid | ARIA 属性 | 其他定位 |
|------|------------|-----------|----------|
| 筛选选择器 | `filter-select` | `aria-label="筛选任务"` | - |
| 排序选择器 | `sort-select` | `aria-label="排序任务"` | - |
| 标签选择器 | `tag-select` | `aria-label="按标签筛选"` | - |

#### 4.1.5 TaskItem 组件

| 元素 | data-testid | ARIA 属性 | 其他定位 |
|------|------------|-----------|----------|
| 任务卡片 | `task-item-{id}` | - | `.task-card` |
| 选择复选框 | `task-item-{id}-select` | `role="checkbox"` | `.task-card__selection-checkbox` |
| 完成复选框 | `task-item-{id}-toggle` | `role="checkbox"` | - |
| 任务标题 | `task-item-{id}-title` | - | `.task-card__title` |
| 任务描述 | `task-item-{id}-description` | - | `.task-card__description` |
| 优先级标签 | `task-item-{id}-priority` | - | `.task-card__priority` |
| 截止日期 | `task-item-{id}-due-date` | - | `.task-card__due-date` |
| 标签列表 | `task-item-{id}-tags` | - | `.task-card__tags` |
| 编辑按钮 | `task-item-{id}-edit` | `aria-label="编辑任务"` | - |
| 删除按钮 | `task-item-{id}-delete` | `aria-label="删除任务"` | - |

#### 4.1.6 TaskForm 组件

| 元素 | data-testid | ARIA 属性 | 其他定位 |
|------|------------|-----------|----------|
| 表单容器 | `task-form` | - | `.task-form` |
| 标题输入框 | `task-title-input` | - | `#title` |
| 描述输入框 | `task-description-input` | - | `#description` |
| 优先级选择器 | `task-priority-select` | - | `#priority` |
| 截止日期输入框 | `task-due-date-input` | - | `#dueDate` |
| 标签输入框 | `task-tags-input` | - | `#tags` |
| 提交按钮 | `task-form-submit` | - | `.btn-primary` |
| 取消按钮 | `task-form-cancel` | - | `.btn-secondary` |

#### 4.1.7 BatchToolbar 组件

| 元素 | data-testid | ARIA 属性 | 其他定位 |
|------|------------|-----------|----------|
| 工具栏容器 | `batch-toolbar` | - | `.batch-toolbar` |
| 选择计数 | `batch-toolbar-count` | - | `.batch-toolbar__count` |
| 全选按钮 | `select-all-button` | - | `.batch-toolbar__button` |
| 取消全选按钮 | `deselect-all-button` | - | `.batch-toolbar__button` |
| 批量完成按钮 | `batch-complete-button` | - | `.batch-toolbar__button--primary` |
| 批量删除按钮 | `batch-delete-button` | - | `.batch-toolbar__button--danger` |

#### 4.1.8 Modal 组件

| 元素 | data-testid | ARIA 属性 | 其他定位 |
|------|------------|-----------|----------|
| 模态框容器 | `modal` | - | `.modal` |
| 标题 | `modal-title` | - | `.modal__title` |
| 内容 | `modal-content` | - | `.modal__content` |
| 确认按钮 | `modal-confirm-button` | - | `.modal__btn--primary` |
| 取消按钮 | `modal-cancel-button` | - | `.modal__btn--secondary` |
| 关闭按钮 | `modal-close-button` | `aria-label="关闭"` | - |

#### 4.1.9 KeyboardShortcutsHelp 组件

| 元素 | data-testid | ARIA 属性 | 其他定位 |
|------|------------|-----------|----------|
| 面板容器 | `keyboard-shortcuts-help` | - | `.keyboard-shortcuts-modal` |
| 标题 | `keyboard-shortcuts-title` | - | `.keyboard-shortcuts-modal__title` |
| 关闭按钮 | `keyboard-shortcuts-close` | `aria-label="关闭"` | - |
| 快捷键列表 | `keyboard-shortcuts-list` | - | `.keyboard-shortcuts-modal__list` |

#### 4.1.10 EmptyState 组件

| 元素 | data-testid | ARIA 属性 | 其他定位 |
|------|------------|-----------|----------|
| 空状态容器 | `empty-state` | - | `.empty-state` |
| 标题 | `empty-state-title` | - | `.empty-state__title` |
| 描述 | `empty-state-description` | - | `.empty-state__description` |
| 操作按钮 | `empty-state-button` | - | `.empty-state__button` |

---

## 五、测试代码规范

### 5.1 单元测试（Vitest）

#### 5.1.1 推荐实践

```typescript
// 推荐：使用 data-testid
import { screen, render } from '@testing-library/react';

render(<TaskItem task={task} />);
const taskTitle = screen.getByTestId('task-item-123-title');
const deleteButton = screen.getByTestId('task-item-123-delete');

// 推荐：使用 ARIA 属性
const addButton = screen.getByLabelText('添加新任务');

// 推荐：使用角色
const checkbox = screen.getByRole('checkbox');
```

#### 5.1.2 不推荐的实践

```typescript
// 不推荐：使用 CSS 类名
import { render } from '@testing-library/react';

const { container } = render(<TaskItem task={task} />);
const deleteButton = container.querySelector('.task-card__delete-button');

// 不推荐：使用 CSS 路径
const title = container.querySelector('.task-card > .task-card__content > .task-card__title');
```

### 5.2 端到端测试（Playwright）

#### 5.2.1 推荐实践

```typescript
// 推荐：使用 data-testid
await page.click('[data-testid="add-task-button"]');
await page.fill('[data-testid="task-title-input"]', '测试任务');
await page.click('[data-testid="task-form-submit"]');

// 推荐：使用 ARIA 属性
await page.click('[aria-label="添加新任务"]');

// 推荐：使用角色
await page.click('[role="checkbox"]');
```

#### 5.2.2 不推荐的实践

```typescript
// 不推荐：使用 CSS 类名和文本组合
await page.click('.btn-primary:has-text("添加任务")');

// 不推荐：使用索引
await page.click('.task-card__selection-checkbox:nth-child(2)');

// 不推荐：使用 CSS 路径
await page.click('div.toolbar > select:nth-child(1)');
```

---

## 六、开发流程规范

### 6.1 新增组件流程

1. **设计阶段**：在组件设计时，规划好需要测试的元素
2. **编码阶段**：
   - 为所有可交互元素添加 `data-testid`
   - 为可访问性元素添加适当的 ARIA 属性
   - 遵循命名规范
3. **测试阶段**：
   - 编写测试用例时使用推荐的定位方式
   - 确保测试能够稳定通过
4. **代码审查**：
   - 检查是否为关键元素添加了 `data-testid`
   - 验证定位方式是否符合规范

### 6.2 修改组件流程

1. **分析影响**：评估修改对现有测试的影响
2. **保持兼容性**：
   - 不要随意更改 `data-testid` 值
   - 如果必须更改，同时更新相关测试
3. **测试验证**：
   - 运行现有测试确保通过
   - 编写新测试覆盖修改的功能

---

## 七、常见问题与解决方案

### 7.1 元素定位失败

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| `data-testid` 不存在 | 开发时忘记添加 | 为元素添加正确的 `data-testid` |
| 定位器过时 | 组件结构变更 | 更新测试中的定位器，使用稳定的 `data-testid` |
| 元素未渲染 | 条件渲染或异步加载 | 使用 `waitFor` 或 `toBeVisible` 等待元素出现 |
| 多个元素匹配 | 定位器不够具体 | 使用更具体的 `data-testid` 或组合定位 |

### 7.2 测试不稳定

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 元素加载延迟 | 网络请求或动画 | 使用 `waitFor` 等待元素稳定 |
| 随机 ID | 动态生成的 ID | 使用 `data-testid` 而非动态 ID |
| 时序问题 | 异步操作 | 确保操作顺序正确，使用适当的等待 |
| 环境差异 | 不同浏览器或设备 | 使用跨浏览器兼容的定位方式 |

---

## 八、工具与辅助

### 8.1 开发工具

1. **浏览器开发者工具**：使用元素检查器查看元素属性
2. **Playwright Inspector**：调试端到端测试时的元素定位
3. **Testing Library**：提供语义化的元素查询方法

### 8.2 代码检查

- **ESLint 规则**：可以添加规则检查 `data-testid` 的使用
- **Prettier**：保持代码格式一致
- **提交前检查**：确保测试能够通过

---

## 九、验收标准

### 9.1 代码验收

- [ ] 所有可交互元素都有 `data-testid`
- [ ] `data-testid` 命名符合规范
- [ ] 关键元素有适当的 ARIA 属性
- [ ] 测试代码使用推荐的定位方式

### 9.2 测试验收

- [ ] 单元测试能够稳定通过
- [ ] 端到端测试能够稳定通过
- [ ] 测试代码可读性良好
- [ ] 测试覆盖关键功能

---

## 十、版本控制

| 版本 | 日期 | 变更内容 | 变更人 |
|------|------|----------|--------|
| v1.0 | 2026-03-09 | 初始版本创建 | 前端架构师 |

---

**文档结束**

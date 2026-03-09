# Todo-List v0.2 批量操作与快捷键 UI 设计文档

## 文档信息

| 项目     | 内容                |
| -------- | ------------------- |
| 产品名称 | Todo-List           |
| 文档版本 | v0.2-batch-shortcut |
| 创建日期 | 2026-03-09          |
| 设计状态 | 已完成              |

---

## 一、设计概述

### 1.1 设计目标

为 Todo-List v0.2 版本设计批量操作和快捷键功能的用户界面，确保：

- **视觉一致性**：与现有设计系统保持统一
- **操作直观性**：用户能快速理解批量操作流程
- **效率优先**：快捷键设计符合用户心智模型
- **无障碍性**：支持键盘导航和屏幕阅读器

### 1.2 设计原则

1. **渐进式披露**：批量操作工具栏仅在需要时显示
2. **即时反馈**：选中状态实时更新，操作结果明确提示
3. **防误操作**：批量删除需二次确认
4. **键盘优先**：所有功能均可通过键盘完成

---

## 二、批量操作 UI 设计

### 2.1 任务卡片复选框设计

#### 视觉规范

```
┌─────────────────────────────────────────┐
│ ☐ │ 🔴 │ 完成项目报告                    │
│ ↑   │    │ 截止：2026-03-15              │
│     │    │ 标签：工作, 重要              │
└─────────────────────────────────────────┘
```

**复选框样式规范**：

| 属性     | 值                      | 说明           |
| -------- | ----------------------- | -------------- |
| 尺寸     | 20px × 20px             | 标准触摸目标   |
| 位置     | 卡片左侧，距左边缘 16px | 与内容保持间距 |
| 圆角     | 4px                     | 与系统圆角一致 |
| 边框宽度 | 2px                     | 清晰可见       |

**状态样式**：

| 状态   | 背景色  | 边框色  | 图标     |
| ------ | ------- | ------- | -------- |
| 未选中 | #FFFFFF | #E5E7EB | 无       |
| 悬停   | #F3F4F6 | #3B82F6 | 无       |
| 选中   | #3B82F6 | #3B82F6 | 白色对勾 |
| 聚焦   | -       | #3B82F6 | -        |

**CSS 变量映射**：

```css
/* 未选中 */
--batch-checkbox-bg: var(--color-bg-primary);
--batch-checkbox-border: var(--color-border-primary);

/* 悬停 */
--batch-checkbox-hover-bg: var(--color-hover-bg);
--batch-checkbox-hover-border: var(--color-primary);

/* 选中 */
--batch-checkbox-checked-bg: var(--color-primary);
--batch-checkbox-checked-border: var(--color-primary);
--batch-checkbox-check-color: var(--color-bg-primary);
```

#### 交互规范

| 交互        | 行为         | 反馈                       |
| ----------- | ------------ | -------------------------- |
| 点击复选框  | 切换选中状态 | 复选框状态变化，工具栏显示 |
| 悬停复选框  | 显示悬停样式 | 边框变为主色               |
| Tab 聚焦    | 显示聚焦环   | 蓝色聚焦阴影               |
| Space/Enter | 切换选中状态 | 同点击                     |

#### 无障碍要求

```tsx
// 复选框 ARIA 属性
<div
  role="checkbox"
  aria-checked={isSelected}
  aria-label={`选择任务: ${task.title}`}
  tabIndex={0}
  onKeyPress={handleKeyPress}
>
```

### 2.2 批量操作工具栏

#### 布局规范

**位置**：筛选栏下方，条件渲染（仅当有选中任务时显示）

```
┌─────────────────────────────────────────────────────────────┐
│  筛选 ▼    排序 ▼    标签 ▼                                  │  ← 原有工具栏
├─────────────────────────────────────────────────────────────┤
│  ☑ 已选择 3 个任务    [全选] [取消全选] [完成] [删除]      │  ← 批量操作工具栏
└─────────────────────────────────────────────────────────────┘
```

**尺寸规范**：

| 属性   | 值      | 说明                   |
| ------ | ------- | ---------------------- |
| 高度   | 56px    | 比筛选栏略高，突出显示 |
| 背景色 | #F3F4F6 | 浅灰背景区分           |
| 内边距 | 0 24px  | 与页面边距一致         |
| 间距   | 12px    | 元素之间间距           |

#### 元素设计

**1. 选择计数**

```
☑ 已选择 3 个任务
```

| 属性     | 值             |
| -------- | -------------- |
| 字体大小 | 14px           |
| 字体颜色 | #111827        |
| 字重     | 500 (Medium)   |
| 图标     | 复选框选中图标 |
| 间距     | 图标与文字 8px |

**2. 操作按钮组**

按钮排列顺序（从左到右）：

1. 全选按钮（次要）
2. 取消全选按钮（次要）
3. 完成按钮（主要）
4. 删除按钮（危险）

**按钮样式规范**：

| 按钮     | 类型 | 背景色      | 文字色  | 悬停背景 |
| -------- | ---- | ----------- | ------- | -------- |
| 全选     | 次要 | transparent | #374151 | #E5E7EB  |
| 取消全选 | 次要 | transparent | #374151 | #E5E7EB  |
| 完成     | 主要 | #3B82F6     | #FFFFFF | #2563EB  |
| 删除     | 危险 | #EF4444     | #FFFFFF | #DC2626  |

**按钮尺寸**：

| 属性     | 值     |
| -------- | ------ |
| 高度     | 36px   |
| 内边距   | 0 16px |
| 圆角     | 6px    |
| 字体大小 | 14px   |
| 字重     | 500    |
| 间距     | 8px    |

#### 动画效果

**工具栏显示/隐藏**：

```css
/* 进入动画 */
@keyframes batchToolbarSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
    max-height: 0;
  }
  to {
    opacity: 1;
    transform: translateY(0);
    max-height: 56px;
  }
}

.batch-toolbar {
  animation: batchToolbarSlideIn 0.2s ease-out;
}
```

**选中计数变化**：

```css
/* 数字变化时的脉冲效果 */
@keyframes countPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.batch-toolbar__count--changed {
  animation: countPulse 0.2s ease-out;
}
```

### 2.3 任务卡片选中状态

#### 视觉样式

```
┌─────────────────────────────────────────┐
│ ☑ │ 🔴 │ 完成项目报告                    │
│     │    │ 截止：2026-03-15              │
│     │    │ 标签：工作, 重要              │
└─────────────────────────────────────────┘
 ↑
 选中状态边框高亮
```

**选中卡片样式**：

| 属性     | 值                                | 说明           |
| -------- | --------------------------------- | -------------- |
| 边框颜色 | #3B82F6                           | 主色边框       |
| 边框宽度 | 2px                               | 比默认粗       |
| 背景色   | #EFF6FF                           | 极浅的蓝色背景 |
| 阴影     | 0 0 0 3px rgba(59, 130, 246, 0.1) | 外发光效果     |

**CSS 实现**：

```css
.task-card--selected {
  border-color: var(--color-primary);
  border-width: 2px;
  background-color: #eff6ff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

### 2.4 确认对话框（批量删除）

#### 设计规范

复用现有 Modal 组件，内容适配批量删除场景：

```
┌─────────────────────────────────────────┐
│  确认批量删除                 [×]       │
├─────────────────────────────────────────┤
│                                         │
│  确定要删除选中的 5 个任务吗？          │
│                                         │
│  此操作无法撤销。                       │
│                                         │
├─────────────────────────────────────────┤
│         [取消]    [删除]                │
└─────────────────────────────────────────┘
```

**特殊样式**：

| 属性     | 值                   |
| -------- | -------------------- |
| 数量高亮 | #EF4444 (红色)       |
| 警告图标 | 可选，显示在标题左侧 |
| 确认按钮 | 红色背景 (#EF4444)   |

---

## 三、快捷键帮助面板 UI 设计

### 3.1 面板布局

```
┌─────────────────────────────────────────┐
│  键盘快捷键              [×]           │
├─────────────────────────────────────────┤
│                                         │
│  任务操作                               │
│  ─────────────────────────────────────  │
│  Ctrl + N        新建任务               │
│  Enter           确认保存               │
│  Esc             取消操作               │
│  Delete          删除任务               │
│  Space           标记完成/未完成        │
│                                         │
│  导航与选择                             │
│  ─────────────────────────────────────  │
│  Ctrl + F        聚焦搜索框             │
│  Ctrl + A        全选任务               │
│                                         │
│  帮助                                   │
│  ─────────────────────────────────────  │
│  ?               显示/隐藏快捷键帮助    │
│                                         │
└─────────────────────────────────────────┘
```

### 3.2 尺寸规范

| 属性     | 值                                  | 说明           |
| -------- | ----------------------------------- | -------------- |
| 宽度     | 400px                               | 固定宽度       |
| 最大高度 | 80vh                                | 视口高度的 80% |
| 圆角     | 12px                                | 与模态框一致   |
| 背景     | #FFFFFF                             | 白色背景       |
| 阴影     | 0 20px 25px -5px rgba(0, 0, 0, 0.1) | 大阴影突出     |

### 3.3 内容区域设计

**标题栏**：

| 属性     | 值                   |
| -------- | -------------------- |
| 高度     | 56px                 |
| 背景     | #FFFFFF              |
| 底部边框 | 1px solid #E5E7EB    |
| 标题字体 | 18px, 600 (SemiBold) |
| 标题颜色 | #111827              |
| 内边距   | 0 24px               |

**分组标题**：

| 属性     | 值             |
| -------- | -------------- |
| 字体大小 | 12px           |
| 字体颜色 | #6B7280        |
| 字重     | 600 (SemiBold) |
| 字间距   | 0.05em         |
| 文本转换 | uppercase      |
| 上边距   | 24px           |
| 下边距   | 12px           |

**快捷键条目**：

| 属性     | 值                       |
| -------- | ------------------------ |
| 高度     | 44px                     |
| 内边距   | 0 24px                   |
| 悬停背景 | #F9FAFB                  |
| 间距     | 快捷键与描述之间自动撑开 |

**快捷键标签**：

| 属性     | 值                |
| -------- | ----------------- |
| 背景     | #F3F4F6           |
| 边框     | 1px solid #E5E7EB |
| 圆角     | 4px               |
| 内边距   | 4px 8px           |
| 字体     | 12px, monospace   |
| 颜色     | #374151           |
| 最小宽度 | 80px              |
| 对齐     | 居中对齐          |

**描述文字**：

| 属性     | 值      |
| -------- | ------- |
| 字体大小 | 14px    |
| 颜色     | #111827 |
| 字重     | 400     |

### 3.4 快捷键标签样式

**单键**：

```
┌─────┐
│  ?  │
└─────┘
```

**组合键**：

```
┌───────┐ ┌─────┐
│ Ctrl  │ │  N  │
└───────┘ └─────┘
```

**CSS 实现**：

```css
.keyboard-shortcut__key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 4px 8px;
  background: linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%);
  border: 1px solid #d1d5db;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 0 #ffffff inset;
  font-family: "SF Mono", Monaco, monospace;
  font-size: 12px;
  font-weight: 500;
  color: #374151;
}
```

### 3.5 触发提示

在页面右下角添加快捷键入口提示：

```
┌─────────────────┐
│  按 ? 查看快捷键 │
└─────────────────┘
```

**样式规范**：

| 属性     | 值                                   |
| -------- | ------------------------------------ |
| 位置     | 固定定位，右下角 24px                |
| 背景     | rgba(0, 0, 0, 0.6)                   |
| 颜色     | #FFFFFF                              |
| 字体大小 | 12px                                 |
| 圆角     | 6px                                  |
| 内边距   | 8px 12px                             |
| 显示时机 | 页面加载后 3 秒显示，持续 5 秒后淡出 |

---

## 四、响应式设计

### 4.1 移动端适配

**批量操作工具栏**：

```
移动端 (< 640px):
┌─────────────────────────────────────┐
│ ☑ 已选择 3 个                      │
│ [全选] [取消] [完成] [删除]        │
└─────────────────────────────────────┘
```

**适配规则**：

| 元素       | 桌面端 | 移动端                  |
| ---------- | ------ | ----------------------- |
| 工具栏高度 | 56px   | 自动（两行）            |
| 按钮排列   | 水平   | 水平但紧凑              |
| 按钮文字   | 完整   | 简化（取消全选 → 取消） |
| 间距       | 12px   | 8px                     |

**快捷键面板**：

移动端不显示快捷键帮助（无物理键盘），但保留：

- 长按任务进入批量选择模式
- 顶部出现批量操作工具栏

### 4.2 平板适配

**断点**：640px - 1024px

保持桌面端布局，适当调整间距：

| 属性           | 值     |
| -------------- | ------ |
| 工具栏内边距   | 0 16px |
| 快捷键面板宽度 | 360px  |

---

## 五、动画与过渡

### 5.1 复选框动画

**选中动画**：

```css
.task-card__checkbox {
  transition: all 0.15s ease-in-out;
}

.task-card__checkbox--checked {
  animation: checkboxBounce 0.3s ease-out;
}

@keyframes checkboxBounce {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
```

**对勾绘制动画**：

```css
.task-card__checkbox-icon {
  stroke-dasharray: 20;
  stroke-dashoffset: 20;
  animation: checkDraw 0.2s ease-out forwards;
}

@keyframes checkDraw {
  to {
    stroke-dashoffset: 0;
  }
}
```

### 5.2 卡片选中动画

```css
.task-card {
  transition: border-color 0.2s ease-out, background-color 0.2s ease-out,
    box-shadow 0.2s ease-out;
}
```

### 5.3 工具栏过渡

```css
.batch-toolbar {
  transition: all 0.2s ease-out;
  overflow: hidden;
}

.batch-toolbar--enter {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.batch-toolbar--enter-active {
  opacity: 1;
  max-height: 56px;
  transform: translateY(0);
}

.batch-toolbar--exit {
  opacity: 1;
  max-height: 56px;
}

.batch-toolbar--exit-active {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}
```

### 5.4 快捷键面板动画

```css
.keyboard-shortcuts-modal {
  animation: modalFadeIn 0.2s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

## 六、组件设计规范

### 6.1 BatchToolbar 组件

```tsx
interface BatchToolbarProps {
  selectedCount: number; // 选中任务数量
  totalCount: number; // 可见任务总数
  onSelectAll: () => void; // 全选回调
  onDeselectAll: () => void; // 取消全选回调
  onBatchComplete: () => void; // 批量完成回调
  onBatchDelete: () => void; // 批量删除回调
}
```

**组件结构**：

```tsx
<div className="batch-toolbar">
  <div className="batch-toolbar__info">
    <CheckboxIcon checked />
    <span className="batch-toolbar__count">已选择 {selectedCount} 个任务</span>
  </div>
  <div className="batch-toolbar__actions">
    <Button variant="secondary" onClick={onSelectAll}>
      全选
    </Button>
    <Button variant="secondary" onClick={onDeselectAll}>
      取消全选
    </Button>
    <Button variant="primary" onClick={onBatchComplete}>
      完成
    </Button>
    <Button variant="danger" onClick={onBatchDelete}>
      删除
    </Button>
  </div>
</div>
```

### 6.2 TaskItem 组件更新

**新增 Props**：

```tsx
interface TaskItemProps {
  // ... 原有 props
  isSelected: boolean; // 是否被选中
  onSelect: (id: string) => void; // 选择回调
  selectionMode: boolean; // 是否处于批量选择模式
}
```

**复选框实现**：

```tsx
<div
  className={`task-card__selection-checkbox ${
    isSelected ? "task-card__selection-checkbox--checked" : ""
  }`}
  onClick={(e) => {
    e.stopPropagation();
    onSelect(task.id);
  }}
  role="checkbox"
  aria-checked={isSelected}
  aria-label={`选择任务: ${task.title}`}
  tabIndex={0}
  onKeyPress={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(task.id);
    }
  }}
>
  {isSelected && (
    <svg className="task-card__checkbox-icon" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  )}
</div>
```

### 6.3 KeyboardShortcutsHelp 组件

```tsx
interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutGroup {
  title: string;
  shortcuts: {
    keys: string[];
    description: string;
  }[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: "任务操作",
    shortcuts: [
      { keys: ["Ctrl", "N"], description: "新建任务" },
      { keys: ["Enter"], description: "确认保存" },
      { keys: ["Esc"], description: "取消操作" },
      { keys: ["Delete"], description: "删除任务" },
      { keys: ["Space"], description: "标记完成/未完成" },
    ],
  },
  {
    title: "导航与选择",
    shortcuts: [
      { keys: ["Ctrl", "F"], description: "聚焦搜索框" },
      { keys: ["Ctrl", "A"], description: "全选任务" },
    ],
  },
  {
    title: "帮助",
    shortcuts: [{ keys: ["?"], description: "显示/隐藏快捷键帮助" }],
  },
];
```

---

## 七、CSS 样式汇总

### 7.1 新增 CSS 变量

```css
:root {
  /* 批量操作 */
  --batch-toolbar-height: 56px;
  --batch-toolbar-bg: #f3f4f6;
  --batch-checkbox-size: 20px;
  --batch-checkbox-border-width: 2px;
  --batch-card-selected-bg: #eff6ff;
  --batch-card-selected-border: var(--color-primary);

  /* 快捷键面板 */
  --shortcuts-modal-width: 400px;
  --shortcuts-key-bg: #f3f4f6;
  --shortcuts-key-border: #d1d5db;
  --shortcuts-key-color: #374151;
  --shortcuts-group-title-color: #6b7280;
}
```

### 7.2 批量操作样式

```css
/* 批量操作工具栏 */
.batch-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--batch-toolbar-height);
  background-color: var(--batch-toolbar-bg);
  padding: 0 var(--spacing-l);
  border-bottom: 1px solid var(--color-border-primary);
}

.batch-toolbar__info {
  display: flex;
  align-items: center;
  gap: var(--spacing-s);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.batch-toolbar__count {
  transition: transform 0.2s ease-out;
}

.batch-toolbar__count--pulse {
  animation: countPulse 0.2s ease-out;
}

.batch-toolbar__actions {
  display: flex;
  gap: var(--spacing-s);
}

/* 任务卡片复选框 */
.task-card__selection-checkbox {
  width: var(--batch-checkbox-size);
  height: var(--batch-checkbox-size);
  border: var(--batch-checkbox-border-width) solid var(--color-border-primary);
  border-radius: var(--radius-sm);
  background-color: var(--color-bg-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  flex-shrink: 0;
  margin-top: 2px;
}

.task-card__selection-checkbox:hover {
  border-color: var(--color-primary);
  background-color: var(--color-hover-bg);
}

.task-card__selection-checkbox--checked {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  animation: checkboxBounce 0.3s ease-out;
}

.task-card__selection-checkbox--checked:hover {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.task-card__selection-checkbox:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

/* 任务卡片选中状态 */
.task-card--selected {
  border-color: var(--batch-card-selected-border);
  border-width: 2px;
  background-color: var(--batch-card-selected-bg);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

### 7.3 快捷键面板样式

```css
/* 快捷键面板遮罩 */
.keyboard-shortcuts-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-index-modal);
  animation: fadeIn 0.2s ease-out;
}

/* 快捷键面板 */
.keyboard-shortcuts-modal {
  width: var(--shortcuts-modal-width);
  max-height: 80vh;
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  animation: modalScaleIn 0.2s ease-out;
  overflow: hidden;
}

/* 面板头部 */
.keyboard-shortcuts__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 var(--spacing-l);
  border-bottom: 1px solid var(--color-border-primary);
}

.keyboard-shortcuts__title {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.keyboard-shortcuts__close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
}

.keyboard-shortcuts__close:hover {
  background-color: var(--color-hover-bg);
  color: var(--color-text-primary);
}

/* 面板内容 */
.keyboard-shortcuts__content {
  overflow-y: auto;
  padding: var(--spacing-m) 0;
}

/* 快捷键分组 */
.keyboard-shortcuts__group {
  margin-bottom: var(--spacing-l);
}

.keyboard-shortcuts__group-title {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--shortcuts-group-title-color);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0 var(--spacing-l);
  margin-bottom: var(--spacing-s);
}

/* 快捷键条目 */
.keyboard-shortcuts__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 var(--spacing-l);
  transition: background-color var(--transition-fast);
}

.keyboard-shortcuts__item:hover {
  background-color: var(--color-bg-secondary);
}

.keyboard-shortcuts__description {
  font-size: var(--font-size-small);
  color: var(--color-text-primary);
}

/* 快捷键标签 */
.keyboard-shortcuts__keys {
  display: flex;
  align-items: center;
  gap: 4px;
}

.keyboard-shortcuts__key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 4px 8px;
  background: linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%);
  border: 1px solid var(--shortcuts-key-border);
  border-radius: var(--radius-sm);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 0 #ffffff inset;
  font-family: "SF Mono", Monaco, "Cascadia Code", monospace;
  font-size: 12px;
  font-weight: 500;
  color: var(--shortcuts-key-color);
}

/* 快捷键提示 */
.keyboard-shortcuts-hint {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background-color: rgba(0, 0, 0, 0.6);
  color: #ffffff;
  font-size: var(--font-size-xs);
  padding: var(--spacing-s) var(--spacing-m);
  border-radius: var(--radius-md);
  pointer-events: none;
  opacity: 0;
  animation: hintFadeInOut 8s ease-out 3s forwards;
}

@keyframes hintFadeInOut {
  0%,
  100% {
    opacity: 0;
    transform: translateY(10px);
  }
  10%,
  90% {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 八、无障碍设计

### 8.1 键盘导航

| 组件         | Tab 顺序     | 焦点样式     |
| ------------ | ------------ | ------------ |
| 任务复选框   | 自然顺序     | 蓝色聚焦环   |
| 批量操作按钮 | 从左到右     | 标准按钮聚焦 |
| 快捷键面板   | 关闭按钮优先 | 明显聚焦指示 |

### 8.2 ARIA 属性

```tsx
// 批量操作工具栏
<div
  role="toolbar"
  aria-label="批量操作"
  aria-controls="task-list"
>

// 复选框
<div
  role="checkbox"
  aria-checked={isSelected}
  aria-label={`选择任务: ${task.title}`}
>

// 快捷键面板
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="shortcuts-title"
>
```

### 8.3 屏幕阅读器提示

- 选中任务时播报："已选择 X 个任务"
- 批量操作完成后播报操作结果
- 快捷键面板打开时播报："快捷键帮助面板已打开"

---

## 九、设计验收清单

### 9.1 批量操作

- [ ] 复选框尺寸 20×20px，符合触摸目标要求
- [ ] 选中状态有明显的视觉反馈（边框+背景+阴影）
- [ ] 工具栏动画流畅，无卡顿
- [ ] 按钮间距和尺寸符合规范
- [ ] 删除按钮使用红色警示色
- [ ] 确认对话框内容清晰，包含数量信息

### 9.2 快捷键面板

- [ ] 面板宽度固定 400px，居中显示
- [ ] 快捷键标签样式统一，使用等宽字体
- [ ] 分组标题使用大写样式
- [ ] 支持 Esc 键关闭
- [ ] 支持点击遮罩关闭
- [ ] 打开时焦点自动移到关闭按钮

### 9.3 响应式

- [ ] 移动端工具栏自适应布局
- [ ] 平板端保持桌面体验
- [ ] 移动端不显示快捷键帮助

### 9.4 无障碍

- [ ] 所有交互元素可通过键盘访问
- [ ] 复选框有正确的 ARIA 属性
- [ ] 颜色对比度符合 WCAG 2.1 AA 标准
- [ ] 焦点指示器清晰可见

---

## 十、附录

### 10.1 相关文档

- [PRD-v0.2-batch-shortcut.md](../docs/PRD-v0.2-batch-shortcut.md) - 产品需求文档
- [design-tokens.css](./design-tokens.css) - 设计令牌
- [components.css](./components.css) - 组件样式

### 10.2 设计资源

| 资源       | 路径                           |
| ---------- | ------------------------------ |
| 设计令牌   | `src/styles/design-tokens.css` |
| 组件样式   | `src/styles/components.css`    |
| 复选框图标 | 内联 SVG                       |

### 10.3 变更历史

| 版本 | 日期       | 变更内容     |
| ---- | ---------- | ------------ |
| v1.0 | 2026-03-09 | 初始版本创建 |

---

**文档结束**

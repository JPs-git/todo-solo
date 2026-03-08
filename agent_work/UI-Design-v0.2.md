# Todo-List v0.2 UI 设计方案

## 文档信息

| 项目     | 内容       |
| -------- | ---------- |
| 产品名称 | Todo-List  |
| 文档版本 | v0.2       |
| 创建日期 | 2026-03-08 |
| 文档状态 | 待确认     |

---

## 一、设计系统（Design System）

### 1.1 色彩系统

#### 主色调

- **主色（Primary）**：`#3B82F6`（蓝色）- 用于主要操作按钮、链接
- **主色悬停**：`#2563EB`
- **主色按下**：`#1D4ED8`

#### 中性色

**背景色**

- 主背景：`#FFFFFF`
- 次级背景：`#F9FAFB`
- 卡片背景：`#FFFFFF`

**文字色**

- 主文字：`#111827`（深灰）
- 次要文字：`#6B7280`（中灰）
- 辅助文字：`#9CA3AF`（浅灰）

**边框色**

- 主边框：`#E5E7EB`
- 次级边框：`#F3F4F6`

#### 功能色

- **成功色**：`#10B981`（绿色）- 完成状态
- **警告色**：`#F59E0B`（黄色）- 提醒
- **错误色**：`#EF4444`（红色）- 删除操作
- **信息色**：`#3B82F6`（蓝色）- 信息提示

#### 状态色

- **已完成任务**：`#D1D5DB`（浅灰）- 已完成任务的文字和边框
- **悬停背景**：`#F3F4F6`

#### 优先级颜色

- **高优先级**：`#EF4444`（红色）- 紧急任务
- **中优先级**：`#F59E0B`（黄色）- 重要任务
- **低优先级**：`#10B981`（绿色）- 普通任务

#### 标签颜色

- **标签 1**：`#3B82F6`（蓝色）
- **标签 2**：`#10B981`（绿色）
- **标签 3**：`#F59E0B`（黄色）
- **标签 4**：`#8B5CF6`（紫色）
- **标签 5**：`#EC4899`（粉色）

---

### 1.2 字体系统

#### 字体家族

**主字体**：`-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif`

#### 字号层级

- **超大标题**：32px / 40px - 页面主标题
- **大标题**：24px / 32px - 区块标题
- **中标题**：18px / 28px - 子标题
- **正文**：16px / 24px - 任务标题
- **小正文**：14px / 20px - 辅助信息
- **辅助文字**：12px / 16px - 时间戳、标签

#### 字重

- **粗体**：700 - 标题、强调文字
- **中等**：500 - 按钮文字
- **常规**：400 - 正文
- **细体**：300 - 辅助文字

---

### 1.3 间距系统

**基础间距单位**：4px

**间距层级**

- **XS**：4px - 紧密元素间距
- **S**：8px - 小元素间距
- **M**：16px - 标准间距
- **L**：24px - 区块间距
- **XL**：32px - 大区块间距
- **XXL**：48px - 页面边距

---

### 1.4 圆角系统

- **小圆角**：4px - 按钮、输入框
- **中圆角**：8px - 卡片、弹窗
- **大圆角**：12px - 大卡片
- **超大圆角**：16px - 特殊组件

---

### 1.5 阴影系统

- **浅阴影**：`0 1px 2px 0 rgba(0, 0, 0, 0.05)` - 悬停状态
- **中阴影**：`0 4px 6px -1px rgba(0, 0, 0, 0.1)` - 卡片
- **深阴影**：`0 10px 15px -3px rgba(0, 0, 0, 0.1)` - 弹窗、下拉菜单

---

## 二、组件设计

### 2.1 页面布局

#### 整体布局

```
┌─────────────────────────────────────────────────┐
│  Todo-List                    [搜索框]          │
├─────────────────────────────────────────────────┤
│                                                 │
│  [筛选：全部 ▼]  [排序：创建时间 ▼]  [标签 ▼]    │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ ☐  🔴 完成项目报告                    │   │
│  │    截止：2026-03-15                   │   │
│  │    标签：工作, 重要                   │   │
│  │    创建于：2026-03-08 10:30            │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ ☑  🟡 购买办公用品                    │   │
│  │    截止：2026-03-10                   │   │
│  │    标签：个人                         │   │
│  │    创建于：2026-03-07 15:20            │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ ☐  🟢 准备周会演示文稿                │   │
│  │    截止：2026-03-12                   │   │
│  │    标签：工作                         │   │
│  │    创建于：2026-03-07 09:00            │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
├─────────────────────────────────────────────────┤
│  [+ 添加新任务]                                   │
└─────────────────────────────────────────────────┘
```

#### 布局尺寸

- 页面最大宽度：1200px
- 页面最小宽度：320px
- 顶部导航栏高度：64px
- 工具栏高度：48px
- 任务卡片高度：100px（增加以容纳新信息）
- 底部操作栏高度：72px

---

### 2.2 顶部导航栏

#### 组件规格

- 高度：64px
- 背景色：`#FFFFFF`
- 边框：底部 1px solid `#E5E7EB`
- 内边距：0 24px

#### Logo 区域

- Logo 图标：24px × 24px
- Logo 文字：18px / 700 / `#111827`
- 间距：8px

#### 搜索框

- 宽度：280px
- 高度：36px
- 背景色：`#F9FAFB`
- 边框：1px solid `#E5E7EB`
- 圆角：8px
- 内边距：0 12px
- 占位符：`#9CA3AF`
- 图标：16px × 16px / `#9CA3AF`

#### 搜索框交互状态

- 默认：背景 `#F9FAFB`，边框 `#E5E7EB`
- 聚焦：背景 `#FFFFFF`，边框 `#3B82F6`，阴影 `0 0 0 3px rgba(59, 130, 246, 0.1)`
- 悬停：背景 `#F3F4F6`，边框 `#D1D5DB`

---

### 2.3 工具栏

#### 组件规格

- 高度：48px
- 背景色：`#F9FAFB`
- 内边距：0 24px
- 间距：16px

#### 筛选下拉框

- 宽度：120px
- 高度：32px
- 背景色：`#FFFFFF`
- 边框：1px solid `#E5E7EB`
- 圆角：6px
- 内边距：0 12px
- 字体：14px / 400 / `#111827`
- 下拉箭头：12px × 12px / `#6B7280`

#### 排序下拉框

- 宽度：140px
- 其他规格同筛选下拉框

#### 标签筛选下拉框

- 宽度：120px
- 其他规格同筛选下拉框

---

### 2.4 任务卡片

#### 组件规格

- 高度：100px（增加以容纳新信息）
- 背景色：`#FFFFFF`
- 边框：1px solid `#E5E7EB`
- 圆角：8px
- 内边距：16px
- 间距：12px（卡片之间）

#### 复选框

- 尺寸：20px × 20px
- 边框：2px solid `#D1D5DB`
- 圆角：4px
- 背景色：`#FFFFFF`
- 选中状态：
  - 背景色：`#10B981`
  - 边框：`#10B981`
  - 对勾：12px × 12px / `#FFFFFF`

#### 优先级指示器

- 尺寸：12px × 12px
- 圆角：50%
- 位置：任务标题左侧，复选框右侧
- 间距：8px
- 颜色：
  - 高优先级：`#EF4444`（红色）
  - 中优先级：`#F59E0B`（黄色）
  - 低优先级：`#10B981`（绿色）

#### 任务标题

- 字体：16px / 400 / `#111827`
- 行高：24px
- 最大行数：2 行
- 已完成状态：
  - 字体：16px / 400 / `#9CA3AF`
  - 删除线

#### 任务描述

- 字体：14px / 400 / `#6B7280`
- 行高：20px
- 最大行数：2 行
- 间距：4px（与任务标题）

#### 截止日期

- 字体：14px / 400 / `#6B7280`
- 行高：20px
- 间距：4px（与任务描述）
- 临近截止日期（1 天内）：字体 `#EF4444`
- 已过期：字体 `#EF4444`，加粗

#### 标签

- 字体：12px / 400 / `#FFFFFF`
- 背景色：根据标签类型变化
- 圆角：12px
- 内边距：4px 12px
- 间距：4px（标签之间）
- 间距：4px（与截止日期）

#### 创建时间

- 字体：12px / 400 / `#9CA3AF`
- 行高：16px
- 间距：4px（与标签）

#### 操作按钮

**编辑按钮**

- 尺寸：32px × 32px
- 背景色：`#F3F4F6`
- 边框：无
- 圆角：6px
- 图标：16px × 16px / `#6B7280`
- 悬停：背景 `#E5E7EB`，图标 `#111827`

**删除按钮**

- 尺寸：32px × 32px
- 背景色：`#FEF2F2`
- 边框：无
- 圆角：6px
- 图标：16px × 16px / `#EF4444`
- 悬停：背景 `#FEE2E2`，图标 `#DC2626`

#### 任务卡片交互状态

- 默认：背景 `#FFFFFF`，边框 `#E5E7EB`
- 悬停：背景 `#F9FAFB`，边框 `#D1D5DB`，阴影 `0 2px 4px rgba(0, 0, 0, 0.05)`
- 编辑模式：背景 `#FFFFFF`，边框 `#3B82F6`，阴影 `0 0 0 3px rgba(59, 130, 246, 0.1)`
- 拖拽状态：背景 `#F3F4F6`，边框 `#D1D5DB`，阴影 `0 4px 6px -1px rgba(0, 0, 0, 0.1)`

---

### 2.5 底部操作栏

#### 组件规格

- 高度：72px
- 背景色：`#FFFFFF`
- 边框：顶部 1px solid `#E5E7EB`
- 内边距：0 24px
- 对齐：居中

#### 添加任务按钮

- 宽度：200px
- 高度：44px
- 背景色：`#3B82F6`
- 边框：无
- 圆角：8px
- 字体：16px / 500 / `#FFFFFF`
- 图标：20px × 20px / `#FFFFFF`
- 间距：8px（图标与文字）

#### 添加任务按钮交互状态

- 默认：背景 `#3B82F6`
- 悬停：背景 `#2563EB`
- 按下：背景 `#1D4ED8`
- 禁用：背景 `#9CA3AF`

---

### 2.6 任务表单

#### 组件规格

- 宽度：100%
- 背景色：`#FFFFFF`
- 边框：1px solid `#E5E7EB`
- 圆角：8px
- 内边距：16px
- 阴影：`0 4px 6px -1px rgba(0, 0, 0, 0.1)`

#### 表单字段

**标题输入框**

- 宽度：100%
- 高度：48px
- 背景色：`#FFFFFF`
- 边框：1px solid `#E5E7EB`
- 圆角：8px
- 内边距：0 16px
- 字体：16px / 400 / `#111827`
- 占位符：`#9CA3AF`

**描述输入框**

- 宽度：100%
- 高度：80px
- 背景色：`#FFFFFF`
- 边框：1px solid `#E5E7EB`
- 圆角：8px
- 内边距：12px 16px
- 字体：14px / 400 / `#111827`
- 占位符：`#9CA3AF`
- 多行文本：支持

**优先级选择器**

- 宽度：100%
- 高度：48px
- 背景色：`#FFFFFF`
- 边框：1px solid `#E5E7EB`
- 圆角：8px
- 内边距：0 16px
- 字体：14px / 400 / `#111827`
- 选项：
  - 高：红色指示器
  - 中：黄色指示器
  - 低：绿色指示器

**日期选择器**

- 宽度：100%
- 高度：48px
- 背景色：`#FFFFFF`
- 边框：1px solid `#E5E7EB`
- 圆角：8px
- 内边距：0 16px
- 字体：14px / 400 / `#111827`
- 占位符：`#9CA3AF`

**标签输入框**

- 宽度：100%
- 高度：48px
- 背景色：`#FFFFFF`
- 边框：1px solid `#E5E7EB`
- 圆角：8px
- 内边距：0 16px
- 字体：14px / 400 / `#111827`
- 占位符：`#9CA3AF`
- 支持：逗号分隔多个标签

#### 表单按钮

**保存按钮**

- 宽度：120px
- 高度：44px
- 背景色：`#3B82F6`
- 边框：无
- 圆角：8px
- 字体：16px / 500 / `#FFFFFF`

**取消按钮**

- 宽度：120px
- 高度：44px
- 背景色：`#FFFFFF`
- 边框：1px solid `#E5E7EB`
- 圆角：8px
- 字体：16px / 500 / `#111827`

---

## 三、响应式设计

### 3.1 断点系统

- **移动端**：< 640px
- **平板端**：640px - 1024px
- **桌面端**：> 1024px

### 3.2 响应式适配

#### 移动端（< 640px）

- 页面边距：16px
- 搜索框宽度：100%
- 工具栏：垂直排列，每个组件占满宽度
- 任务卡片高度：120px（增加以适应垂直布局）
- 底部操作栏：固定在底部
- 任务表单：全屏显示

#### 平板端（640px - 1024px）

- 页面边距：24px
- 搜索框宽度：200px
- 工具栏：水平排列，组件宽度自适应
- 任务卡片高度：100px

#### 桌面端（> 1024px）

- 页面边距：48px
- 搜索框宽度：280px
- 工具栏：水平排列
- 任务卡片高度：100px

---

## 四、交互设计

### 4.1 动画效果

#### 过渡动画

- 标准过渡：`transition: all 0.2s ease-in-out`
- 快速过渡：`transition: all 0.15s ease-in-out`
- 慢速过渡：`transition: all 0.3s ease-in-out`

#### 动画效果

- 淡入：`opacity: 0 → 1`
- 滑入：`transform: translateY(10px) → translateY(0)`
- 缩放：`transform: scale(0.95) → scale(1)`

### 4.2 微交互

#### 按钮点击

- 按下时：缩放 0.95
- 释放时：恢复 1.0

#### 任务完成

- 复选框：旋转动画 0.2s
- 任务标题：淡出 0.2s → 删除线 → 淡入 0.2s

#### 任务删除

- 卡片：淡出 0.3s + 滑出 0.3s

#### 任务添加

- 卡片：淡入 0.3s + 滑入 0.3s

#### 拖拽排序

- 拖拽开始：卡片轻微放大，阴影加深
- 拖拽过程：实时显示位置变化，其他卡片平滑移动
- 拖拽结束：卡片恢复正常大小和阴影

### 4.3 触摸交互

#### 移动端适配

- 按钮最小点击区域：44px × 44px
- 滑动操作：支持左右滑动任务卡片显示操作按钮
- 长按操作：长按任务卡片进入拖拽模式
- 下拉刷新：支持下拉刷新任务列表

---

## 五、可访问性设计

### 5.1 对比度

- 文字与背景对比度：≥ 4.5:1
- 大文字与背景对比度：≥ 3:1
- 交互元素与背景对比度：≥ 3:1

### 5.2 键盘导航

- Tab 键：焦点在可交互元素间切换
- Enter 键：确认操作
- Esc 键：取消操作、关闭弹窗
- 方向键：在列表中导航

### 5.3 焦点状态

- 焦点边框：2px solid `#3B82F6`
- 焦点阴影：`0 0 0 3px rgba(59, 130, 246, 0.1)`

---

## 六、设计规范总结

| 元素     | 规格       | 颜色/样式                |
| -------- | ---------- | ------------------------ |
| 主色     | -          | `#3B82F6`                |
| 主文字   | 16px / 400 | `#111827`                |
| 次要文字 | 14px / 400 | `#6B7280`                |
| 辅助文字 | 12px / 400 | `#9CA3AF`                |
| 主按钮   | 44px 高度  | `#3B82F6` 背景           |
| 卡片     | 100px 高度 | `#FFFFFF` 背景，8px 圆角 |
| 输入框   | 48px 高度  | `#E5E7EB` 边框           |
| 间距     | -          | 4px 基础单位             |
| 圆角     | -          | 4px / 8px / 12px / 16px  |
| 阴影     | -          | 浅/中/深三级             |
| 高优先级 | -          | `#EF4444`                |
| 中优先级 | -          | `#F59E0B`                |
| 低优先级 | -          | `#10B981`                |

---

## 七、组件状态图

### 7.1 任务卡片状态

#### 默认状态

```
┌─────────────────────────────────────────────────┐
│ ☐  🔴 完成项目报告                    │   │
│    截止：2026-03-15                   │   │
│    标签：工作, 重要                   │   │
│    创建于：2026-03-08 10:30            │   │
└─────────────────────────────────────────────────┘
```

#### 悬停状态

```
┌─────────────────────────────────────────────────┐
│ ☐  🔴 完成项目报告                    │   │
│    截止：2026-03-15                   │   │
│    标签：工作, 重要                   │   │
│    创建于：2026-03-08 10:30            │   │
└─────────────────────────────────────────────────┘
背景：#F9FAFB
边框：#D1D5DB
阴影：0 2px 4px rgba(0, 0, 0, 0.05)
```

#### 已完成状态

```
┌─────────────────────────────────────────────────┐
│ ☑  🟡 购买办公用品                    │   │
│    截止：2026-03-10                   │   │
│    标签：个人                         │   │
│    创建于：2026-03-07 15:20            │   │
└─────────────────────────────────────────────────┘
文字：#9CA3AF
删除线：有
```

#### 编辑状态

```
┌─────────────────────────────────────────────────┐
│ ☐  [完成项目报告________________]            │   │
│    [截止：2026-03-15_____________]            │   │
│    [标签：工作, 重要_____________]            │   │
│    创建于：2026-03-08 10:30            │   │
└─────────────────────────────────────────────────┘
边框：#3B82F6
阴影：0 0 0 3px rgba(59, 130, 246, 0.1)
```

#### 拖拽状态

```
┌─────────────────────────────────────────────────┐
│ ☐  🔴 完成项目报告                    │   │
│    截止：2026-03-15                   │   │
│    标签：工作, 重要                   │   │
│    创建于：2026-03-08 10:30            │   │
└─────────────────────────────────────────────────┘
背景：#F3F4F6
边框：#D1D5DB
阴影：0 4px 6px -1px rgba(0, 0, 0, 0.1)
缩放：1.02
```

### 7.2 按钮状态

#### 主按钮（添加任务）

- 默认：背景 `#3B82F6`，文字 `#FFFFFF`
- 悬停：背景 `#2563EB`，文字 `#FFFFFF`
- 按下：背景 `#1D4ED8`，文字 `#FFFFFF`
- 禁用：背景 `#9CA3AF`，文字 `#FFFFFF`

#### 次要按钮（取消）

- 默认：背景 `#FFFFFF`，边框 `#E5E7EB`，文字 `#111827`
- 悬停：背景 `#F9FAFB`，边框 `#D1D5DB`，文字 `#111827`
- 按下：背景 `#F3F4F6`，边框 `#D1D5DB`，文字 `#111827`

#### 危险按钮（删除）

- 默认：背景 `#FEF2F2`，文字 `#EF4444`
- 悬停：背景 `#FEE2E2`，文字 `#DC2626`
- 按下：背景 `#FECACA`，文字 `#B91C1C`

---

## 八、图标规范

### 8.1 图标尺寸

- **小图标**：12px × 12px - 下拉箭头
- **中图标**：16px × 16px - 搜索、编辑、删除
- **大图标**：20px × 20px - 添加按钮图标
- **超大图标**：24px × 24px - Logo

### 8.2 图标颜色

- **主色图标**：`#3B82F6` - 主要操作
- **中性图标**：`#6B7280` - 次要操作
- **成功图标**：`#10B981` - 完成状态
- **错误图标**：`#EF4444` - 删除操作
- **优先级图标**：
  - 高：`#EF4444`
  - 中：`#F59E0B`
  - 低：`#10B981`

---

## 九、空状态设计

### 9.1 无任务状态

```
┌─────────────────────────────────────────────────┐
│                                                 │
│                   [空状态图标]                   │
│                                                 │
│                  暂无任务                       │
│             点击下方按钮添加新任务               │
│                                                 │
└─────────────────────────────────────────────────┘
```

- 图标：64px × 64px / `#D1D5DB`
- 标题：18px / 500 / `#6B7280`
- 描述：14px / 400 / `#9CA3AF`

### 9.2 搜索无结果状态

```
┌─────────────────────────────────────────────────┐
│                                                 │
│                   [搜索图标]                     │
│                                                 │
│                  未找到相关任务                 │
│             请尝试其他关键词                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

- 图标：64px × 64px / `#D1D5DB`
- 标题：18px / 500 / `#6B7280`
- 描述：14px / 400 / `#9CA3AF`

---

## 十、加载状态

### 10.1 加载动画

- 类型：旋转圆环
- 尺寸：32px × 32px
- 颜色：`#3B82F6`
- 位置：居中显示

### 10.2 骨架屏

```
┌─────────────────────────────────────────────────┐
│ ☐  [████████████████████████████]              │
│    [████████████████████]                      │
│    [████████████] [██████████]                │
│    [████████████████████]                      │
└─────────────────────────────────────────────────┘
```

- 背景色：`#F3F4F6`
- 动画：渐变闪烁 1.5s

---

## 十一、功能实现细节

### 11.1 任务分类/标签

- **UI 实现**：

  - 标签以彩色圆角矩形显示
  - 支持最多 5 个不同颜色的标签
  - 标签筛选下拉框显示所有已使用的标签
  - 点击标签可快速筛选相关任务

- **交互设计**：
  - 添加任务时，输入逗号分隔的标签
  - 编辑任务时，可修改现有标签
  - 悬停标签时显示删除按钮
  - 支持点击标签快速筛选

### 11.2 任务优先级

- **UI 实现**：

  - 优先级以彩色圆点指示器显示
  - 高优先级（红色）、中优先级（黄色）、低优先级（绿色）
  - 优先级选择器显示彩色选项
  - 支持按优先级排序

- **交互设计**：
  - 添加/编辑任务时可选择优先级
  - 点击优先级指示器可快速修改
  - 排序时优先级高的任务排在前面

### 11.3 截止日期和提醒

- **UI 实现**：

  - 显示任务截止日期
  - 临近截止日期（1 天内）显示红色文字
  - 已过期任务显示红色加粗文字
  - 支持按截止日期排序

- **交互设计**：
  - 添加/编辑任务时可选择截止日期
  - 点击日期可打开日期选择器
  - 排序时临近截止日期的任务排在前面

### 11.4 任务描述和备注

- **UI 实现**：

  - 任务描述显示在任务标题下方
  - 最多显示 2 行，超出部分省略
  - 编辑时显示多行文本输入框

- **交互设计**：
  - 添加/编辑任务时可输入详细描述
  - 支持换行和基本格式
  - 保存后自动显示在任务卡片上

### 11.5 拖拽排序

- **UI 实现**：

  - 拖拽时卡片轻微放大，阴影加深
  - 拖拽过程中显示位置指示线
  - 其他卡片平滑移动

- **交互设计**：
  - 长按任务卡片进入拖拽模式
  - 拖动到目标位置释放
  - 自动保存新的排序顺序
  - 支持在不同状态的任务之间拖拽

### 11.6 移动端适配

- **UI 实现**：

  - 响应式布局，适配不同屏幕尺寸
  - 移动端优化的触摸目标大小
  - 垂直排列的工具栏
  - 全屏显示的任务表单

- **交互设计**：
  - 支持左右滑动任务卡片显示操作按钮
  - 长按任务卡片进入拖拽模式
  - 下拉刷新任务列表
  - 优化的触摸反馈

---

## 十二、设计文件

### 12.1 设计令牌（Design Tokens）

```css
/* 设计令牌 */
:root {
  /* 主色调 */
  --primary: #3b82f6;
  --primary-hover: #2563eb;
  --primary-active: #1d4ed8;

  /* 中性色 */
  --background: #ffffff;
  --background-secondary: #f9fafb;
  --card-background: #ffffff;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --text-tertiary: #9ca3af;
  --border-primary: #e5e7eb;
  --border-secondary: #f3f4f6;

  /* 功能色 */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;

  /* 状态色 */
  --completed: #d1d5db;
  --hover-background: #f3f4f6;

  /* 优先级颜色 */
  --priority-high: #ef4444;
  --priority-medium: #f59e0b;
  --priority-low: #10b981;

  /* 标签颜色 */
  --tag-1: #3b82f6;
  --tag-2: #10b981;
  --tag-3: #f59e0b;
  --tag-4: #8b5cf6;
  --tag-5: #ec4899;

  /* 字体 */
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  --font-size-xl: 32px;
  --font-size-lg: 24px;
  --font-size-md: 18px;
  --font-size-base: 16px;
  --font-size-sm: 14px;
  --font-size-xs: 12px;
  --font-weight-bold: 700;
  --font-weight-medium: 500;
  --font-weight-normal: 400;
  --font-weight-light: 300;

  /* 间距 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-xxl: 48px;

  /* 圆角 */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --border-radius-xl: 16px;

  /* 阴影 */
  --shadow-light: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-medium: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-dark: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

  /* 过渡 */
  --transition-fast: 0.15s ease-in-out;
  --transition-normal: 0.2s ease-in-out;
  --transition-slow: 0.3s ease-in-out;
}
```

### 12.2 组件样式

```css
/* 任务卡片 */
.task-card {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-md);
  background: var(--card-background);
  border: 1px solid var(--border-primary);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-sm);
  transition: all var(--transition-normal);
  position: relative;
}

.task-card:hover {
  background: var(--hover-background);
  border-color: var(--border-secondary);
  box-shadow: var(--shadow-light);
}

.task-card.completed {
  opacity: 0.7;
}

.task-card.completed .task-title {
  text-decoration: line-through;
  color: var(--text-tertiary);
}

/* 任务头部 */
.task-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: var(--spacing-xs);
}

.task-checkbox {
  margin-right: var(--spacing-sm);
  margin-top: 2px;
}

.priority-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: var(--spacing-sm);
  margin-top: 6px;
}

.priority-high {
  background-color: var(--priority-high);
}

.priority-medium {
  background-color: var(--priority-medium);
}

.priority-low {
  background-color: var(--priority-low);
}

.task-title {
  flex: 1;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  color: var(--text-primary);
  line-height: 1.5;
  margin: 0;
}

/* 任务内容 */
.task-content {
  margin-left: 40px;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.4;
  margin-bottom: var(--spacing-xs);
}

/* 任务元数据 */
.task-meta {
  margin-left: 40px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.task-due-date {
  margin-right: var(--spacing-md);
}

.task-due-date.urgent {
  color: var(--error);
}

.task-due-date.overdue {
  color: var(--error);
  font-weight: var(--font-weight-medium);
}

/* 标签 */
.task-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-right: var(--spacing-md);
}

.tag {
  padding: 2px 10px;
  border-radius: 12px;
  font-size: var(--font-size-xs);
  color: white;
  background-color: var(--tag-1);
}

/* 任务操作 */
.task-actions {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  display: flex;
  gap: var(--spacing-xs);
}

.action-button {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.edit-button {
  background-color: var(--hover-background);
  color: var(--text-secondary);
}

.edit-button:hover {
  background-color: var(--border-primary);
  color: var(--text-primary);
}

.delete-button {
  background-color: #fef2f2;
  color: var(--error);
}

.delete-button:hover {
  background-color: #fee2e2;
  color: #dc2626;
}

/* 工具栏 */
.toolbar {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--background-secondary);
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
}

.toolbar-select {
  padding: 6px 12px;
  border: 1px solid var(--border-primary);
  border-radius: var(--border-radius-sm);
  background-color: var(--background);
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.toolbar-select:hover {
  border-color: var(--border-secondary);
  background-color: var(--hover-background);
}

/* 任务表单 */
.task-form {
  padding: var(--spacing-md);
  background-color: var(--background);
  border: 1px solid var(--border-primary);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-md);
  box-shadow: var(--shadow-medium);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.form-input {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid var(--border-primary);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  color: var(--text-primary);
  transition: all var(--transition-fast);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-primary);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  resize: vertical;
  min-height: 80px;
  transition: all var(--transition-fast);
}

.form-textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-lg);
}

.btn {
  padding: 10px 24px;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-primary {
  background-color: var(--primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-secondary {
  background-color: var(--background);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}

.btn-secondary:hover {
  background-color: var(--hover-background);
  border-color: var(--border-secondary);
}

/* 响应式设计 */
@media (max-width: 640px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-select {
    width: 100%;
  }

  .task-card {
    padding: var(--spacing-sm);
  }

  .task-actions {
    position: static;
    margin-top: var(--spacing-sm);
    justify-content: flex-end;
  }

  .task-content,
  .task-meta {
    margin-left: 32px;
  }
}

/* 拖拽样式 */
.task-card.dragging {
  opacity: 0.8;
  transform: scale(1.02);
  box-shadow: var(--shadow-dark);
  z-index: 1000;
}

.drag-over {
  border: 2px dashed var(--primary);
}
```

---

## 文档确认

| 角色       | 姓名 | 确认日期 | 签名 |
| ---------- | ---- | -------- | ---- |
| 产品经理   |      |          |      |
| UI 设计师  |      |          |      |
| 技术负责人 |      |          |      |

---

**文档结束**

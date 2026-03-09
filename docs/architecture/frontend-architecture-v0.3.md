# Todo-List v0.3 前端架构设计方案

## 文档信息

| 项目     | 内容                  |
| -------- | --------------------- |
| 产品名称 | Todo-List             |
| 文档版本 | v0.3                  |
| 创建日期 | 2026-03-09            |
| 设计状态 | 架构设计              |

---

## 一、架构概述

### 1.1 设计目标

基于 PRD-v0.3.md 和 UI-Design-v0.3.md，v0.3 版本将在技术栈和功能上进行重大升级：

- **技术栈升级**：引入 Ant Design 组件库和 Tailwind CSS 样式系统
- **状态管理升级**：从 Context API 迁移到 Zustand
- **功能增强**：新增废纸篓、撤销操作、数据导入导出功能
- **UI 统一**：统一所有模态框和交互组件的样式

### 1.2 版本演进

| 版本 | 技术栈 | 状态管理 | 样式方案 |
|------|--------|----------|----------|
| v0.1/v0.2 | React + TypeScript | Context API + useReducer | 原生 CSS + CSS 变量 |
| v0.3 | React + TypeScript + Ant Design + Tailwind | Zustand | Tailwind CSS + Ant Design 主题 |

---

## 二、技术栈设计

### 2.1 技术栈选型

| 分类 | 技术 | 版本 | 选型理由 | 溯源 |
|------|------|------|----------|------|
| 框架 | React | 18.x | 生态丰富，适合快速开发 | PRD-v0.3 5.1 |
| 语言 | TypeScript | 5.x | 类型安全，减少运行时错误 | PRD-v0.3 5.1 |
| 构建工具 | Vite | 5.x | 快速开发服务器和构建速度 | 现有项目保持 |
| 组件库 | Ant Design | 5.x | 统一 UI 组件，提升开发效率 | UI-Design-v0.3 1.2 |
| 样式系统 | Tailwind CSS | 4.x | 工具类样式，减少 CSS 体积 | PRD-v0.3 2.2.3 |
| 状态管理 | Zustand | 4.x | 轻量级、简洁 API、 TypeScript 友好 | PRD-v0.3 5.1 |
| 日期处理 | dayjs | 1.x | 轻量级日期处理库 | UI-Design-v0.3 |
| 测试工具 | Vitest | 1.x | 快速单元测试框架 | 现有项目保持 |
| E2E 测试 | Playwright | 1.x | 现代 E2E 测试框架 | 现有项目保持 |

### 2.2 技术升级对比

#### 2.2.1 样式系统升级

```
原有方案                          新方案
─────────────────────────────────────────────────────────────
纯 CSS 类名                      Tailwind 工具类
                                   ↓
.components.css (大文件)          内联工具类 + @layer components
                                   ↓
CSS 变量 (design-tokens.css)      Tailwind 配置 (tailwind.config.js)
                                   ↓
手动维护样式                      自动化样式生成
                                   ↓
响应式媒体查询                    Tailwind响应式前缀
```

**样式迁移策略**：
1. **渐进式迁移**：保留现有 CSS，逐步将组件迁移到 Tailwind
2. **组件级迁移**：按组件维度进行迁移，每迁移一个组件确保测试通过
3. **@layer components**：使用 `@layer components` 封装复杂组件样式
4. **自定义主题**：在 Tailwind 配置中扩展主题色板

#### 2.2.2 状态管理升级

```
原有方案                          新方案
─────────────────────────────────────────────────────────────
Context API + useReducer          Zustand
                                   ↓
多个 Context 分散状态             单一 Store 集中管理
                                   ↓
dispatch(action) 显式更新         set() 自动合并状态
                                   ↓
useContext() 订阅更新             useStore() 选择性订阅
                                   ↓
Reducer 逻辑复杂                  Middleware 支持扩展
                                   ↓
需要手动处理中间件               内置持久化、devtools 支持
```

---

## 三、目录结构设计

### 3.1 完整目录结构

```
todo-solo/
├── src/
│   ├── components/              # 组件目录
│   │   ├── common/              # 通用组件（Ant Design 封装）
│   │   │   ├── UnifiedModal.tsx    # 统一模态框
│   │   │   ├── UnifiedConfirm.tsx  # 统一确认框
│   │   │   └── index.ts
│   │   ├── layout/              # 布局组件
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Layout.tsx
│   │   ├── task/                # 任务相关组件
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskItem.tsx
│   │   │   ├── TaskFormModal.tsx   # Ant Design Modal
│   │   │   ├── BatchToolbar.tsx
│   │   │   └── index.ts
│   │   ├── trash/               # 废纸篓组件
│   │   │   ├── TrashPage.tsx
│   │   │   ├── TrashItem.tsx
│   │   │   └── index.ts
│   │   └── settings/            # 设置组件
│   │       └── SettingsPage.tsx
│   ├── hooks/                   # 自定义 Hooks
│   │   ├── useTasks.ts             # 任务管理（Zustand）
│   │   ├── useTrash.ts             # 废纸篓管理
│   │   ├── useUndo.ts              # 撤销操作
│   │   ├── useKeyboardShortcuts.ts # 快捷键
│   │   └── useLocalStorage.ts      # 本地存储
│   ├── store/                   # Zustand Store
│   │   ├── taskStore.ts         # 任务状态
│   │   ├── uiStore.ts           # UI 状态
│   │   └── index.ts             # Store 导出
│   ├── types/                   # TypeScript 类型
│   │   └── index.ts             # 类型定义
│   ├── utils/                   # 工具函数
│   │   ├── storage.ts           # 存储工具
│   │   ├── helpers.ts           # 辅助函数
│   │   └── importExport.ts      # 导入导出工具
│   ├── styles/                  # 样式文件
│   │   ├── index.css            # 入口样式
│   │   └── components.css      # 自定义组件样式
│   ├── App.tsx                  # 应用根组件
│   └── main.tsx                 # 入口文件
├── tailwind.config.js           # Tailwind 配置
├── postcss.config.js            # PostCSS 配置
├── vite.config.ts               # Vite 配置
└── package.json                 # 项目配置
```

### 3.2 目录设计原则

1. **功能模块化**：按功能划分目录（task、trash、settings）
2. **组件分类**：
   - `common/`：通用封装组件
   - `layout/`：布局组件
   - `task/`：任务相关组件
   - `trash/`：废纸篓组件
3. **状态集中**：`store/` 目录集中管理所有 Zustand Store
4. **样式共存**：保留 `styles/` 目录用于 Tailwind 无法覆盖的复杂样式

---

## 四、组件架构设计

### 4.1 组件关系图

```
┌─────────────────────────────────────────────────────────────────┐
│                          App.tsx                                │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                     Zustand Store                          │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │ │
│  │  │ taskStore   │  │  uiStore    │  │  trashStore     │   │ │
│  │  │ - tasks     │  │ - isModal   │  │  - trashItems   │   │ │
│  │  │ - filter    │  │ - batchMode │  │  - selectedIds  │   │ │
│  │  │ - sortBy    │  │ - sidebar   │  │                 │   │ │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘   │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                      Layout.tsx                             │ │
│  │  ┌──────────┐  ┌──────────────────────────────────────┐   │ │
│  │  │ Sidebar  │  │           Main Content               │   │ │
│  │  │          │  │  ┌────────────────────────────────┐  │   │ │
│  │  │ • 我的任务│  │  │  Header.tsx (搜索/新建/设置)  │  │   │ │
│  │  │ • 收藏   │  │  └────────────────────────────────┘  │   │ │
│  │  │ • 日历   │  │  ┌────────────────────────────────┐  │   │ │
│  │  │ • 废纸篓 │  │  │  TaskList.tsx                  │  │   │ │
│  │  │ • 设置   │  │  │  ┌──────────────────────────┐  │  │   │ │
│  │  │          │  │  │  │  TaskItem[]              │  │  │   │ │
│  │  │          │  │  │  │  • 选择框 (Checkbox)     │  │  │   │ │
│  │  │          │  │  │  │  • 完成框 (Checkbox)     │  │  │   │ │
│  │  │          │  │  │  │  • 操作按钮              │  │  │   │ │
│  │  │          │  │  │  └──────────────────────────┘  │  │   │ │
│   │  │          │  │  │  ┌──────────────────────────┐  │  │   │ │
│   │  │          │  │  │  │  BatchToolbar (固定底部) │  │  │   │ │
│   │  │          │  │  │  └──────────────────────────┘  │  │   │ │
│   │  │          │  │  └────────────────────────────────┘  │   │ │
│   │  │          │  │  ┌────────────────────────────────┐  │   │ │
│   │  │          │  │  │  TrashPage.tsx (废纸篓页面)  │  │   │ │
│   │  │          │  │  └────────────────────────────────┘  │   │ │
│   │  └──────────┘  └──────────────────────────────────────┘   │ │
│   └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Ant Design 组件使用                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │   Modal      │  │  Checkbox    │  │    Popconfirm        │ │
│  │ (任务表单)   │  │ (选择/完成)  │  │    (删除确认)        │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │   Button     │  │    Badge     │  │    List              │ │
│  │ (操作按钮)   │  │ (选中计数)   │  │    (任务列表)        │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │   Select     │  │    DatePicker│  │    Dropdown           │ │
│  │ (筛选/排序)  │  │ (截止日期)   │  │    (更多操作)         │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Ant Design 组件集成方案

#### 4.2.1 统一模态框封装

```typescript
// src/components/common/UnifiedModal.tsx

import { Modal, ModalProps } from 'antd';
import React from 'react';

export interface UnifiedModalProps extends ModalProps {
  children: React.ReactNode;
}

export const UnifiedModal: React.FC<UnifiedModalProps> = ({
  children,
  ...modalProps
}) => {
  return (
    <Modal
      centered
      maskClosable={false}
      footer={null}
      className="unified-modal"
      {...modalProps}
    >
      {children}
    </Modal>
  );
};
```

#### 4.2.2 任务表单 Modal

```typescript
// src/components/task/TaskFormModal.tsx

import { Modal, Form, Input, Select, DatePicker, Tag } from 'antd';
import dayjs from 'dayjs';
import type { Task, TaskFormValues } from '../../types';

interface TaskFormModalProps {
  open: boolean;
  task?: Task | null;
  onSubmit: (values: TaskFormValues) => void;
  onCancel: () => void;
}
```

**溯源**：UI-Design-v0.3.md 3.3 任务表单 Modal

#### 4.2.3 TaskItem 组件设计

```typescript
// src/components/task/TaskItem.tsx

import { Checkbox, Button, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface TaskItemProps {
  task: Task;
  isBatchMode: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}
```

**溯源**：UI-Design-v0.3.md 2.3 任务卡片实现

#### 4.2.4 BatchToolbar 组件设计

```typescript
// src/components/task/BatchToolbar.tsx

import { Space, Button, Badge, Dropdown } from 'antd';

interface BatchToolbarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBatchComplete: () => void;
  onBatchIncomplete: () => void;
  onBatchDelete: () => void;
}
```

**溯源**：UI-Design-v0.3.md 2.5 批量操作工具栏

---

## 五、状态管理架构设计

### 5.1 Zustand Store 设计

#### 5.1.1 任务状态 Store

```typescript
// src/store/taskStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, TaskFilter, TaskSortBy } from '../types';

interface TaskState {
  tasks: Task[];
  filter: TaskFilter;
  sortBy: TaskSortBy;
  searchTerm: string;
  selectedTag: string | null;
  selectedTaskIds: string[];
  isBatchMode: boolean;
  
  // Actions
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  setFilter: (filter: TaskFilter) => void;
  setSortBy: (sortBy: TaskSortBy) => void;
  setSearchTerm: (term: string) => void;
  setSelectedTag: (tag: string | null) => void;
  
  // Batch Actions
  selectTask: (id: string) => void;
  deselectTask: (id: string) => void;
  selectAllTasks: () => void;
  deselectAllTasks: () => void;
  deleteSelectedTasks: () => void;
  toggleSelectedTasks: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      filter: 'all',
      sortBy: 'createdAt',
      searchTerm: '',
      selectedTag: null,
      selectedTaskIds: [],
      isBatchMode: false,
      
      addTask: (task) => set((state) => ({ 
        tasks: [task, ...state.tasks] 
      })),
      
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === id ? { ...task, ...updates, updatedAt: Date.now() } : task
        )
      })),
      
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(task => task.id !== id)
      })),
      
      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map(task =>
          task.id === id ? { ...task, completed: !task.completed, updatedAt: Date.now() } : task
        )
      })),
      
      setFilter: (filter) => set({ filter }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSearchTerm: (searchTerm) => set({ searchTerm }),
      setSelectedTag: (selectedTag) => set({ selectedTag }),
      
      selectTask: (id) => set((state) => ({
        selectedTaskIds: [...state.selectedTaskIds, id],
        isBatchMode: true
      })),
      
      deselectTask: (id) => set((state) => {
        const newSelectedIds = state.selectedTaskIds.filter(taskId => taskId !== id);
        return {
          selectedTaskIds: newSelectedIds,
          isBatchMode: newSelectedIds.length > 0
        };
      }),
      
      selectAllTasks: () => set((state) => ({
        selectedTaskIds: getFilteredTasks(state).map(task => task.id),
        isBatchMode: true
      })),
      
      deselectAllTasks: () => set({ 
        selectedTaskIds: [], 
        isBatchMode: false 
      }),
      
      deleteSelectedTasks: () => set((state) => ({
        tasks: state.tasks.filter(task => !state.selectedTaskIds.includes(task.id)),
        selectedTaskIds: [],
        isBatchMode: false
      })),
      
      toggleSelectedTasks: () => set((state) => ({
        tasks: state.tasks.map(task =>
          state.selectedTaskIds.includes(task.id)
            ? { ...task, completed: !task.completed, updatedAt: Date.now() }
            : task
        ),
        selectedTaskIds: [],
        isBatchMode: false
      })),
    }),
    {
      name: 'todo-task-storage',
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
);

// Helper function
const getFilteredTasks = (state: TaskState): Task[] => {
  return state.tasks.filter(task => {
    const matchesFilter = state.filter === 'all' 
      ? true 
      : state.filter === 'completed' ? task.completed : !task.completed;
    const matchesSearch = state.searchTerm === '' 
      ? true 
      : task.title.toLowerCase().includes(state.searchTerm.toLowerCase());
    const matchesTag = !state.selectedTag || task.tags.includes(state.selectedTag);
    return matchesFilter && matchesSearch && matchesTag;
  });
};
```

#### 5.1.2 UI 状态 Store

```typescript
// src/store/uiStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isTaskFormOpen: boolean;
  editingTask: string | null;
  isSidebarCollapsed: boolean;
  showShortcutsHelp: boolean;
  
  // Actions
  openTaskForm: () => void;
  closeTaskForm: () => void;
  setEditingTask: (taskId: string | null) => void;
  toggleSidebar: () => void;
  setShowShortcutsHelp: (show: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isTaskFormOpen: false,
      editingTask: null,
      isSidebarCollapsed: false,
      showShortcutsHelp: false,
      
      openTaskForm: () => set({ isTaskFormOpen: true }),
      closeTaskForm: () => set({ isTaskFormOpen: false, editingTask: null }),
      setEditingTask: (taskId) => set({ editingTask: taskId, isTaskFormOpen: true }),
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      setShowShortcutsHelp: (show) => set({ showShortcutsHelp: show }),
    }),
    {
      name: 'todo-ui-storage',
      partialize: (state) => ({ isSidebarCollapsed: state.isSidebarCollapsed }),
    }
  )
);
```

#### 5.1.3 废纸篓状态 Store

```typescript
// src/store/trashStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, TrashTask } from '../types';

interface TrashState {
  trashItems: TrashTask[];
  selectedIds: string[];
  
  // Actions
  moveToTrash: (task: Task) => void;
  restoreTask: (ids: string[]) => void;
  permanentDelete: (ids: string[]) => void;
  clearTrash: () => void;
  selectItem: (id: string) => void;
  deselectItem: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
}

export const useTrashStore = create<TrashState>()(
  persist(
    (set, get) => ({
      trashItems: [],
      selectedIds: [],
      
      moveToTrash: (task) => set((state) => ({
        trashItems: [...state.trashItems, { 
          task, 
          deletedAt: Date.now() 
        }]
      })),
      
      restoreTask: (ids) => set((state) => {
        const tasksToRestore = state.trashItems
          .filter(item => ids.includes(item.task.id))
          .map(item => item.task);
        return {
          trashItems: state.trashItems.filter(item => !ids.includes(item.task.id)),
          selectedIds: [],
        };
      }),
      
      permanentDelete: (ids) => set((state) => ({
        trashItems: state.trashItems.filter(item => !ids.includes(item.task.id)),
        selectedIds: [],
      })),
      
      clearTrash: () => set({ trashItems: [], selectedIds: [] }),
      
      selectItem: (id) => set((state) => ({
        selectedIds: [...state.selectedIds, id]
      })),
      
      deselectItem: (id) => set((state) => ({
        selectedIds: state.selectedIds.filter(itemId => itemId !== id)
      })),
      
      selectAll: () => set((state) => ({
        selectedIds: state.trashItems.map(item => item.task.id)
      })),
      
      deselectAll: () => set({ selectedIds: [] }),
    }),
    {
      name: 'todo-trash-storage',
      partialize: (state) => ({ trashItems: state.trashItems }),
    }
  )
);
```

### 5.2 撤销操作实现

```typescript
// src/hooks/useUndo.ts

import { create } from 'zustand';
import type { Task } from '../types';

interface Action {
  type: 'DELETE' | 'TOGGLE' | 'UPDATE';
  tasks: Task[];
  previousState: Task[];
}

interface UndoState {
  undoStack: Action[];
  redoStack: Action[];
  
  pushAction: (action: Action) => void;
  undo: () => Action | null;
  redo: () => Action | null;
  clear: () => void;
}

export const useUndoStore = create<UndoState>((set) => ({
  undoStack: [],
  redoStack: [],
  
  pushAction: (action) => set((state) => ({
    undoStack: [...state.undoStack.slice(-19), action], // 限制20步
    redoStack: [],
  })),
  
  undo: () => set((state) => {
    if (state.undoStack.length === 0) return null;
    const action = state.undoStack[state.undoStack.length - 1];
    set({
      undoStack: state.undoStack.slice(0, -1),
      redoStack: [...state.redoStack, action],
    });
    return action;
  }),
  
  redo: () => set((state) => {
    if (state.redoStack.length === 0) return null;
    const action = state.redoStack[state.redoStack.length - 1];
    set({
      redoStack: state.redoStack.slice(0, -1),
      undoStack: [...state.undoStack, action],
    });
    return action;
  }),
  
  clear: () => set({ undoStack: [], redoStack: [] }),
}));
```

**溯源**：PRD-v0.3.md 2.2.5 撤销操作

---

## 六、样式架构设计

### 6.1 Tailwind CSS 配置

```javascript
// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}
```

### 6.2 组件样式方案

#### 6.2.1 使用 @layer components

```css
/* src/styles/components.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .task-item {
    @apply flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg;
    @apply transition-all duration-200;
    @apply hover:border-gray-300 hover:shadow-sm;
  }

  .task-item--selected {
    @apply border-blue-500 bg-blue-50;
    @apply ring-2 ring-blue-100;
  }

  .task-item--completed .task-item__title {
    @apply text-gray-400 line-through;
  }

  .batch-toolbar {
    @apply fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg;
  }

  .sidebar-item {
    @apply flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg;
    @apply hover:bg-gray-100 transition-colors;
  }

  .sidebar-item--active {
    @apply bg-blue-50 text-blue-600 font-medium;
  }
}
```

#### 6.2.2 Ant Design 样式覆盖

```css
/* 自定义 Ant Design 主题覆盖 */

.ant-modal .ant-modal-content {
  @apply rounded-xl overflow-hidden;
}

.ant-modal .ant-modal-header {
  @apply border-b border-gray-200;
}

.ant-btn-primary {
  @apply bg-blue-500 border-blue-500;
}

.ant-btn-primary:hover {
  @apply bg-blue-600 border-blue-600;
}

.ant-checkbox-checked .ant-checkbox-inner {
  @apply bg-blue-500 border-blue-500;
}
```

### 6.3 响应式设计

```css
/* 响应式断点 */

/* 桌面端 > 1024px */
@media (min-width: 1024px) {
  .layout {
    @apply grid grid-cols-[240px_1fr];
  }
}

/* 平板端 640px - 1024px */
@media (max-width: 1024px) {
  .layout {
    @apply grid grid-cols-[64px_1fr];
  }
  
  .sidebar {
    @apply items-center justify-center;
  }
}

/* 移动端 < 640px */
@media (max-width: 640px) {
  .layout {
    @apply flex flex-col;
  }
  
  .sidebar {
    @apply flex-row w-full overflow-x-auto;
  }
  
  .batch-toolbar {
    @apply flex-col gap-2 py-4;
  }
}
```

**溯源**：UI-Design-v0.3.md 2.4 Tailwind 样式方案

---

## 七、新功能架构设计

### 7.1 废纸篓功能

#### 7.1.1 数据模型

```typescript
// src/types/index.ts

interface TrashTask {
  task: Task;
  deletedAt: number;  // 删除时间戳
  originalListName?: string;  // 原清单名称（预留）
}
```

#### 7.1.2 页面结构

```tsx
// src/components/trash/TrashPage.tsx

import { List, Button, Checkbox, Popconfirm, Card, Tag, Empty } from 'antd';
import { RollbackOutlined, DeleteOutlined } from '@ant-design/icons';

interface TrashPageProps {
  trashItems: TrashTask[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onRestore: (ids: string[]) => void;
  onPermanentDelete: (ids: string[]) => void;
  onClearAll: () => void;
}
```

**溯源**：UI-Design-v0.3.md 4. 废纸篓功能 UI

#### 7.1.3 自动清除逻辑

```typescript
// 30 天后自动清除
const AUTO_CLEAR_DAYS = 30;

const getDaysUntilExpiry = (deletedAt: number): number => {
  const daysPassed = Math.floor((Date.now() - deletedAt) / (1000 * 60 * 60 * 24));
  return AUTO_CLEAR_DAYS - daysPassed;
};

// 在应用启动时检查并清理过期任务
const cleanupExpiredTrash = () => {
  const { trashItems } = useTrashStore.getState();
  const expiredIds = trashItems
    .filter(item => getDaysUntilExpiry(item.deletedAt) <= 0)
    .map(item => item.task.id);
  
  if (expiredIds.length > 0) {
    useTrashStore.getState().permanentDelete(expiredIds);
  }
};
```

### 7.2 数据导入导出功能

#### 7.2.1 导出功能

```typescript
// src/utils/importExport.ts

interface ExportData {
  version: string;
  exportedAt: number;
  tasks: Task[];
}

const exportToJSON = (tasks: Task[]): void => {
  const data: ExportData = {
    version: 'v0.3',
    exportedAt: Date.now(),
    tasks,
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { 
    type: 'application/json' 
  });
  downloadBlob(blob, `todo-list-${formatDate(Date.now())}.json`);
};

const exportToCSV = (tasks: Task[]): void => {
  const headers = ['标题', '描述', '完成状态', '优先级', '标签', '截止日期', '创建时间'];
  const rows = tasks.map(task => [
    task.title,
    task.description,
    task.completed ? '已完成' : '未完成',
    task.priority,
    task.tags.join(';'),
    task.dueDate ? formatDate(task.dueDate) : '',
    formatDate(task.createdAt),
  ]);
  
  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
  
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
  downloadBlob(blob, `todo-list-${formatDate(Date.now())}.csv`);
};
```

#### 7.2.2 导入功能

```typescript
const importFromJSON = async (file: File): Promise<Task[]> => {
  const text = await file.text();
  const data = JSON.parse(text);
  
  if (!data.tasks || !Array.isArray(data.tasks)) {
    throw new Error('无效的 JSON 文件格式');
  }
  
  // 验证并规范化任务数据
  return data.tasks.map((task: Partial<Task>) => ({
    id: task.id || generateId(),
    title: task.title || '未命名任务',
    description: task.description || '',
    completed: false,
    priority: task.priority || 'medium',
    tags: task.tags || [],
    dueDate: task.dueDate || null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }));
};

const importFromCSV = async (file: File): Promise<Task[]> => {
  const text = await file.text();
  const lines = text.split('\n').slice(1); // 跳过表头
  
  return lines
    .filter(line => line.trim())
    .map(line => {
      const [title, description, , priority, tags, dueDate] = parseCSVLine(line);
      return {
        id: generateId(),
        title: title || '未命名任务',
        description: description || '',
        completed: false,
        priority: priority as Task['priority'] || 'medium',
        tags: tags ? tags.split(';') : [],
        dueDate: dueDate ? new Date(dueDate).getTime() : null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    });
};
```

**溯源**：PRD-v0.3.md 2.2.6 数据导入导出

---

## 八、快捷键支持

### 8.1 快捷键映射表

| 快捷键 | 功能 | 实现位置 |
|--------|------|----------|
| `Ctrl+N` / `Cmd+N` | 新建任务 | Header / useKeyboardShortcuts |
| `Ctrl+Z` | 撤销操作 | useUndo |
| `Ctrl+Shift+Z` | 重做操作 | useUndo |
| `Ctrl+F` | 聚焦搜索框 | Header / useKeyboardShortcuts |
| `Ctrl+A` | 全选任务 | TaskList / useKeyboardShortcuts |
| `Delete` | 删除选中任务 | BatchToolbar / useKeyboardShortcuts |
| `Space` | 标记完成/未完成 | TaskItem / useKeyboardShortcuts |
| `?` | 显示快捷键帮助 | useKeyboardShortcuts |
| `Esc` | 关闭模态框 | Modal / useKeyboardShortcuts |

### 8.2 快捷键 Hook 集成

```typescript
// src/hooks/useKeyboardShortcuts.ts

import { useEffect, useCallback } from 'react';
import { useUIStore } from '../store/uiStore';
import { useTaskStore } from '../store/taskStore';
import { useUndoStore } from '../store/undoStore';

export const useKeyboardShortcuts = () => {
  const { openTaskForm, setShowShortcutsHelp } = useUIStore();
  const { selectAllTasks, deselectAllTasks, deleteSelectedTasks, toggleSelectedTasks } = useTaskStore();
  const { undo, redo } = useUndoStore();
  
  const shortcuts = [
    { key: 'n', ctrl: true, handler: openTaskForm, description: '新建任务' },
    { key: 'z', ctrl: true, handler: undo, description: '撤销' },
    { key: 'z', ctrl: true, shift: true, handler: redo, description: '重做' },
    { key: 'f', ctrl: true, handler: () => document.getElementById('search-input')?.focus(), description: '聚焦搜索' },
    { key: 'a', ctrl: true, handler: selectAllTasks, description: '全选' },
    { key: 'Delete', handler: deleteSelectedTasks, description: '删除选中' },
    { key: ' ', handler: toggleSelectedTasks, description: '标记完成' },
    { key: '?', handler: () => setShowShortcutsHelp(true), description: '显示帮助' },
  ];
  
  // ... 实现逻辑复用 v0.2 架构
};
```

---

## 九、数据持久化设计

### 9.1 存储键名

| 键名 | 数据类型 | 说明 |
|------|----------|------|
| `todo-task-storage` | `Task[]` | 任务列表 |
| `todo-ui-storage` | `UIState` | UI 状态 |
| `todo-trash-storage` | `TrashTask[]` | 废纸篓 |
| `todo-undo-storage` | `Action[]` | 撤销栈 |

### 9.2 Zustand 持久化配置

```typescript
import { persist, createJSONStorage } from 'zustand/middleware';
import { localStorageAdapter } from 'zustand/middleware/adapters';

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({ /* ... */ }),
    {
      name: 'todo-task-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
);
```

---

## 十、组件测试定位规范

### 10.1 data-testid 规范（延续 v0.2）

基于 `docs/element-location-guidelines.md`，v0.3 继续沿用 `data-testid` 定位规范。

### 10.2 Ant Design 组件定位

| 元素 | 定位方式 | 示例 |
|------|----------|------|
| Ant Design Button | `data-testid` 或 `aria-label` | `[data-testid="add-task-button"]` |
| Ant Design Modal | `data-testid` | `[data-testid="task-form-modal"]` |
| Ant Design Checkbox | `data-testid` | `[data-testid="task-item-{id}-select"]` |
| Ant Design List | `data-testid` | `[data-testid="trash-list"]` |

---

## 十一、开发计划

### 11.1 阶段规划

| 阶段 | 时间 | 任务 |
|------|------|------|
| **准备阶段** | 2026-03-10 | 技术选型、架构设计、环境搭建 |
| **核心功能开发** | 2026-03-11 ~ 2026-03-14 | 批量操作UI优化、模态框统一、样式系统优化 |
| **增强功能开发** | 2026-03-15 ~ 2026-03-17 | 废纸篓功能、撤销操作、数据导入导出 |
| **测试与修复** | 2026-03-18 ~ 2026-03-19 | 功能测试、性能测试、Bug修复 |
| **发布** | 2026-03-20 | 构建、部署、发布 |

### 11.2 关键里程碑

1. **M1**：Tailwind CSS 集成完成
2. **M2**：Ant Design 组件集成完成
3. **M3**：Zustand 状态管理迁移完成
4. **M4**：废纸篓功能上线
5. **M5**：撤销操作上线
6. **M6**：数据导入导出上线

---

## 十二、风险评估与应对

| 风险项 | 风险等级 | 可能性 | 应对措施 | 溯源 |
|--------|----------|--------|----------|------|
| Tailwind CSS 迁移影响进度 | 中 | 中 | 分阶段迁移，保持现有功能可用 | PRD-v0.3 8.1 |
| Ant Design 与现有组件兼容性问题 | 中 | 中 | 封装统一组件，确保兼容性 | PRD-v0.3 8.1 |
| Zustand 学习曲线 | 低 | 低 | 提供示例和文档 | 架构设计 |
| 样式系统变更影响测试 | 中 | 中 | 遵循元素定位规范 | 文档设计 |
| 数据迁移问题 | 低 | 中 | 编写数据迁移脚本 | PRD-v0.3 8.2 |

---

## 十三、相关文档索引

| 文档 | 路径 | 说明 |
|------|------|------|
| PRD | `docs/PRD/PRD-v0.3.md` | 产品需求文档 |
| UI 设计 | `docs/design/UI-Design-v0.3.md` | UI 设计规范 |
| 元素定位规范 | `docs/element-location-guidelines.md` | 测试元素定位规范 |
| 基础架构 | `docs/architecture/frontend-architecture.md` | v0.1/v0.2 架构设计 |
| v0.2 批量操作架构 | `agent_work/frontend-architecture-v0.2-batch-shortcut.md` | v0.2 批量操作架构 |

---

**文档结束**

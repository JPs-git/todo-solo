# Todo-List v0.3 UI 设计文档

## 文档信息

| 项目     | 内容                      |
| -------- | ------------------------- |
| 产品名称 | Todo-List                 |
| 文档版本 | v0.3                      |
| 创建日期 | 2026-03-09                |
| 技术栈   | Ant Design + Tailwind CSS |
| 设计状态 | 已完成                    |

---

## 一、设计概述

### 1.1 设计目标

v0.3 版本 UI 设计目标：

- **技术栈升级**：采用 Ant Design 组件库和 Tailwind CSS 样式系统
- **交互一致性**：统一所有模态框和交互组件
- **功能完整性**：补充废纸篓、撤销操作等核心功能
- **视觉现代化**：优化整体视觉体验

### 1.2 技术栈说明

| 技术         | 版本 | 用途      |
| ------------ | ---- | --------- |
| Ant Design   | 5.x  | UI 组件库 |
| Tailwind CSS | 4.x  | 样式系统  |
| React        | 18.x | 前端框架  |
| TypeScript   | 5.x  | 类型系统  |

### 1.3 设计原则

1. **组件优先**：优先使用 Ant Design 组件，减少自定义组件
2. **Tailwind 为主**：使用 Tailwind 工具类组合样式，保持一致性
3. **渐进增强**：基础功能使用 Ant Design，高级定制使用 Tailwind
4. **主题驱动**：支持统一的设计系统

---

## 二、批量操作 UI 优化

### 2.1 设计目标

将批量操作功能从任务项中独立出来，避免与完成状态复选框混淆，提供更清晰的批量操作体验。

### 2.2 交互流程

```
┌─────────────────────────────────────────────────────────────┐
│ [搜索框]                        [新建] [批量操作] [⚙️]     │  ← 顶部工具栏
├─────────────────────────────────────────────────────────────┤
│ [筛选 ▼] [排序 ▼] [标签 ▼]                                  │  ← 筛选栏
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ☐ │ ○ │ 🔴 完成项目报告                    [✏️] [🗑️]│ │
│ │       │    截止：2026-03-15  标签：工作, 重要          │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ☐ = 选择框（批量操作模式）  ○ = 完成状态复选框              │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Ant Design 组件方案

**使用组件**：

- `Checkbox` - 任务选择框（批量操作）
- `Checkbox` - 任务完成状态
- `Button` - 批量操作按钮
- `Popconfirm` - 删除确认

**任务卡片实现**：

```tsx
import { Checkbox, Button, Popconfirm, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

interface TaskItemProps {
  task: Task;
  isBatchMode: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  isBatchMode,
  isSelected,
  onSelect,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  return (
    <div className={`task-item ${isSelected ? "task-item--selected" : ""}`}>
      {/* 批量选择框 - 仅在批量模式显示 */}
      <Checkbox
        className="task-item__select-checkbox"
        checked={isSelected}
        onChange={() => onSelect(task.id)}
        style={{ display: isBatchMode ? "flex" : "none" }}
      />

      {/* 完成状态复选框 - 始终显示 */}
      <Checkbox
        className="task-item__complete-checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id)}
      />

      {/* 任务内容 */}
      <div className="task-item__content">
        <div className="task-item__header">
          <span
            className={`task-item__title ${
              task.completed ? "task-item__title--completed" : ""
            }`}
          >
            {task.title}
          </span>
          <Tag color={getPriorityColor(task.priority)}>
            {getPriorityLabel(task.priority)}
          </Tag>
        </div>

        {task.dueDate && (
          <div className="task-item__due-date">
            截止：{formatDate(task.dueDate)}
          </div>
        )}

        {task.tags.length > 0 && (
          <div className="task-item__tags">
            {task.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="task-item__actions">
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => onEdit(task)}
        />
        <Popconfirm
          title="确认删除"
          description="确定要删除这个任务吗？"
          onConfirm={() => onDelete(task.id)}
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </div>
    </div>
  );
};
```

### 2.4 Tailwind 样式方案

```css
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

  .task-item__select-checkbox {
    @apply flex-shrink-0;
  }

  .task-item__complete-checkbox {
    @apply flex-shrink-0;
  }

  .task-item__content {
    @apply flex-1 min-w-0;
  }

  .task-item__header {
    @apply flex items-center gap-2 mb-1;
  }

  .task-item__title {
    @apply text-base text-gray-900 font-normal;
    @apply truncate flex-1;
  }

  .task-item__title--completed {
    @apply text-gray-400 line-through;
  }

  .task-item__due-date {
    @apply text-xs text-gray-500 mb-1;
  }

  .task-item__tags {
    @apply flex flex-wrap gap-1;
  }

  .task-item__actions {
    @apply flex gap-1 opacity-0 transition-opacity;
    @apply group-hover:opacity-100;
  }
}
```

### 2.5 批量操作工具栏

**Ant Design 组件**：

- `Space` - 按钮间距
- `Button` - 操作按钮
- `Badge` - 选中数量徽章
- `Dropdown` - 更多操作

**实现方案**：

```tsx
import { Space, Button, Badge, Dropdown, Tooltip } from "antd";
import {
  SelectOutlined,
  CheckOutlined,
  DeleteOutlined,
  MoreOutlined,
} from "@ant-design/icons";

interface BatchToolbarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBatchComplete: () => void;
  onBatchIncomplete: () => void;
  onBatchDelete: () => void;
}

const BatchToolbar: React.FC<BatchToolbarProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onBatchComplete,
  onBatchIncomplete,
  onBatchDelete,
}) => {
  if (selectedCount === 0) return null;

  const moreMenuItems = [
    {
      key: "incomplete",
      label: "标记为未完成",
      icon: <CheckOutlined />,
      onClick: onBatchIncomplete,
    },
    { type: "divider" },
    {
      key: "delete",
      label: "批量删除",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: onBatchDelete,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Space>
            <Badge count={selectedCount} showZero color="blue" />
            <span className="text-gray-600">已选择 {selectedCount} 个任务</span>
          </Space>

          <Space>
            <Button onClick={onSelectAll}>全选 ({totalCount})</Button>
            <Button onClick={onDeselectAll}>取消全选</Button>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={onBatchComplete}
            >
              标记完成
            </Button>
            <Dropdown menu={{ items: moreMenuItems }} trigger={["click"]}>
              <Button icon={<MoreOutlined />} />
            </Dropdown>
          </Space>
        </div>
      </div>
    </div>
  );
};
```

---

## 三、模态框统一方案

### 3.1 设计目标

使用 Ant Design Modal 组件统一所有弹窗，确保一致的样式和交互体验。

### 3.2 模态框类型

| 场景         | 组件               | 尺寸  | 特殊配置 |
| ------------ | ------------------ | ----- | -------- |
| 新建任务     | Modal              | 520px | 表单布局 |
| 编辑任务     | Modal              | 520px | 表单布局 |
| 删除确认     | Popconfirm / Modal | 400px | 简洁内容 |
| 批量删除确认 | Modal              | 400px | 显示数量 |

### 3.3 统一 Modal 封装

```tsx
import { Modal, ModalProps } from "antd";

interface UnifiedModalProps extends ModalProps {
  children: React.ReactNode;
}

export const UnifiedModal: React.FC<UnifiedModalProps> = ({
  children,
  ...modalProps
}) => {
  return (
    <Modal centered maskClosable={false} footer={null} {...modalProps}>
      {children}
    </Modal>
  );
};
```

### 3.4 任务表单 Modal

```tsx
import { Modal, Form, Input, Select, DatePicker, InputNumber, Tag } from "antd";
import dayjs from "dayjs";

interface TaskFormModalProps {
  open: boolean;
  task?: Task | null;
  onSubmit: (values: TaskFormValues) => void;
  onCancel: () => void;
}

interface TaskFormValues {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate?: dayjs.Dayjs;
  tags: string[];
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({
  open,
  task,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm<TaskFormValues>();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title={task ? "编辑任务" : "新建任务"}
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText={task ? "保存" : "创建"}
      cancelText="取消"
      width={520}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={
          task
            ? {
                ...task,
                dueDate: task.dueDate ? dayjs(task.dueDate) : undefined,
              }
            : {
                priority: "medium",
                tags: [],
              }
        }
      >
        <Form.Item
          name="title"
          label="任务标题"
          rules={[{ required: true, message: "请输入任务标题" }]}
        >
          <Input placeholder="请输入任务标题" />
        </Form.Item>

        <Form.Item name="description" label="任务描述">
          <Input.TextArea placeholder="请输入任务描述（可选）" rows={3} />
        </Form.Item>

        <Form.Item name="priority" label="优先级">
          <Select>
            <Select.Option value="high">
              <Tag color="red">高</Tag> 高优先级
            </Select.Option>
            <Select.Option value="medium">
              <Tag color="orange">中</Tag> 中优先级
            </Select.Option>
            <Select.Option value="low">
              <Tag color="green">低</Tag> 低优先级
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="dueDate" label="截止日期">
          <DatePicker style={{ width: "100%" }} placeholder="选择截止日期" />
        </Form.Item>

        <Form.Item name="tags" label="标签">
          <Select
            mode="tags"
            placeholder="输入标签后按回车"
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
```

---

## 四、废纸篓功能 UI

### 4.1 页面结构

```
┌─────────────────────────────────────────────────────────────┐
│  Todo-List                              [搜索] [+新建]   │
├────────────┬────────────────────────────────────────────────┤
│            │                                                │
│  📋 我的任务 │  废纸篓                                       │
│            │  ┌──────────────────────────────────────────┐ │
│  🏠 首页    │  │  已删除的任务将在 30 天后自动清除        │ │
│            │  └──────────────────────────────────────────┘ │
│  ⭐ 收藏    │                                                │
│            │  ┌──────────────────────────────────────────┐ │
│  📅 日历   │  │ ☐  完成项目报告              2026-03-09 │ │
│            │  │    原始清单：工作            [恢复] [删除]│ │
│  🗑️ 废纸篓 │  └──────────────────────────────────────────┘ │
│            │                                                │
│            │  ┌──────────────────────────────────────────┐ │
│  ⚙️ 设置   │  │ ☐  购买办公用品              2026-03-08 │ │
│            │  │    原始清单：生活            [恢复] [删除]│ │
│            │  └──────────────────────────────────────────┘ │
│            │                                                │
│            │  ───────────────────────────────────────────  │
│            │  [全选] [恢复选中] [清空废纸篓]               │
└────────────┴────────────────────────────────────────────────┘
```

### 4.2 Ant Design 组件方案

```tsx
import {
  List,
  Button,
  Checkbox,
  Popconfirm,
  Empty,
  Card,
  Tag,
  Tooltip,
  Space,
} from "antd";
import {
  DeleteOutlined,
  RollbackOutlined,
  DeleteFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

interface TrashItem {
  task: Task;
  deletedAt: number;
  originalListName?: string;
}

interface TrashPageProps {
  trashItems: TrashItem[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onRestore: (ids: string[]) => void;
  onPermanentDelete: (ids: string[]) => void;
  onClearAll: () => void;
}

const TrashPage: React.FC<TrashPageProps> = ({
  trashItems,
  selectedIds,
  onSelect,
  onSelectAll,
  onRestore,
  onPermanentDelete,
  onClearAll,
}) => {
  const getDaysUntilExpiry = (deletedAt: number) => {
    const daysPassed = dayjs().diff(dayjs(deletedAt), "day");
    return 30 - daysPassed;
  };

  return (
    <div className="trash-page">
      <Card className="mb-4 bg-amber-50 border-amber-200">
        <div className="flex items-center gap-2 text-amber-700">
          <ExclamationCircleOutlined />
          <span>已删除的任务将在 30 天后自动清除</span>
        </div>
      </Card>

      {trashItems.length === 0 ? (
        <Empty
          description="废纸篓是空的"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <Checkbox
              checked={selectedIds.length === trashItems.length}
              indeterminate={
                selectedIds.length > 0 && selectedIds.length < trashItems.length
              }
              onChange={onSelectAll}
            >
              全选
            </Checkbox>

            <Space>
              <Button
                disabled={selectedIds.length === 0}
                icon={<RollbackOutlined />}
                onClick={() => onRestore(selectedIds)}
              >
                恢复选中
              </Button>
              <Popconfirm
                title="清空废纸篓"
                description="确定要清空废纸篓吗？此操作不可恢复。"
                onConfirm={onClearAll}
                okText="确定"
                cancelText="取消"
                okButtonProps={{ danger: true }}
              >
                <Button danger icon={<DeleteFilled />}>
                  清空废纸篓
                </Button>
              </Popconfirm>
            </Space>
          </div>

          <List
            dataSource={trashItems}
            renderItem={(item) => {
              const daysLeft = getDaysUntilExpiry(item.deletedAt);
              return (
                <List.Item
                  className={`trash-item ${
                    selectedIds.includes(item.task.id)
                      ? "trash-item--selected"
                      : ""
                  }`}
                  actions={[
                    <Button
                      key="restore"
                      type="link"
                      icon={<RollbackOutlined />}
                      onClick={() => onRestore([item.task.id])}
                    >
                      恢复
                    </Button>,
                    <Popconfirm
                      key="delete"
                      title="永久删除"
                      description="确定要永久删除这个任务吗？此操作不可恢复。"
                      onConfirm={() => onPermanentDelete([item.task.id])}
                      okText="永久删除"
                      cancelText="取消"
                      okButtonProps={{ danger: true }}
                    >
                      <Button type="link" danger icon={<DeleteOutlined />}>
                        删除
                      </Button>
                    </Popconfirm>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Checkbox
                        checked={selectedIds.includes(item.task.id)}
                        onChange={() => onSelect(item.task.id)}
                      />
                    }
                    title={
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            item.task.completed
                              ? "line-through text-gray-400"
                              : ""
                          }
                        >
                          {item.task.title}
                        </span>
                        <Tag color={daysLeft <= 7 ? "red" : "default"}>
                          {daysLeft} 天后清除
                        </Tag>
                      </div>
                    }
                    description={
                      <Space>
                        <span className="text-gray-500">
                          删除于：
                          {dayjs(item.deletedAt).format("YYYY-MM-DD HH:mm")}
                        </span>
                        {item.originalListName && (
                          <Tag>原始清单：{item.originalListName}</Tag>
                        )}
                      </Space>
                    }
                  />
                </List.Item>
              );
            }}
          />
        </>
      )}
    </div>
  );
};
```

### 4.3 Tailwind 样式

```css
@layer components {
  .trash-item {
    @apply bg-white border border-gray-200 rounded-lg p-4;
    @apply transition-all duration-200;
  }

  .trash-item:hover {
    @apply bg-gray-50;
  }

  .trash-item--selected {
    @apply bg-blue-50 border-blue-300;
  }
}
```

---

## 五、撤销操作 UI

### 5.1 设计方案

**触发方式**：

- 快捷键：Ctrl+Z
- 顶部工具栏撤销按钮
- 操作成功后 toast 提示中的撤销链接

**UI 组件**：

- `message.success` - 显示撤销提示
- `Button` - 工具栏撤销按钮
- 自定义 Hook 处理撤销逻辑

### 5.2 实现方案

```tsx
import { message, Button, Tooltip } from "antd";
import { UndoOutlined } from "@ant-design/icons";

interface UndoService {
  canUndo: boolean;
  undo: () => void;
  addToHistory: (action: UndoableAction) => void;
}

interface UndoableAction {
  type: "delete" | "complete" | "incomplete" | "update";
  previousState: Task | Task[];
  currentState: Task | Task[];
  description: string;
  timestamp: number;
}

const UndoButton: React.FC<{ undoService: UndoService }> = ({
  undoService,
}) => {
  return (
    <Tooltip title="撤销 (Ctrl+Z)">
      <Button
        icon={<UndoOutlined />}
        onClick={undoService.undo}
        disabled={!undoService.canUndo}
      >
        撤销
      </Button>
    </Tooltip>
  );
};

// 使用示例：在操作后显示撤销提示
const handleDelete = (taskId: string) => {
  // 执行删除
  deleteTask(taskId);

  // 添加到撤销历史
  undoService.addToHistory({
    type: "delete",
    previousState: deletedTask,
    currentState: null,
    description: "删除任务",
    timestamp: Date.now(),
  });

  // 显示撤销提示
  message.success({
    content: (
      <span>
        任务已删除
        <Button type="link" size="small" onClick={undoService.undo}>
          撤销
        </Button>
      </span>
    ),
    duration: 5,
  });
};
```

---

## 六、数据导入导出 UI

### 6.1 导出功能

```tsx
import { Modal, Button, Radio, Space, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  tasks: Task[];
}

type ExportFormat = "json" | "csv";

const ExportModal: React.FC<ExportModalProps> = ({ open, onClose, tasks }) => {
  const [format, setFormat] = useState<ExportFormat>("json");
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);

    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      if (format === "json") {
        content = JSON.stringify(tasks, null, 2);
        filename = `todo-list-${dayjs().format("YYYY-MM-DD")}.json`;
        mimeType = "application/json";
      } else {
        // CSV 格式
        const headers = [
          "标题",
          "描述",
          "完成状态",
          "优先级",
          "标签",
          "截止日期",
          "创建时间",
        ];
        const rows = tasks.map((task) => [
          task.title,
          task.description,
          task.completed ? "已完成" : "未完成",
          task.priority,
          task.tags.join(";"),
          task.dueDate ? dayjs(task.dueDate).format("YYYY-MM-DD") : "",
          dayjs(task.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        ]);

        content = [
          headers.join(","),
          ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
        ].join("\n");

        filename = `todo-list-${dayjs().format("YYYY-MM-DD")}.csv`;
        mimeType = "text/csv";
      }

      // 下载文件
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      message.success(`已导出 ${tasks.length} 个任务`);
      onClose();
    } catch (error) {
      message.error("导出失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="导出数据"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button
          key="export"
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleExport}
          loading={loading}
        >
          导出
        </Button>,
      ]}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            选择导出格式
          </label>
          <Radio.Group
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full"
          >
            <Space direction="vertical" className="w-full">
              <Radio value="json" className="w-full">
                <div className="ml-2">
                  <div className="font-medium">JSON</div>
                  <div className="text-xs text-gray-500">
                    完整导出，可用于备份和迁移
                  </div>
                </div>
              </Radio>
              <Radio value="csv" className="w-full">
                <div className="ml-2">
                  <div className="font-medium">CSV</div>
                  <div className="text-xs text-gray-500">
                    通用格式，可在 Excel 中打开
                  </div>
                </div>
              </Radio>
            </Space>
          </Radio.Group>
        </div>

        <div className="text-sm text-gray-500">
          共导出 <span className="font-medium">{tasks.length}</span> 个任务
        </div>
      </div>
    </Modal>
  );
};
```

### 6.2 导入功能

```tsx
import { Modal, Button, Upload, message, Steps, Table } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

interface ImportModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (tasks: Partial<Task>[]) => void;
}

interface PreviewTask {
  title: string;
  description: string;
  priority: string;
  dueDate?: string;
  tags: string[];
  valid: boolean;
  error?: string;
}

const ImportModal: React.FC<ImportModalProps> = ({
  open,
  onClose,
  onImport,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [previewData, setPreviewData] = useState<PreviewTask[]>([]);
  const [importing, setImporting] = useState(false);

  const handleFileUpload = async (file: File) => {
    const text = await file.text();

    try {
      let parsed: Partial<Task>[];

      if (file.name.endsWith(".json")) {
        parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) {
          throw new Error("JSON 格式错误");
        }
      } else if (file.name.endsWith(".csv")) {
        parsed = parseCSV(text);
      } else {
        message.error("不支持的文件格式");
        return false;
      }

      // 验证和预览
      const preview = parsed.map((task, index) => ({
        ...task,
        valid: !!task.title,
        error: !task.title ? "缺少标题" : undefined,
      })) as PreviewTask[];

      setPreviewData(preview);
      setCurrentStep(1);
    } catch (error) {
      message.error("文件解析失败");
    }

    return false;
  };

  const handleImport = async () => {
    const validTasks = previewData
      .filter((t) => t.valid)
      .map((t) => ({
        title: t.title,
        description: t.description || "",
        priority: (t.priority as "low" | "medium" | "high") || "medium",
        tags: t.tags || [],
        dueDate: t.dueDate ? new Date(t.dueDate).getTime() : null,
      }));

    setImporting(true);
    onImport(validTasks);
    message.success(`成功导入 ${validTasks.length} 个任务`);
    setImporting(false);
    onClose();
    setCurrentStep(0);
    setPreviewData([]);
  };

  const steps = [
    {
      title: "上传文件",
      content: (
        <Dragger
          accept=".json,.csv"
          beforeUpload={handleFileUpload}
          showUploadList={false}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">支持 JSON 和 CSV 格式</p>
        </Dragger>
      ),
    },
    {
      title: "预览确认",
      content: (
        <div>
          <Table
            dataSource={previewData}
            columns={[
              { title: "标题", dataIndex: "title" },
              { title: "优先级", dataIndex: "priority" },
              {
                title: "状态",
                dataIndex: "valid",
                render: (valid: boolean) =>
                  valid ? (
                    <Tag color="green">有效</Tag>
                  ) : (
                    <Tag color="red">无效</Tag>
                  ),
              },
            ]}
            pagination={false}
            size="small"
          />
          <div className="mt-4 text-sm text-gray-500">
            有效任务：{previewData.filter((t) => t.valid).length} /{" "}
            {previewData.length}
          </div>
        </div>
      ),
    },
  ];

  return (
    <Modal
      title="导入数据"
      open={open}
      onCancel={onClose}
      width={600}
      footer={
        currentStep === 0 ? (
          <Button onClick={onClose}>取消</Button>
        ) : (
          <>
            <Button onClick={() => setCurrentStep(0)}>上一步</Button>
            <Button
              type="primary"
              onClick={handleImport}
              loading={importing}
              disabled={previewData.filter((t) => t.valid).length === 0}
            >
              导入
            </Button>
          </>
        )
      }
    >
      <Steps current={currentStep} className="mb-6">
        {steps.map((item) => (
          <Steps.Step key={item.title} title={item.title} />
        ))}
      </Steps>

      {steps[currentStep].content}
    </Modal>
  );
};
```

---

## 七、整体布局方案

### 7.1 主页面布局

```tsx
import { Layout, ConfigProvider, theme } from "antd";
import { Outlet } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const AppLayout: React.FC = () => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  return (
    <ConfigProvider
      theme={{
        algorithm:
          themeMode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#3b82f6",
        },
      }}
    >
      <Layout className="min-h-screen">
        <Header className="bg-white border-b border-gray-200 px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Todo-List</h1>
          </div>
          <div className="flex items-center gap-2">
            <SearchBar />
            <Button type="primary" icon={<PlusOutlined />}>
              新建任务
            </Button>
            <ThemeSwitch mode={themeMode} onChange={setThemeMode} />
          </div>
        </Header>

        <Layout>
          <Sider width={240} className="bg-gray-50 border-r border-gray-200">
            <ListSidebar />
          </Sider>

          <Content className="bg-gray-100 p-4">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
```

### 7.2 响应式断点

| 断点 | 宽度           | 布局                 |
| ---- | -------------- | -------------------- |
| xs   | < 576px        | 隐藏侧边栏，底部导航 |
| sm   | 576px - 768px  | 隐藏侧边栏，汉堡菜单 |
| md   | 768px - 992px  | 折叠侧边栏           |
| lg   | 992px - 1200px | 完整布局             |
| xl   | > 1200px       | 完整布局，更宽内容区 |

---

## 八、组件库配置

### 8.1 Ant Design ConfigProvider

```tsx
import { ConfigProvider } from "antd";
import type { ThemeConfig } from "antd/es/config-provider/context";

const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: "#3b82f6",
    borderRadius: 8,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Button: {
      controlHeight: 36,
      paddingContentHorizontal: 16,
    },
    Input: {
      controlHeight: 40,
    },
    Select: {
      controlHeight: 40,
    },
    Card: {
      borderRadiusLG: 12,
    },
    Modal: {
      borderRadiusLG: 12,
    },
    Drawer: {
      borderRadiusLG: 12,
    },
  },
};
```

### 8.2 Tailwind 配置

```javascript
// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
        mono: ['"SF Mono"', "Monaco", '"Cascadia Code"', "monospace"],
      },
    },
  },
  plugins: [],
};
```

---

## 九、验收清单

### 9.1 批量操作

- [ ] 批量选择框与完成状态框分离显示
- [ ] 批量操作工具栏固定底部显示
- [ ] 全选/取消全选功能正常
- [ ] 批量删除确认弹窗样式统一

### 9.2 模态框

- [ ] 新建/编辑任务表单统一
- [ ] 删除确认使用 Ant Design Popconfirm

### 9.3 废纸篓

- [ ] 废纸篓页面显示删除时间
- [ ] 支持单个/批量恢复
- [ ] 支持单个/批量永久删除
- [ ] 显示过期倒计时

### 9.4 撤销操作

- [ ] Ctrl+Z 快捷键生效
- [ ] 工具栏撤销按钮可用
- [ ] Toast 提示显示撤销链接

### 9.5 数据导入导出

- [ ] JSON 导出功能
- [ ] CSV 导出功能
- [ ] JSON 导入功能
- [ ] CSV 导入功能
- [ ] 导入预览功能

---

## 十、相关文档

| 文档           | 路径                               |
| -------------- | ---------------------------------- |
| PRD v0.3       | `../PRD/PRD-v0.3.md`               |
| PRD v0.2       | `../PRD/PRD-v0.2.md`               |
| UI Design v0.2 | `UI-Design-v0.2-batch-shortcut.md` |

---

## 十一、变更历史

| 版本 | 日期       | 变更内容     |
| ---- | ---------- | ------------ |
| v1.0 | 2026-03-09 | 初始版本创建 |

---

**文档结束**

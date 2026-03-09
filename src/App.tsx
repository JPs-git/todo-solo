// src/App.tsx

import { useState } from "react";
import { TaskProvider } from "./context/TaskContext";
import { useTasks } from "./hooks/useTasks";
import {
  useKeyboardShortcuts,
  type ShortcutConfig,
} from "./hooks/useKeyboardShortcuts";
import Header from "./components/Header";
import Toolbar from "./components/Toolbar";
import TaskList from "./components/TaskList";
import Footer from "./components/Footer";
import TaskForm from "./components/TaskForm";
import KeyboardShortcutsHelp from "./components/KeyboardShortcutsHelp";
import type { Task } from "./types";
import "./styles/global.css";
import "./styles/components.css";

function AppContent() {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const {
    addTask,
    updateTask,
    selectedCount,
    selectAllTasks,
    deselectAllTasks,
    deleteSelectedTasks,
    toggleSelectedTasks,
  } = useTasks();

  const handleOpenTaskForm = (task: Task | null = null) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleCloseTaskForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = (task: Task) => {
    if (task.createdAt === task.updatedAt && task.createdAt === task.order) {
      addTask(task);
    } else {
      updateTask(task.id, task);
    }
    handleCloseTaskForm();
  };

  const handleFocusSearch = () => {
    const searchInput = document.querySelector(
      ".header__search-input"
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
  };

  const shortcuts: ShortcutConfig[] = [
    {
      key: "n",
      ctrl: true,
      handler: () => handleOpenTaskForm(),
      description: "新建任务",
      group: "任务操作",
    },
    {
      key: "f",
      ctrl: true,
      handler: handleFocusSearch,
      description: "聚焦搜索框",
      group: "导航与选择",
    },
    {
      key: "a",
      ctrl: true,
      handler: selectAllTasks,
      description: "全选任务",
      group: "导航与选择",
    },
    {
      key: "Delete",
      handler: () => {
        if (selectedCount > 0) {
          deleteSelectedTasks();
        }
      },
      description: "删除选中的任务",
      group: "任务操作",
    },
    {
      key: " ",
      handler: () => {
        if (selectedCount > 0) {
          toggleSelectedTasks();
        }
      },
      description: "标记完成/未完成",
      group: "任务操作",
    },
    {
      key: "Escape",
      handler: () => {
        if (isTaskFormOpen) {
          handleCloseTaskForm();
        } else if (showShortcutsHelp) {
          setShowShortcutsHelp(false);
        } else if (selectedCount > 0) {
          deselectAllTasks();
        }
      },
      description: "取消操作",
      group: "任务操作",
    },
    {
      key: "?",
      handler: () => setShowShortcutsHelp(!showShortcutsHelp),
      description: "显示/隐藏快捷键帮助",
      group: "帮助",
    },
  ];

  useKeyboardShortcuts({ shortcuts });

  return (
    <div className="app">
      <Header />
      <div className="container">
        <Toolbar />
        <TaskList onEditTask={handleOpenTaskForm} />
      </div>
      <Footer onAddTask={() => handleOpenTaskForm()} />
      <TaskForm
        task={editingTask}
        onSave={handleSaveTask}
        onCancel={handleCloseTaskForm}
        isOpen={isTaskFormOpen}
      />
      <KeyboardShortcutsHelp
        isOpen={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
      />
    </div>
  );
}

function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}

export default App;

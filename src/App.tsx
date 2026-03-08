// src/App.tsx

import { useState } from "react";
import { TaskProvider } from "./context/TaskContext";
import { useTasks } from "./hooks/useTasks";
import Header from "./components/Header";
import Toolbar from "./components/Toolbar";
import TaskList from "./components/TaskList";
import Footer from "./components/Footer";
import TaskForm from "./components/TaskForm";
import type { Task } from "./types";
import "./styles/global.css";
import "./styles/components.css";

function AppContent() {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { addTask, updateTask } = useTasks();

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
      // 新任务：createdAt、updatedAt和order都相同（都是当前时间戳）
      addTask(task);
    } else {
      // 更新现有任务
      updateTask(task.id, task);
    }
    handleCloseTaskForm();
  };

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

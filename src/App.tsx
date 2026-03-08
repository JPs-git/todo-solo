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

function App() {
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
    if (task.id) {
      // 更新现有任务
      updateTask(task.id, task);
    } else {
      // 添加新任务
      addTask(task);
    }
    handleCloseTaskForm();
  };

  return (
    <TaskProvider>
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
    </TaskProvider>
  );
}

export default App;

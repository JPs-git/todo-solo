// src/components/TaskList.tsx

import React from "react";
import { useTasks } from "../hooks/useTasks";
import TaskItem from "./TaskItem";
import EmptyState from "./EmptyState";
import type { Task } from "../types";

interface TaskListProps {
  onEditTask: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ onEditTask }) => {
  const {
    filteredTasks,
    toggleTask,
    deleteTask,
    reorderTasks,
    selectTask,
    deselectTask,
    isTaskSelected,
  } = useTasks();

  if (filteredTasks.length === 0) {
    return <EmptyState />;
  }

  const handleEdit = (task: Task) => {
    onEditTask(task);
  };

  const handleMoveTask = (dragIndex: number, hoverIndex: number) => {
    reorderTasks(dragIndex, hoverIndex);
  };

  return (
    <div className="task-list">
      {filteredTasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={toggleTask}
          onEdit={handleEdit}
          onDelete={deleteTask}
          index={index}
          moveTask={handleMoveTask}
          isSelected={isTaskSelected(task.id)}
          onSelect={selectTask}
          onDeselect={deselectTask}
        />
      ))}
    </div>
  );
};

export default TaskList;

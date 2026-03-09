// src/components/TaskList.tsx

import React, { useState } from "react";
import "./index.css";
import { useTasks } from "../../hooks/useTasks";
import TaskItem from "../TaskItem";
import EmptyState from "../EmptyState";
import BatchToolbar from "../BatchToolbar";
import Modal from "../Modal";
import type { Task } from "../../types";

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
    selectedCount,
    selectAllTasks,
    deselectAllTasks,
    deleteSelectedTasks,
    toggleSelectedTasks,
  } = useTasks();

  const [showBatchDeleteModal, setShowBatchDeleteModal] = useState(false);

  if (filteredTasks.length === 0) {
    return <EmptyState />;
  }

  const handleEdit = (task: Task) => {
    onEditTask(task);
  };

  const handleMoveTask = (dragIndex: number, hoverIndex: number) => {
    reorderTasks(dragIndex, hoverIndex);
  };

  const handleBatchDelete = () => {
    setShowBatchDeleteModal(true);
  };

  const handleConfirmBatchDelete = () => {
    deleteSelectedTasks();
    setShowBatchDeleteModal(false);
  };

  const handleBatchComplete = () => {
    toggleSelectedTasks();
  };

  return (
    <>
      <BatchToolbar
        selectedCount={selectedCount}
        totalCount={filteredTasks.length}
        onSelectAll={selectAllTasks}
        onDeselectAll={deselectAllTasks}
        onBatchComplete={handleBatchComplete}
        onBatchDelete={handleBatchDelete}
      />
      <div className="task-list space-y-3">
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
      <Modal
        isOpen={showBatchDeleteModal}
        onClose={() => setShowBatchDeleteModal(false)}
        title="确认批量删除"
        content={`确定要删除选中的 ${selectedCount} 个任务吗？此操作无法撤销。`}
        confirmText="删除"
        cancelText="取消"
        onConfirm={handleConfirmBatchDelete}
        onCancel={() => setShowBatchDeleteModal(false)}
      />
    </>
  );
};

export default TaskList;

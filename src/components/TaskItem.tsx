// src/components/TaskItem.tsx

import React, { useState } from "react";
import type { Task } from "../types";
import { formatDate, getPriorityColor } from "../utils/helpers";
import Modal from "./Modal";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  index: number;
  moveTask: (dragIndex: number, hoverIndex: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
  index,
  moveTask,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleToggle = () => {
    onToggle(task.id);
  };

  const handleEdit = () => {
    onEdit(task);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete(task.id);
    setShowDeleteModal(false);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dragIndex = Number(e.dataTransfer.getData("text/plain"));
    if (dragIndex !== index) {
      moveTask(dragIndex, index);
    }
  };

  return (
    <div
      className={`task-card ${task.completed ? "task-card--completed" : ""} ${
        isDragging ? "task-card--dragging" : ""
      }`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", index.toString());
        handleDragStart();
      }}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div
        className={`task-card__checkbox ${
          task.completed ? "task-card__checkbox--checked" : ""
        }`}
        onClick={handleToggle}
        role="checkbox"
        aria-checked={task.completed}
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        <svg
          className="task-card__checkbox-icon"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <div className="task-card__content">
        <div className="task-card__header">
          <div className="task-card__title">{task.title}</div>
          <div
            className="task-card__priority"
            style={{ backgroundColor: getPriorityColor(task.priority) }}
            title={`优先级：${
              task.priority === "high"
                ? "高"
                : task.priority === "medium"
                ? "中"
                : "低"
            }`}
          />
        </div>

        {task.description && (
          <div className="task-card__description">{task.description}</div>
        )}

        <div className="task-card__metadata">
          {task.dueDate && (
            <div className="task-card__due-date">
              截止日期：{formatDate(task.dueDate)}
            </div>
          )}
          {task.tags.length > 0 && (
            <div className="task-card__tags">
              {task.tags.map((tag, idx) => (
                <span key={idx} className="task-card__tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="task-card__actions">
        <button
          className="task-card__action-btn task-card__edit-btn"
          onClick={handleEdit}
          aria-label="编辑任务"
        >
          <svg
            className="task-card__edit-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button
          className="task-card__action-btn task-card__delete-btn"
          onClick={handleDelete}
          aria-label="删除任务"
        >
          <svg
            className="task-card__delete-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="确认删除"
        content="确定要删除这个任务吗？此操作无法撤销。"
        confirmText="删除"
        cancelText="取消"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default React.memo(TaskItem);

// src/components/TaskItem.tsx

import React, { useState } from "react";
import "./index.css";
import type { Task } from "../../types";
import { formatDate, getPriorityColor } from "../../utils/helpers";
import Modal from "../Modal";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  index: number;
  moveTask: (dragIndex: number, hoverIndex: number) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDeselect: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
  index,
  moveTask,
  isSelected,
  onSelect,
  onDeselect,
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

  const handleSelectionToggle = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (isSelected) {
      onDeselect(task.id);
    } else {
      onSelect(task.id);
    }
  };

  return (
    <div
      className={`task-card group bg-white border border-gray-200 rounded-lg p-4 flex gap-3 items-start transition-all duration-300 cursor-pointer ${
        task.completed ? "task-card--completed opacity-70" : ""
      } ${
        isDragging ? "task-card--dragging opacity-50 transform rotate-2" : ""
      } ${
        isSelected
          ? "task-card--selected border-primary-500 bg-blue-50 shadow-md"
          : "hover:shadow-md hover:border-gray-300"
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
        className={`task-card__selection-checkbox w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center cursor-pointer transition-all duration-300 ${
          isSelected
            ? "task-card__selection-checkbox--checked bg-primary-500 border-primary-500 text-white"
            : "hover:border-primary-500"
        }`}
        onClick={handleSelectionToggle}
        role="checkbox"
        aria-checked={isSelected}
        aria-label={`选择任务: ${task.title}`}
        tabIndex={0}
        data-testid={`task-item-${task.id}-select`}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSelectionToggle(e);
          }
          // 空格键不处理，让全局快捷键处理标记完成功能
        }}
      >
        {isSelected && (
          <svg
            className="task-card__selection-checkbox-icon w-3 h-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>

      <div
        className={`task-card__checkbox w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center cursor-pointer transition-all duration-300 ${
          task.completed
            ? "task-card__checkbox--checked bg-green-500 border-green-500 text-white"
            : "hover:border-primary-500"
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
          className={`task-card__checkbox-icon w-3 h-3 ${
            task.completed ? "block" : "hidden"
          }`}
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

      <div className="task-card__content flex-1 min-w-0">
        <div className="task-card__header flex justify-between items-start mb-2">
          <div
            className="task-card__title font-medium text-gray-800 line-clamp-1 cursor-pointer hover:text-primary-600 transition-colors"
            onClick={handleEdit}
          >
            {task.title}
          </div>
          <div
            className="task-card__priority w-3 h-3 rounded-full flex-shrink-0"
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
          <div className="task-card__description text-sm text-gray-600 mb-2 line-clamp-2">
            {task.description}
          </div>
        )}

        <div className="task-card__metadata flex flex-wrap gap-4 items-center">
          {task.dueDate && (
            <div className="task-card__due-date text-xs text-gray-500">
              截止日期：{formatDate(task.dueDate)}
            </div>
          )}
          {task.tags.length > 0 && (
            <div className="task-card__tags flex flex-wrap gap-2">
              {task.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="task-card__tag text-xs font-medium text-primary-600 bg-blue-50 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="task-card__actions flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <button
          className="task-card__action-btn task-card__edit-btn w-8 h-8 rounded flex items-center justify-center bg-gray-100 hover:bg-blue-50 transition-colors"
          onClick={handleEdit}
          aria-label="编辑任务"
        >
          <svg
            className="task-card__edit-icon w-4 h-4 text-gray-600 hover:text-primary-600 transition-colors"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button
          className="task-card__action-btn task-card__delete-btn w-8 h-8 rounded flex items-center justify-center bg-gray-100 hover:bg-red-50 transition-colors"
          onClick={handleDelete}
          aria-label="删除任务"
        >
          <svg
            className="task-card__delete-icon w-4 h-4 text-red-500 hover:text-red-600 transition-colors"
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
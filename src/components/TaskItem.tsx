// src/components/TaskItem.tsx

import React, { useState } from 'react';
import type { Task } from '../types';
import { useTasks } from '../context/TaskContext';
import { formatTimestamp } from '../utils/helpers';
import Modal from './Modal';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { toggleTask, updateTask, deleteTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleToggle = () => {
    toggleTask(task.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      updateTask(task.id, { title: editTitle.trim() });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    deleteTask(task.id);
    setShowDeleteModal(false);
  };

  return (
    <div className={`task-card ${task.completed ? 'task-card--completed' : ''}`}>
      <div 
        className={`task-card__checkbox ${task.completed ? 'task-card__checkbox--checked' : ''}`}
        onClick={handleToggle}
        role="checkbox"
        aria-checked={task.completed}
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
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
        {isEditing ? (
          <div className="task-card__edit">
            <input
              type="text"
              className="input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSaveEdit();
                } else if (e.key === 'Escape') {
                  handleCancelEdit();
                }
              }}
              autoFocus
              aria-label="编辑任务"
            />
            <div className="task-card__edit-actions">
              <button 
                className="task-card__action-btn task-card__edit-btn"
                onClick={handleSaveEdit}
                aria-label="保存编辑"
              >
                <svg 
                  className="task-card__edit-icon" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M16.333 7.027a4 4 0 01-1.825 3.463l-.015.012-.01.008-.005.003A6.99 6.99 0 0112 16a6.99 6.99 0 01-3.723-1.01-.105-.066-.176-.142-.254-.23l-.005-.006-3.901-4.875A4 4 0 017.027 6.333l4.875 3.901.006.005.23.254.142.176.066.105c.36.54.598 1.17.69 1.847l.003.005.008.01.012.015a4 4 0 013.463-1.825z" 
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button 
                className="task-card__action-btn task-card__delete-btn"
                onClick={handleCancelEdit}
                aria-label="取消编辑"
              >
                <svg 
                  className="task-card__delete-icon" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="task-card__title">{task.title}</div>
            <div className="task-card__time">创建于：{formatTimestamp(task.createdAt)}</div>
          </>
        )}
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
            <path 
              d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" 
            />
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

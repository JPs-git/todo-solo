// src/components/TaskForm.tsx

import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';

const TaskForm: React.FC = () => {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    addTask(title);
    setTitle('');
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        className="input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="输入新任务..."
        aria-label="输入新任务"
        disabled={isSubmitting}
      />
      <button 
        type="submit" 
        className="footer__add-btn"
        disabled={!title.trim() || isSubmitting}
        aria-label="添加任务"
      >
        <svg 
          className="footer__add-icon" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" 
            clipRule="evenodd"
          />
        </svg>
        添加新任务
      </button>
    </form>
  );
};

export default TaskForm;

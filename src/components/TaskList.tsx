// src/components/TaskList.tsx

import React from 'react';
import { useTasks } from '../hooks/useTasks';
import TaskItem from './TaskItem';
import EmptyState from './EmptyState';

const TaskList: React.FC = () => {
  const { filteredTasks } = useTasks();

  if (filteredTasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="task-list">
      {filteredTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;

// src/components/Toolbar.tsx

import React from 'react';
import { useTasks } from '../hooks/useTasks';

const Toolbar: React.FC = () => {
  const { state, setFilter, setSortBy } = useTasks();

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value as 'all' | 'completed' | 'active');
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as 'createdAt' | 'completed');
  };

  return (
    <div className="toolbar">
      <select
        className="toolbar__select"
        value={state.filter}
        onChange={handleFilterChange}
        aria-label="筛选任务"
      >
        <option value="all">全部</option>
        <option value="active">未完成</option>
        <option value="completed">已完成</option>
      </select>
      
      <select
        className="toolbar__select"
        value={state.sortBy}
        onChange={handleSortChange}
        aria-label="排序任务"
      >
        <option value="createdAt">创建时间</option>
        <option value="completed">完成状态</option>
      </select>
    </div>
  );
};

export default Toolbar;

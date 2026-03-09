// src/components/Toolbar.tsx

import React from "react";
import "./index.css";
import { useTasks } from "../../hooks/useTasks";

const Toolbar: React.FC = () => {
  const { state, setFilter, setSortBy, setSelectedTag, getAllTags } =
    useTasks();
  const tags = getAllTags();

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value as "all" | "completed" | "active");
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(
      e.target.value as
        | "createdAt"
        | "completed"
        | "priority"
        | "dueDate"
        | "order"
    );
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tag = e.target.value === "all" ? null : e.target.value;
    setSelectedTag(tag);
  };

  return (
    <div className="toolbar bg-gray-50 p-3 rounded-lg mb-5 flex items-center space-x-4">
      <select
        className="toolbar__select px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
        value={state.filter}
        onChange={handleFilterChange}
        aria-label="筛选任务"
      >
        <option value="all">全部</option>
        <option value="active">未完成</option>
        <option value="completed">已完成</option>
      </select>

      <select
        className="toolbar__select px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
        value={state.sortBy}
        onChange={handleSortChange}
        aria-label="排序任务"
      >
        <option value="createdAt">创建时间</option>
        <option value="completed">完成状态</option>
        <option value="priority">优先级</option>
        <option value="dueDate">截止日期</option>
        <option value="order">自定义排序</option>
      </select>

      <select
        className="toolbar__select px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
        value={state.selectedTag || "all"}
        onChange={handleTagChange}
        aria-label="按标签筛选"
      >
        <option value="all">全部标签</option>
        {tags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Toolbar;

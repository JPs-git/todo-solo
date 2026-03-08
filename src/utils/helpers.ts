// src/utils/helpers.ts

import type { Task } from '../types';

/**
 * 筛选任务
 */
export const filterTasks = (
  tasks: Task[],
  filter: 'all' | 'completed' | 'active',
  searchTerm: string,
  selectedTag: string | null
): Task[] => {
  let filtered = tasks;

  // 按完成状态筛选
  if (filter === 'completed') {
    filtered = filtered.filter(task => task.completed);
  } else if (filter === 'active') {
    filtered = filtered.filter(task => !task.completed);
  }

  // 按搜索关键词筛选
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filtered = filtered.filter(task =>
      task.title.toLowerCase().includes(searchLower) ||
      task.description.toLowerCase().includes(searchLower)
    );
  }

  // 按标签筛选
  if (selectedTag) {
    filtered = filtered.filter(task => task.tags.includes(selectedTag));
  }

  return filtered;
};

/**
 * 排序任务
 */
export const sortTasks = (
  tasks: Task[],
  sortBy: 'createdAt' | 'completed' | 'priority' | 'dueDate' | 'order'
): Task[] => {
  const sorted = [...tasks];

  if (sortBy === 'createdAt') {
    // 按创建时间排序（最新的在前）
    sorted.sort((a, b) => b.createdAt - a.createdAt);
  } else if (sortBy === 'completed') {
    // 按完成状态排序（未完成的在前）
    sorted.sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return b.createdAt - a.createdAt;
    });
  } else if (sortBy === 'priority') {
    // 按优先级排序（高优先级在前）
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  } else if (sortBy === 'dueDate') {
    // 按截止日期排序（近的在前）
    sorted.sort((a, b) => {
      if (a.dueDate === null && b.dueDate === null) return 0;
      if (a.dueDate === null) return 1;
      if (b.dueDate === null) return -1;
      return a.dueDate - b.dueDate;
    });
  } else if (sortBy === 'order') {
    // 按排序顺序排序
    sorted.sort((a, b) => a.order - b.order);
  }

  return sorted;
};

/**
 * 格式化时间戳为可读格式
 */
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * 格式化日期为可读格式
 */
export const formatDate = (timestamp: number | null): string => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * 获取优先级对应的颜色
 */
export const getPriorityColor = (priority: 'high' | 'medium' | 'low'): string => {
  switch (priority) {
    case 'high':
      return '#ef4444'; // 红色
    case 'medium':
      return '#f59e0b'; // 橙色
    case 'low':
      return '#10b981'; // 绿色
    default:
      return '#6b7280'; // 灰色
  }
};

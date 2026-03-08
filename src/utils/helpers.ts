// src/utils/helpers.ts

import type { Task } from '../types';

/**
 * 筛选任务
 */
export const filterTasks = (
  tasks: Task[],
  filter: 'all' | 'completed' | 'active',
  searchTerm: string
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
      task.title.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
};

/**
 * 排序任务
 */
export const sortTasks = (
  tasks: Task[],
  sortBy: 'createdAt' | 'completed'
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

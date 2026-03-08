// src/types/index.ts

/**
 * 任务数据模型
 */
export interface Task {
  id: string;              // 任务唯一标识（UUID）
  title: string;           // 任务标题
  completed: boolean;      // 完成状态
  createdAt: number;       // 创建时间戳（毫秒）
  updatedAt: number;       // 更新时间戳（毫秒）
}

/**
 * 应用状态模型
 */
export interface AppState {
  tasks: Task[];           // 任务列表
  filter: 'all' | 'completed' | 'active';  // 当前筛选
  sortBy: 'createdAt' | 'completed';       // 排序方式
  searchTerm: string;      // 搜索关键词
}

/**
 * 存储数据结构
 */
export interface StorageData {
  tasks: Task[];
  version: string;        // 数据版本号
  lastModified: number;   // 最后修改时间
}

/**
 * 任务操作类型
 */
export type TaskAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'SET_FILTER'; payload: 'all' | 'completed' | 'active' }
  | { type: 'SET_SORT_BY'; payload: 'createdAt' | 'completed' }
  | { type: 'SET_SEARCH_TERM'; payload: string };

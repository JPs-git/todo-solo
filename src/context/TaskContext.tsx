// src/context/TaskContext.tsx

import React, { createContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Task, TaskAction, AppState } from '../types';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/storage';
import { filterTasks, sortTasks } from '../utils/helpers';

// 初始状态
const initialState: AppState = {
  tasks: loadFromLocalStorage(),
  filter: 'all',
  sortBy: 'createdAt',
  searchTerm: '',
  selectedTag: null,
};

// Reducer 函数
const taskReducer = (state: AppState, action: TaskAction): AppState => {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
      };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates, updatedAt: Date.now() }
            : task
        ),
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, completed: !task.completed, updatedAt: Date.now() }
            : task
        ),
      };
    
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload,
      };
    
    case 'SET_SORT_BY':
      return {
        ...state,
        sortBy: action.payload,
      };
    
    case 'SET_SEARCH_TERM':
      return {
        ...state,
        searchTerm: action.payload,
      };
    
    case 'SET_SELECTED_TAG':
      return {
        ...state,
        selectedTag: action.payload,
      };
    
    case 'REORDER_TASKS': {
      const { sourceIndex, destinationIndex } = action.payload;
      const newTasks = [...state.tasks];
      const [movedTask] = newTasks.splice(sourceIndex, 1);
      newTasks.splice(destinationIndex, 0, movedTask);
      // 更新排序顺序
      const reorderedTasks = newTasks.map((task, index) => ({
        ...task,
        order: index,
        updatedAt: Date.now()
      }));
      return {
        ...state,
        tasks: reorderedTasks,
      };
    }
    
    default:
      return state;
  }
};

// Context 类型
export interface TaskContextType {
  state: AppState;
  filteredTasks: Task[];
  addTask: (task: Partial<Task>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  setFilter: (filter: 'all' | 'completed' | 'active') => void;
  setSortBy: (sortBy: 'createdAt' | 'completed' | 'priority' | 'dueDate' | 'order') => void;
  setSearchTerm: (searchTerm: string) => void;
  setSelectedTag: (tag: string | null) => void;
  reorderTasks: (sourceIndex: number, destinationIndex: number) => void;
  getAllTags: () => string[];
}

// 创建 Context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Provider 组件
export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // 计算筛选和排序后的任务
  const filteredTasks = sortTasks(
    filterTasks(state.tasks, state.filter, state.searchTerm, state.selectedTag),
    state.sortBy
  );

  // 数据变化时保存到本地存储
  useEffect(() => {
    saveToLocalStorage(state.tasks);
  }, [state.tasks]);

  // 操作函数
  const addTask = (taskData: Partial<Task>): Task => {
    const newTask: Task = {
      id: uuidv4(),
      title: taskData.title?.trim() || '',
      description: taskData.description || '',
      completed: false,
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      tags: taskData.tags || [],
      order: state.tasks.length,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const toggleTask = (id: string) => {
    dispatch({ type: 'TOGGLE_TASK', payload: id });
  };

  const setFilter = (filter: 'all' | 'completed' | 'active') => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  const setSortBy = (sortBy: 'createdAt' | 'completed' | 'priority' | 'dueDate' | 'order') => {
    dispatch({ type: 'SET_SORT_BY', payload: sortBy });
  };

  const setSearchTerm = (searchTerm: string) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: searchTerm });
  };

  const setSelectedTag = (tag: string | null) => {
    dispatch({ type: 'SET_SELECTED_TAG', payload: tag });
  };

  const reorderTasks = (sourceIndex: number, destinationIndex: number) => {
    dispatch({ type: 'REORDER_TASKS', payload: { sourceIndex, destinationIndex } });
  };

  const getAllTags = (): string[] => {
    const tagSet = new Set<string>();
    state.tasks.forEach(task => {
      task.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  };

  const value: TaskContextType = {
    state,
    filteredTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    setFilter,
    setSortBy,
    setSearchTerm,
    setSelectedTag,
    reorderTasks,
    getAllTags,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

// 导出 Context
export default TaskContext;

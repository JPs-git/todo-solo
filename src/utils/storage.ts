// src/utils/storage.ts

import type { Task, StorageData } from "../types";

const STORAGE_KEY = "todo-list-mvp-storage";
const STORAGE_VERSION = "2.0";

/**
 * 数据迁移函数
 */
const migrateData = (tasks: unknown[]): Task[] => {
  return tasks.map((task, index) => {
    // 确保task是一个对象
    const typedTask =
      typeof task === "object" && task !== null ? (task as Partial<Task>) : {};

    // 验证必要字段
    const id = typedTask.id || crypto.randomUUID();
    const title = typedTask.title || "";

    return {
      id,
      title,
      description: typedTask.description || "",
      completed:
        typeof typedTask.completed === "boolean" ? typedTask.completed : false,
      priority: ["high", "medium", "low"].includes(typedTask.priority as string)
        ? (typedTask.priority as "high" | "medium" | "low")
        : "medium",
      dueDate: typeof typedTask.dueDate === "number" ? typedTask.dueDate : null,
      tags: Array.isArray(typedTask.tags) ? typedTask.tags : [],
      order: typeof typedTask.order === "number" ? typedTask.order : index,
      createdAt:
        typeof typedTask.createdAt === "number"
          ? typedTask.createdAt
          : Date.now(),
      updatedAt:
        typeof typedTask.updatedAt === "number"
          ? typedTask.updatedAt
          : Date.now(),
    };
  });
};

/**
 * 保存数据到本地存储
 */
export const saveToLocalStorage = (tasks: Task[]): void => {
  try {
    const data: StorageData = {
      tasks,
      version: STORAGE_VERSION,
      lastModified: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save data to localStorage:", error);
  }
};

/**
 * 从本地存储加载数据
 */
export const loadFromLocalStorage = (): Task[] => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const data: StorageData = JSON.parse(storedData);
      if (data.version === STORAGE_VERSION) {
        return data.tasks || [];
      } else {
        // 数据迁移
        const migratedTasks = migrateData(data.tasks || []);
        // 保存迁移后的数据
        saveToLocalStorage(migratedTasks);
        return migratedTasks;
      }
    }
  } catch (error) {
    console.error("Failed to load data from localStorage:", error);
  }
  return [];
};

/**
 * 清除本地存储数据
 */
export const clearLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear localStorage:", error);
  }
};

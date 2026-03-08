// src/components/TaskForm.tsx

import React, { useState, useEffect } from "react";
import type { Task } from "../types";

interface TaskFormProps {
  task: Task | null;
  onSave: (task: Task) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSave,
  onCancel,
  isOpen,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [dueDate, setDueDate] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    setTags("");
    setIsSubmitting(false);
  };

  // 当任务变化时更新表单
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setDueDate(
        task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
      );
      setTags(task.tags.join(","));
    } else {
      resetForm();
    }
  }, [task, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const timestamp = Date.now();
    const taskData: Task = {
      id: task?.id || crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate ? new Date(dueDate).getTime() : null,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      completed: task?.completed || false,
      order: task?.order || timestamp,
      createdAt: task?.createdAt || timestamp,
      updatedAt: timestamp,
    };

    onSave(taskData);
    resetForm();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="task-form-modal">
      <div className="task-form-modal__content">
        <h2>{task ? "编辑任务" : "添加新任务"}</h2>
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title">任务标题</label>
            <input
              type="text"
              id="title"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入任务标题..."
              aria-label="任务标题"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">任务描述</label>
            <textarea
              id="description"
              className="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="输入任务描述..."
              aria-label="任务描述"
              disabled={isSubmitting}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="priority">优先级</label>
            <select
              id="priority"
              className="select"
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as "high" | "medium" | "low")
              }
              disabled={isSubmitting}
            >
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">截止日期</label>
            <input
              type="date"
              id="dueDate"
              className="input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              aria-label="截止日期"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">标签（用逗号分隔）</label>
            <input
              type="text"
              id="tags"
              className="input"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="输入标签，用逗号分隔..."
              aria-label="标签"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              取消
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!title.trim() || isSubmitting}
            >
              {task ? "更新任务" : "添加任务"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;

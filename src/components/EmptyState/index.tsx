// src/components/EmptyState.tsx

import React from "react";
import "./index.css";

const EmptyState: React.FC = () => {
  return (
    <div className="empty-state flex flex-col items-center justify-center py-12 text-center">
      <svg
        className="empty-state__icon w-16 h-16 text-gray-300 mb-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <h3 className="empty-state__title text-xl font-semibold text-gray-700 mb-2">
        暂无任务
      </h3>
      <p className="empty-state__description text-gray-500">
        点击下方按钮添加新任务
      </p>
    </div>
  );
};

export default EmptyState;

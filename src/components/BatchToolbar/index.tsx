import React from "react";
import "./index.css";

interface BatchToolbarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBatchComplete: () => void;
  onBatchDelete: () => void;
}

const BatchToolbar: React.FC<BatchToolbarProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onBatchComplete,
  onBatchDelete,
}) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="batch-toolbar bg-blue-50 border border-blue-100 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4" data-testid="batch-toolbar">
      <div className="batch-toolbar__info flex items-center gap-3">
        <svg
          className="batch-toolbar__checkbox-icon w-5 h-5 text-primary-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="batch-toolbar__count text-sm font-medium text-gray-700" data-testid="batch-toolbar-count">
          已选择 {selectedCount} 个任务
        </span>
      </div>
      <div className="batch-toolbar__actions flex gap-2 flex-wrap">
        <button
          className="batch-toolbar__button batch-toolbar__button--secondary px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={onSelectAll}
          disabled={selectedCount === totalCount}
          data-testid="select-all-button"
        >
          全选
        </button>
        <button
          className="batch-toolbar__button batch-toolbar__button--secondary px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          onClick={onDeselectAll}
          data-testid="deselect-all-button"
        >
          取消全选
        </button>
        <button
          className="batch-toolbar__button batch-toolbar__button--primary px-4 py-2 border border-primary-500 rounded-md text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 transition-colors"
          onClick={onBatchComplete}
          data-testid="batch-complete-button"
        >
          完成
        </button>
        <button
          className="batch-toolbar__button batch-toolbar__button--danger px-4 py-2 border border-red-500 rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
          onClick={onBatchDelete}
          data-testid="batch-delete-button"
        >
          删除
        </button>
      </div>
    </div>
  );
};

export default BatchToolbar;

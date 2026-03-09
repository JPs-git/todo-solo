import React from "react";

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
    <div className="batch-toolbar" data-testid="batch-toolbar">
      <div className="batch-toolbar__info">
        <svg
          className="batch-toolbar__checkbox-icon"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="batch-toolbar__count" data-testid="batch-toolbar-count">
          已选择 {selectedCount} 个任务
        </span>
      </div>
      <div className="batch-toolbar__actions">
        <button
          className="batch-toolbar__button batch-toolbar__button--secondary"
          onClick={onSelectAll}
          disabled={selectedCount === totalCount}
          data-testid="select-all-button"
        >
          全选
        </button>
        <button
          className="batch-toolbar__button batch-toolbar__button--secondary"
          onClick={onDeselectAll}
          data-testid="deselect-all-button"
        >
          取消全选
        </button>
        <button
          className="batch-toolbar__button batch-toolbar__button--primary"
          onClick={onBatchComplete}
          data-testid="batch-complete-button"
        >
          完成
        </button>
        <button
          className="batch-toolbar__button batch-toolbar__button--danger"
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

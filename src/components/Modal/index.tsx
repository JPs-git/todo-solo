// src/components/Modal.tsx

import React, { useEffect, useRef } from "react";
import "./index.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  confirmText = "确认",
  cancelText = "取消",
  onConfirm,
  onCancel,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // 处理点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // 防止背景滚动
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto"; // 恢复背景滚动
    };
  }, [isOpen, onClose]);

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "Enter") {
        onConfirm();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, onConfirm]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay fixed inset-0 bg-black opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="modal bg-white rounded-lg shadow-xl max-w-md w-full animate-fade-in"
        ref={modalRef}
      >
        <h3 className="modal__title text-lg font-semibold text-gray-800 p-6 border-b border-gray-200">
          {title}
        </h3>
        <p className="modal__content text-gray-600 p-6">{content}</p>
        <div className="modal__actions flex gap-3 p-6 border-t border-gray-200 justify-end">
          <button
            className="modal__btn modal__btn--secondary px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            onClick={onCancel}
            aria-label={cancelText}
          >
            {cancelText}
          </button>
          <button
            className="modal__btn modal__btn--primary px-4 py-2 border border-primary-500 rounded-md text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 transition-colors"
            onClick={onConfirm}
            aria-label={confirmText}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

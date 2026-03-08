// src/components/Footer.tsx

import React from "react";

interface FooterProps {
  onAddTask: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAddTask }) => {
  return (
    <footer className="footer">
      <button
        className="footer__add-btn"
        onClick={onAddTask}
        aria-label="添加新任务"
      >
        <svg
          className="footer__add-icon"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        添加新任务
      </button>
    </footer>
  );
};

export default Footer;

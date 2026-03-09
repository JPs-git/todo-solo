// src/components/Footer.tsx

import React from "react";
import "./index.css";

interface FooterProps {
  onAddTask: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAddTask }) => {
  return (
    <footer className="footer bg-white border-t border-gray-200 py-4 flex items-center justify-center">
      <button
        className="footer__add-btn bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg flex items-center space-x-2 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
        onClick={onAddTask}
        aria-label="添加新任务"
      >
        <svg
          className="footer__add-icon w-5 h-5"
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

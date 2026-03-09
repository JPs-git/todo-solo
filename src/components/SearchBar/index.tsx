// src/components/SearchBar.tsx

import React from 'react';
import './index.css';
import { useTasks } from '../../hooks/useTasks';

const SearchBar: React.FC = () => {
  const { setSearchTerm } = useTasks();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="header__search relative">
      <svg 
        className="header__search-icon w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path 
          fillRule="evenodd" 
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
          clipRule="evenodd"
        />
      </svg>
      <input
        type="text"
        className="header__search-input w-72 h-9 border border-gray-300 rounded-full pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:w-80 transition-all duration-300"
        placeholder="搜索任务..."
        onChange={handleSearch}
        aria-label="搜索任务"
      />
    </div>
  );
};

export default SearchBar;

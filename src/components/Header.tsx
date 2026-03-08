// src/components/Header.tsx

import React from 'react';
import SearchBar from './SearchBar';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header__logo">
        <svg 
          className="header__logo-icon" 
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
        <h1 className="header__logo-text">Todo-List</h1>
      </div>
      <SearchBar />
    </header>
  );
};

export default Header;

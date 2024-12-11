import React from 'react';

const ThemeToggle = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      <span className="text-xl">
        {isDark ? '☀️' : '🌙'}
      </span>
    </button>
  );
};

export default ThemeToggle;

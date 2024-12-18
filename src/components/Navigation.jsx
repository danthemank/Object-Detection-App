import React from 'react';

const Navigation = ({ activeTab, onTabChange }) => {
  return (
    <div className="mb-8">
      <nav className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => onTabChange('analyze')}
          className={`py-4 px-6 text-sm font-medium ${
            activeTab === 'analyze'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Analyze Object
        </button>
        <button
          onClick={() => onTabChange('history')}
          className={`py-4 px-6 text-sm font-medium ${
            activeTab === 'history'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          History
        </button>
      </nav>
    </div>
  );
};

export default Navigation;

import React from 'react';

const SourceCard = ({ source }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-900 dark:text-white">
          {source.name}
        </h4>
        <span className="text-lg font-medium text-green-600 dark:text-green-400">
          {source.value}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        {source.condition}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-2">
        {source.comparison}
      </p>
      <a 
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center gap-1"
      >
        View Listing
        <span className="text-xs">↗</span>
      </a>
    </div>
  );
};

export default SourceCard;

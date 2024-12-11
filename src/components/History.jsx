import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FaTimes, FaDollarSign } from 'react-icons/fa';

const ValueBadge = ({ category }) => {
  const colors = {
    'Valuable': 'bg-green-100 text-green-800 border-green-200',
    'Somewhat Valuable': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Not Valuable': 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[category]} border`}>
      {category}
    </span>
  );
};

const History = () => {
  // ... (previous useState and useEffect remain the same)

  const formatDescription = (entry) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <ValueBadge category={entry.result.marketValue.category} />
          <div className="text-lg font-semibold text-green-600">
            {entry.result.marketValue.priceRange}
          </div>
        </div>
        <div className="prose max-w-none">
          {entry.result.description.split('\n').map((line, index) => (
            <div key={index} className={line.match(/^\d+\./) ? 'font-semibold mt-2' : 'ml-4'}>
              {line}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">History</h2>
      
      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedEntry(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={24} />
            </button>
            <img 
              src={selectedEntry.image} 
              alt="Detected object" 
              className="w-full rounded object-contain max-h-[40vh]" 
            />
            <div className="mt-4">
              <div className="text-sm text-gray-500 mb-2">
                {format(new Date(selectedEntry.timestamp), 'PPpp')}
              </div>
              {formatDescription(selectedEntry)}
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {history.map((entry) => (
          <div
            key={entry.id}
            onClick={() => setSelectedEntry(entry)}
            className="bg-white rounded-lg shadow p-2 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="aspect-w-4 aspect-h-3 mb-2">
              <img 
                src={entry.image} 
                alt="Detected object" 
                className="w-full h-32 object-cover rounded" 
              />
            </div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold truncate">
                {entry.result.type}
              </p>
              <ValueBadge category={entry.result.marketValue.category} />
            </div>
            <div className="flex items-center text-green-600 text-sm">
              <FaDollarSign className="mr-1" />
              {entry.result.marketValue.priceRange}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {format(new Date(entry.timestamp), 'PP')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;

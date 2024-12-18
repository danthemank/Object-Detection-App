import React, { useState } from 'react';
import { formatMarkdown } from '../utils/formatMarkdown';
import SourceCard from './SourceCard';

const History = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const ValueBadge = ({ category }) => (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
      category === 'Valuable' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
      category === 'Somewhat Valuable' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
      'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
    }`}>
      {category}
    </span>
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No analysis history yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedItem(item)}
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={item.image}
                  alt="Analyzed object"
                  className="object-cover w-full h-48"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.specificType}
                  </div>
                  <ValueBadge category={item.value.category} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {formatCurrency(item.value.range.min)} - {formatCurrency(item.value.range.max)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(item.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Analysis Details
                </h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <img
                src={selectedItem.image}
                alt="Analyzed object"
                className="w-full rounded-lg mb-4"
              />

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Identification
                  </h3>
                  <div 
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: formatMarkdown(selectedItem.identification)
                    }}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Condition
                  </h3>
                  <div 
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: formatMarkdown(selectedItem.condition.assessment)
                    }}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Market Analysis
                  </h3>
                  {selectedItem.marketAnalysis.sources && selectedItem.marketAnalysis.sources.length > 0 && (
                    <div className="mb-4">
                      <div className="mb-2">
                        <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">
                          Current Market Listings
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Active listings for similar items
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedItem.marketAnalysis.sources.map((source, index) => (
                          <SourceCard key={index} source={source} />
                        ))}
                      </div>
                    </div>
                  )}
                  <div 
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: formatMarkdown(selectedItem.marketAnalysis.analysis)
                    }}
                  />
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <ValueBadge category={selectedItem.value.category} />
                  <div className="text-lg font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(selectedItem.value.range.min)} - {formatCurrency(selectedItem.value.range.max)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;

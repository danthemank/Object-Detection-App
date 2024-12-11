import React, { useState } from 'react';

const AccordionSection = ({ title, children, badge }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 first:border-t-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{title}</h3>
        <div className="flex items-center gap-3">
          {badge}
          <span className={`transform transition-transform duration-300 text-gray-500 dark:text-gray-400 ${
            isOpen ? 'rotate-180' : ''
          }`}>
            ▼
          </span>
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
};

export default AccordionSection;

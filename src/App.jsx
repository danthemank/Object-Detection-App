import React, { useState } from 'react';
import Camera from './components/Camera';
import AccordionSection from './components/AccordionSection';
import SourceCard from './components/SourceCard';
import { detectObjects } from './services/openai';
import { formatMarkdown } from './utils/formatMarkdown';
import './index.css';

function App() {
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleCapture = async (imageData) => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      setCurrentImage(imageData);
      
      const detection = await detectObjects(imageData);
      setResult(detection);
      
    } catch (error) {
      console.error('Detection failed:', error);
      setError(error.message || 'Failed to process image. Please try again.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const ValueBadge = ({ category }) => (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
      category === 'Valuable' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
      category === 'Somewhat Valuable' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
      'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
    }`}>
      {category}
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Object Detection
          </h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 transition-colors"
          >
            <span className="text-xl">
              {isDark ? '☀️' : '🌙'}
            </span>
          </button>
        </div>

        <div className="space-y-6">
          <Camera onCapture={handleCapture} />
          
          {loading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Analyzing image...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {result && !loading && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
              <div className="px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Analysis Result</h2>
              </div>

              <AccordionSection 
                title="Object Identification"
                badge={<ValueBadge category={result.value.category} />}
              >
                <div 
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: formatMarkdown(result.identification)
                  }}
                />
              </AccordionSection>

              <AccordionSection 
                title="Condition Assessment"
                badge={
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    Detailed Analysis
                  </span>
                }
              >
                <div 
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: formatMarkdown(result.condition.assessment)
                  }}
                />
              </AccordionSection>

              <AccordionSection 
                title="Market Value Analysis"
                badge={
                  <span className="text-lg font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(result.value.range.min)} - {formatCurrency(result.value.range.max)}
                  </span>
                }
              >
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Average Value: {formatCurrency(result.value.range.average)}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Market Sources
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {result.marketAnalysis.sources.map((source, index) => (
                        <SourceCard key={index} source={source} />
                      ))}
                    </div>
                  </div>

                  <div 
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: formatMarkdown(result.marketAnalysis.analysis)
                    }}
                  />
                </div>
              </AccordionSection>

              {currentImage && (
                <AccordionSection title="Image Preview">
                  <div className="mt-2">
                    <img 
                      src={currentImage} 
                      alt="Analyzed object" 
                      className="w-full max-h-96 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                  </div>
                </AccordionSection>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

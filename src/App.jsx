import React, { useState, useEffect } from 'react';
import Camera from './components/Camera';
import Navigation from './components/Navigation';
import History from './components/History';
import AccordionSection from './components/AccordionSection';
import SourceCard from './components/SourceCard';
import { detectObjects } from './services/openai';
import { formatMarkdown } from './utils/formatMarkdown';
import './index.css';

function App() {
  console.log('App component rendering...');

  const [activeTab, setActiveTab] = useState('analyze');
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [history, setHistory] = useState(() => {
    try {
      console.log('Loading history from localStorage...');
      const savedHistory = localStorage.getItem('analysisHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (e) {
      console.error('Failed to load history:', e);
      return [];
    }
  });

  useEffect(() => {
    // Set initial dark mode
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  useEffect(() => {
    try {
      // Store history without images
      const historyToStore = history.map(item => ({
        ...item,
        image: undefined // Remove image for storage
      }));
      localStorage.setItem('analysisHistory', JSON.stringify(historyToStore));
    } catch (e) {
      console.error('Failed to save history:', e);
    }
  }, [history]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleCapture = async (imageData) => {
    try {
      if (!imageData) {
        throw new Error('No image data provided');
      }

      setLoading(true);
      setError(null);
      setResult(null);
      setCurrentImage(imageData);
      
      console.log('Starting image analysis...');
      const detection = await detectObjects(imageData);
      console.log('Analysis completed:', detection);

      if (!detection) {
        throw new Error('No detection results received');
      }

      setResult(detection);
      
      // Add to history with the image
      const historyItem = {
        ...detection,
        image: imageData, // Keep the image in the state
        timestamp: new Date().toISOString()
      };

      setHistory(prev => [historyItem, ...prev]);
      
    } catch (error) {
      console.error('Detection failed:', error);
      setError(error.message || 'Failed to process image. Please try again.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    } catch (e) {
      console.error('Failed to format currency:', e);
      return `$${amount}`;
    }
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

  const renderAnalyzeContent = () => (
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

              {result.marketAnalysis.sources && result.marketAnalysis.sources.length > 0 && (
                <div>
                  <div className="mb-2">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Current Market Listings
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Active listings for similar items
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {result.marketAnalysis.sources.map((source, index) => (
                      <SourceCard key={index} source={source} />
                    ))}
                  </div>
                </div>
              )}

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
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
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

        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-6">
          {activeTab === 'analyze' ? renderAnalyzeContent() : <History items={history} />}
        </div>
      </div>
    </div>
  );
}

export default App;

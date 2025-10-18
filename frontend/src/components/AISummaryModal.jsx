import React, { useState } from 'react';
import { aiAPI } from '../services/api';
import { X, Brain, Loader, AlertCircle, RefreshCw } from 'lucide-react';

const AISummaryModal = ({ projectId, onClose }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateSummary = async () => {
    try {
      setLoading(true);
      setError('');
      setSummary('');
      
      console.log('🔄 Requesting AI summary for project:', projectId);
      const response = await aiAPI.summarize(projectId);
      setSummary(response.data.summary);
      console.log('✅ AI summary received');
    } catch (error) {
      console.error('❌ Summary error:', error);
      setError(error.message || 'Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    generateSummary();
  }, [projectId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b bg-green-50">
          <div className="flex items-center space-x-2">
            <Brain className="text-green-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">AI Project Summary</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-80">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader className="animate-spin text-green-600 mr-3" size={24} />
              <span className="text-gray-600">AI is analyzing your project...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-3">
              <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
              <div>
                <strong>Error:</strong> {error}
                <div className="mt-2">
                  <button
                    onClick={generateSummary}
                    className="text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {summary && !loading && (
            <div className="prose prose-sm max-w-none">
              <div className="bg-gray-50 rounded-lg p-4 border">
                <pre className="whitespace-pre-wrap text-gray-800 font-sans text-sm leading-relaxed">
                  {summary}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Powered by Google Gemini AI
            </span>
            <div className="flex space-x-2">
              <button
                onClick={generateSummary}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                <span>{loading ? 'Generating...' : 'Regenerate'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISummaryModal;
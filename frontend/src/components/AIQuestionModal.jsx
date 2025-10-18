import React, { useState, useEffect } from 'react';
import { aiAPI } from '../services/api';
import { X, MessageCircle, Send, Loader, Lightbulb, RefreshCw, Brain } from 'lucide-react';
import axios from 'axios';

const AIQuestionModal = ({ projectId, onClose }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [intelligentQuestions, setIntelligentQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [projectContext, setProjectContext] = useState(null);

  // Load intelligent questions when modal opens
  useEffect(() => {
    loadIntelligentQuestions();
  }, [projectId]);

  const loadIntelligentQuestions = async () => {
    try {
      setLoadingQuestions(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/ai/questions/${projectId}`);
      setIntelligentQuestions(response.data.questions);
      setProjectContext(response.data.projectContext);
    } catch (error) {
      console.error('❌ Failed to load intelligent questions:', error);
      // Fallback to default questions
      setIntelligentQuestions([
        "What are the most critical features for this project?",
        "How should I prioritize the remaining tasks?",
        "What are potential risks and how can I mitigate them?",
        "How can I improve the project completion rate?",
        "What tasks are taking longer than expected and why?",
        "How should I optimize the current workflow?",
        "What are the key milestones I should focus on?",
        "How can I better distribute task priorities?"
      ]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 Asking enhanced AI question:', question);
      const response = await aiAPI.askQuestion({
        projectId,
        question: question.trim()
      });
      
      setAnswer(response.data.answer);
      console.log('✅ Enhanced AI response received');
    } catch (error) {
      console.error('❌ Question error:', error);
      setError(error.message || 'Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  const handleNewQuestion = () => {
    setQuestion('');
    setAnswer('');
    setError('');
  };

  const handleSuggestedQuestion = (suggestedQ) => {
    setQuestion(suggestedQ);
    setError('');
  };

  const refreshQuestions = () => {
    loadIntelligentQuestions();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Brain className="text-purple-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">AI Project Assistant</h2>
              {projectContext && (
                <p className="text-sm text-gray-600">
                  {projectContext.name} • {projectContext.tasksCount} tasks • {projectContext.completionRate}% complete
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex h-[70vh]">
          {/* Left Panel - Intelligent Questions */}
          <div className="w-1/2 border-r bg-gray-50 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Lightbulb className="text-yellow-500" size={20} />
                <h3 className="font-semibold text-gray-900">Intelligent Questions</h3>
              </div>
              <button
                onClick={refreshQuestions}
                disabled={loadingQuestions}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Refresh questions"
              >
                <RefreshCw size={16} className={loadingQuestions ? 'animate-spin' : ''} />
              </button>
            </div>

            {loadingQuestions ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="animate-spin text-purple-600 mr-2" size={20} />
                <span className="text-gray-600 text-sm">Generating intelligent questions...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">
                  AI-generated questions based on your project analysis:
                </p>
                {intelligentQuestions.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(q)}
                    className="w-full text-left p-4 bg-white rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200 text-sm border border-gray-200 hover:border-purple-200 hover:shadow-sm group"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-purple-600 font-semibold text-xs mt-0.5">Q{index + 1}:</span>
                      <span className="flex-1 group-hover:text-purple-700 transition-colors">{q}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel - Conversation */}
          <div className="w-1/2 flex flex-col">
            <div className="flex-1 p-6 overflow-y-auto">
              {!answer && !loading && (
                <div className="text-center py-8">
                  <MessageCircle className="text-gray-400 mx-auto mb-4" size={48} />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Ask Your Question</h4>
                  <p className="text-gray-600 text-sm">
                    Select from intelligent suggestions or type your own question about the project.
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-start space-x-2">
                  <div className="flex-shrink-0 mt-0.5">⚠️</div>
                  <div>
                    <strong>Error:</strong> {error}
                    <div className="mt-2">
                      <button
                        onClick={() => setError('')}
                        className="text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {answer && (
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageCircle className="text-blue-600" size={16} />
                      <h4 className="font-semibold text-blue-900">Your Question:</h4>
                    </div>
                    <p className="text-blue-800 text-sm">{question}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-7 h-7 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">AI</span>
                      </div>
                      <h4 className="font-semibold text-gray-900">Expert Analysis:</h4>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-gray-800 font-sans text-sm leading-relaxed">
                        {answer}
                      </pre>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleNewQuestion}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <MessageCircle size={16} />
                    <span>Ask another question</span>
                  </button>
                </div>
              )}

              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader className="animate-spin text-purple-600 mx-auto mb-3" size={32} />
                    <p className="text-gray-600 font-medium">AI is analyzing your question...</p>
                    <p className="text-sm text-gray-500 mt-1">Considering full project context</p>
                  </div>
                </div>
              )}
            </div>

            {/* Question Input */}
            <div className="border-t p-4 bg-gray-50">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask anything about your project... (AI will analyze full context)"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    disabled={loading}
                    maxLength={500}
                  />
                  <button
                    type="submit"
                    disabled={loading || !question.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium"
                  >
                    <Send size={16} />
                    <span>{loading ? 'Analyzing...' : 'Ask AI'}</span>
                  </button>
                </div>
                
                <div className="text-center">
                  <span className="text-xs text-gray-500">
                    🧠 Enhanced AI with comprehensive project analysis • 🚀 Context-aware responses
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIQuestionModal;
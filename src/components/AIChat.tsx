'use client';

import { useState, useRef, useEffect } from 'react';
import { useAI } from '@/contexts/AIContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Bot, User, Heart, AlertCircle, CheckCircle, Info, Lightbulb, RotateCcw, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

interface AIChatProps {
  className?: string;
  showInsights?: boolean;
  context?: any;
}

export default function AIChat({ className = '', showInsights = true, context }: AIChatProps) {
  const { messages, insights, loading, sendMessage, generateInsights, clearMessages, translateMessage } = useAI();
  const { userProfile } = useAuth();
  const { t, language } = useLanguage();
  const [inputMessage, setInputMessage] = useState('');
  const [showTranslation, setShowTranslation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const messageContext = {
      userId: userProfile?.uid || '',
      vitals: context?.vitals,
      diseases: userProfile?.diseases || [],
      language: language,
      ...context,
    };

    await sendMessage(inputMessage, messageContext);
    setInputMessage('');
  };

  const handleGenerateInsights = async () => {
    if (!context?.vitals) {
      toast.error('No vitals data available for insights');
      return;
    }

    await generateInsights(context.vitals, userProfile?.diseases);
  };

  const handleTranslateMessage = async (message: string) => {
    try {
      const translated = await translateMessage(message, language);
      toast.success(`Translated: ${translated}`);
    } catch (error) {
      toast.error('Translation failed');
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'advice': return <Lightbulb className="h-4 w-4 text-blue-600" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'reminder': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'education': return <Info className="h-4 w-4 text-purple-600" />;
      default: return <Heart className="h-4 w-4 text-gray-600" />;
    }
  };

  const getInsightColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Health Insights */}
      {showInsights && insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-600" />
              <span>Health Insights</span>
            </CardTitle>
            <CardDescription>AI-powered health recommendations based on your data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-lg ${getInsightColor(insight.priority)}`}
                >
                  <div className="flex items-start space-x-2">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{insight.title}</h4>
                      <p className="text-sm text-gray-700 mt-1">{insight.message}</p>
                      {insight.actionable && (
                        <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Actionable
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Messages */}
      <Card className="h-96 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <span>AI Health Assistant</span>
            </CardTitle>
            <div className="flex space-x-2">
              {showInsights && context?.vitals && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateInsights}
                  disabled={loading}
                >
                  <Heart className="h-4 w-4 mr-1" />
                  Insights
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={clearMessages}
                disabled={messages.length === 0}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Health Assistant</h3>
                <p className="text-gray-600 mb-4">
                  Ask me anything about your health, symptoms, or medications
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage('What should I know about my current health?')}
                  >
                    Health Overview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage('What lifestyle changes can improve my health?')}
                  >
                    Lifestyle Tips
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage('When should I see a doctor?')}
                  >
                    When to See Doctor
                  </Button>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.role === 'user' ? (
                        <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                          {message.role === 'assistant' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleTranslateMessage(message.content)}
                              className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                            >
                              <Globe className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-gray-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              placeholder="Ask about your health..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !inputMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

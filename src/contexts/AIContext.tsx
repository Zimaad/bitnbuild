'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { aiService, AIChatMessage, HealthInsight } from '@/services/aiService';

interface AIContextType {
  messages: AIChatMessage[];
  insights: HealthInsight[];
  loading: boolean;
  sendMessage: (message: string, context?: any) => Promise<void>;
  generateInsights: (vitals: any, diseases?: string[]) => Promise<void>;
  clearMessages: () => void;
  translateMessage: (message: string, targetLanguage: string) => Promise<string>;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

interface AIProviderProps {
  children: ReactNode;
}

export function AIProvider({ children }: AIProviderProps) {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string, context?: any) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: AIChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await aiService.chatWithAI(message, context || {});
      
      // Add AI response
      const aiMessage: AIChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message to AI:', error);
      
      // Add error message
      const errorMessage: AIChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = async (vitals: any, diseases?: string[]) => {
    if (!vitals) return;

    setLoading(true);
    try {
      const healthInsights = await aiService.generateHealthInsights(vitals, diseases || []);
      setInsights(healthInsights);
    } catch (error) {
      console.error('Error generating health insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const translateMessage = async (message: string, targetLanguage: string): Promise<string> => {
    try {
      return await aiService.translateToRegionalLanguage(message, targetLanguage);
    } catch (error) {
      console.error('Error translating message:', error);
      return message; // Return original message if translation fails
    }
  };

  const value: AIContextType = {
    messages,
    insights,
    loading,
    sendMessage,
    generateInsights,
    clearMessages,
    translateMessage,
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}

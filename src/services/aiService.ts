import { GoogleGenerativeAI } from '@google/generative-ai';
import { Vitals } from '@/utils/validators';

const genAI = new GoogleGenerativeAI( "AIzaSyBvTamORAmhdbiqW9DNzCmUmEiOytamupU" );

export interface AIChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AIContext {
  userId: string;
  vitals?: Vitals;
  diseases?: string[];
  recentReports?: string[];
  language?: string;
}

export interface HealthInsight {
  type: 'advice' | 'warning' | 'reminder' | 'education';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  actionable?: boolean;
}

class AIService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Generate health insights based on vitals
  async generateHealthInsights(vitals: Vitals, diseases: string[] = []): Promise<HealthInsight[]> {
    const prompt = `
    Analyze the following health vitals and provide insights:
    
    Vitals:
    - Blood Pressure: ${vitals.bloodPressure ? `${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic} mmHg` : 'Not provided'}
    - Blood Sugar: ${vitals.bloodSugar ? `${vitals.bloodSugar.value} ${vitals.bloodSugar.unit} (${vitals.bloodSugar.fasting ? 'Fasting' : 'Non-fasting'})` : 'Not provided'}
    - Weight: ${vitals.weight ? `${vitals.weight} kg` : 'Not provided'}
    - Height: ${vitals.height ? `${vitals.height} cm` : 'Not provided'}
    - Heart Rate: ${vitals.heartRate ? `${vitals.heartRate} bpm` : 'Not provided'}
    - Temperature: ${vitals.temperature ? `${vitals.temperature}°F` : 'Not provided'}
    - Symptoms: ${vitals.symptoms || 'None reported'}
    
    Existing Diseases: ${diseases.join(', ') || 'None'}
    
    Please provide:
    1. Health status assessment
    2. Any warnings or concerns
    3. Lifestyle recommendations
    4. When to consult a doctor
    
    Format as JSON array with objects containing: type, title, message, priority, actionable
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse JSON response
      try {
        const insights = JSON.parse(text);
        return insights.map((insight: any) => ({
          type: insight.type || 'advice',
          title: insight.title || 'Health Insight',
          message: insight.message || '',
          priority: insight.priority || 'low',
          actionable: insight.actionable || false,
        }));
      } catch {
        // If JSON parsing fails, create a basic insight
        return [{
          type: 'advice' as const,
          title: 'Health Assessment',
          message: text,
          priority: 'medium' as const,
          actionable: false,
        }];
      }
    } catch (error) {
      console.error('Error generating health insights:', error);
      throw error;
    }
  }

  // Chat with AI assistant
  async chatWithAI(message: string, context: AIContext): Promise<string> {
    const systemPrompt = `
    You are Aarogya Sahayak, an AI health assistant for rural India. You help patients with:
    - Health advice and education
    - Symptom analysis
    - Medication reminders
    - Lifestyle recommendations
    - When to seek medical help
    
    Patient Context:
    - User ID: ${context.userId}
    - Diseases: ${context.diseases?.join(', ') || 'None reported'}
    - Recent Vitals: ${context.vitals ? JSON.stringify(context.vitals) : 'Not available'}
    - Language: ${context.language || 'English'}
    
    Guidelines:
    - Be empathetic and supportive
    - Use simple, clear language
    - Provide actionable advice
    - Always recommend consulting a doctor for serious concerns
    - Be culturally sensitive to Indian context
    - Encourage preventive healthcare
    `;

    const fullPrompt = `${systemPrompt}\n\nUser Message: ${message}`;

    try {
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error in AI chat:', error);
      throw error;
    }
  }

  // Parse medical documents
  async parseMedicalDocument(documentText: string): Promise<{
    extractedData: any;
    summary: string;
    recommendations: string[];
  }> {
    const prompt = `
    Parse the following medical document and extract key information:
    
    Document Text: ${documentText}
    
    Please extract:
    1. Patient demographics (age, gender if mentioned)
    2. Vital signs (BP, sugar, weight, etc.)
    3. Diagnoses
    4. Medications prescribed
    5. Test results
    6. Doctor recommendations
    
    Format as JSON with extractedData, summary, and recommendations fields.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch {
        return {
          extractedData: {},
          summary: text,
          recommendations: [],
        };
      }
    } catch (error) {
      console.error('Error parsing medical document:', error);
      throw error;
    }
  }

  // Generate medication reminders
  async generateMedicationReminders(medications: any[]): Promise<string[]> {
    const prompt = `
    Generate helpful medication reminders for these medications:
    ${JSON.stringify(medications)}
    
    Provide practical reminders about:
    - Timing
    - Food interactions
    - Side effects to watch
    - Storage instructions
    - When to contact doctor
    
    Return as array of reminder strings.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch {
        return [text];
      }
    } catch (error) {
      console.error('Error generating medication reminders:', error);
      throw error;
    }
  }

  // Generate emergency advice
  async generateEmergencyAdvice(symptoms: string, severity: 'low' | 'medium' | 'high' | 'critical'): Promise<{
    immediateActions: string[];
    whenToSeekHelp: string[];
    preventionTips: string[];
  }> {
    const prompt = `
    Provide emergency health advice for these symptoms: ${symptoms}
    Severity Level: ${severity}
    
    Please provide:
    1. Immediate actions to take
    2. When to seek medical help
    3. Prevention tips for future
    
    Format as JSON with immediateActions, whenToSeekHelp, and preventionTips arrays.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch {
        return {
          immediateActions: ['Stay calm and assess the situation'],
          whenToSeekHelp: ['If symptoms worsen or persist'],
          preventionTips: ['Follow medical advice and maintain healthy lifestyle'],
        };
      }
    } catch (error) {
      console.error('Error generating emergency advice:', error);
      throw error;
    }
  }

  // Translate text to regional language
  async translateToRegionalLanguage(text: string, targetLanguage: string): Promise<string> {
    const prompt = `
    Translate the following English text to ${targetLanguage}:
    
    Text: ${text}
    
    Keep the medical terminology accurate and culturally appropriate.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error translating text:', error);
      return text; // Return original text if translation fails
    }
  }
}

export const aiService = new AIService();

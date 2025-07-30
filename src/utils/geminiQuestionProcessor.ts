import { GoogleGenAI } from '@google/genai';
import type { Question } from '../types/Question';
import type { ExtractedQuestion } from '../types/PDFProcessor';

export interface ProcessingProgress {
  currentQuestion: number;
  totalQuestions: number;
  stage: 'extracting' | 'processing' | 'complete';
  currentQuestionText?: string;
}

export class GeminiQuestionProcessor {
  private ai: GoogleGenAI;
  private readonly GEMINI_MODEL = 'gemini-2.5-flash';

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
    console.log('🤖 Gemini Question Processor configurado con modelo:', this.GEMINI_MODEL);
  }

  /**
   * Procesa preguntas extraídas individualmente para obtener explicación y link
   */
  async processQuestionsIndividually(
    extractedQuestions: ExtractedQuestion[],
    startingQuestionNumber: number,
    onProgress?: (progress: ProcessingProgress) => void
  ): Promise<Question[]> {
    console.log(`🔄 Iniciando procesamiento individual de ${extractedQuestions.length} preguntas`);
    
    const processedQuestions: Question[] = [];
    
    for (let i = 0; i < extractedQuestions.length; i++) {
      const extractedQuestion = extractedQuestions[i];
      const questionNumber = startingQuestionNumber + i;
      
      // Notificar progreso
      if (onProgress) {
        onProgress({
          currentQuestion: i + 1,
          totalQuestions: extractedQuestions.length,
          stage: 'processing',
          currentQuestionText: extractedQuestion.question_text.substring(0, 100) + '...'
        });
      }
      
      console.log(`📝 Procesando pregunta ${i + 1}/${extractedQuestions.length}: ${extractedQuestion.question_text.substring(0, 50)}...`);
      
      try {
        // Procesar pregunta individual para obtener explicación y link
        const enhancedQuestion = await this.enhanceQuestionWithExplanation(extractedQuestion);
        
        // Crear la pregunta final con numeración correcta
        const finalQuestion: Question = {
          question_number: questionNumber,
          question_text: enhancedQuestion.question_text,
          options: enhancedQuestion.options.map(opt => ({
            option_letter: opt.option_letter,
            option_text: opt.option_text,
            is_correct: opt.is_correct
          })),
          requires_multiple_answers: enhancedQuestion.requires_multiple_answers,
          link: enhancedQuestion.link || '',
          explanation: enhancedQuestion.explanation || ''
        };
        
        processedQuestions.push(finalQuestion);
        
        console.log(`✅ Pregunta ${questionNumber} procesada exitosamente`);
        
        // Pequeña pausa para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`❌ Error procesando pregunta ${i + 1}:`, error);
        
        // En caso de error, crear la pregunta sin explicación mejorada
        const fallbackQuestion: Question = {
          question_number: questionNumber,
          question_text: extractedQuestion.question_text,
          options: extractedQuestion.options.map(opt => ({
            option_letter: opt.option_letter,
            option_text: opt.option_text,
            is_correct: opt.is_correct
          })),
          requires_multiple_answers: extractedQuestion.requires_multiple_answers,
          link: extractedQuestion.link || '',
          explanation: extractedQuestion.explanation || 'Explicación no disponible (error en procesamiento)'
        };
        
        processedQuestions.push(fallbackQuestion);
        console.log(`⚠️ Pregunta ${questionNumber} guardada sin explicación mejorada`);
      }
    }
    
    // Notificar finalización
    if (onProgress) {
      onProgress({
        currentQuestion: extractedQuestions.length,
        totalQuestions: extractedQuestions.length,
        stage: 'complete'
      });
    }
    
    console.log(`✅ Procesamiento individual completado: ${processedQuestions.length} preguntas procesadas`);
    return processedQuestions;
  }

  /**
   * Mejora una pregunta individual con explicación y link de referencia
   */
  private async enhanceQuestionWithExplanation(question: ExtractedQuestion): Promise<ExtractedQuestion> {
    const correctAnswers = question.options
      .filter(opt => opt.is_correct)
      .map(opt => `${opt.option_letter}) ${opt.option_text}`)
      .join(', ');

    const allOptions = question.options
      .map(opt => `${opt.option_letter}) ${opt.option_text}`)
      .join('\n');

    const prompt = `
You are an expert educational content creator. Given this exam question, provide a detailed explanation of why the correct answer is valid and include a reference link where students can learn more about this topic.

QUESTION:
${question.question_text}

OPTIONS:
${allOptions}

CORRECT ANSWER(S): ${correctAnswers}

Please provide a response in this EXACT JSON format:
{
  "explanation": "A detailed explanation of why the correct answer is right, including the reasoning and key concepts involved. Keep it educational and clear.",
  "link": "A relevant educational URL where students can learn more about this topic (use reputable sources like Wikipedia, educational institutions, or official documentation)"
}

REQUIREMENTS:
- Explanation must be comprehensive but concise (2-4 sentences)
- Link must be a real, accessible URL to a reputable source
- Response must be in English
- Provide ONLY the JSON response, no additional text
`;

    try {
      console.log('🤖 Enviando pregunta individual a Gemini para explicación...');
      
      const response = await this.ai.models.generateContent({
        model: this.GEMINI_MODEL,
        contents: [prompt],
      });

      const responseText = response.text;
      
      if (!responseText || responseText.trim() === '') {
        throw new Error('Respuesta vacía de Gemini');
      }

      console.log('📝 Respuesta de explicación recibida:', responseText.substring(0, 200) + '...');

      // Parsear la respuesta JSON
      const enhancement = this.parseEnhancementResponse(responseText);
      
      // Retornar la pregunta mejorada
      return {
        ...question,
        explanation: enhancement.explanation,
        link: enhancement.link
      };

    } catch (error) {
      console.error('❌ Error obteniendo explicación:', error);
      // Retornar la pregunta original si falla la mejora
      return question;
    }
  }

  /**
   * Parsea la respuesta de mejora de Gemini
   */
  private parseEnhancementResponse(responseText: string): { explanation: string; link: string } {
    try {
      // Limpiar la respuesta
      const cleanedText = responseText
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/gi, '')
        .trim();

      const parsed = JSON.parse(cleanedText);
      
      return {
        explanation: parsed.explanation || 'Explicación no disponible',
        link: parsed.link || ''
      };
    } catch (error) {
      console.error('❌ Error parseando respuesta de explicación:', error);
      return {
        explanation: 'Explicación no disponible (error en parseo)',
        link: ''
      };
    }
  }
}

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ExtractedQuestion } from '../types/PDFProcessor';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: ReturnType<GoogleGenerativeAI['getGenerativeModel']>;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    console.log('🤖 Gemini configurado con modelo: gemini-2.5-flash');
  }

  /**
   * Verifica que la conexión con Gemini funcione
   */
  async testConnection(): Promise<boolean> {
    try {
      const result = await this.model.generateContent('Test connection. Respond with: OK');
      const response = await result.response;
      const text = response.text();
      console.log('🔗 Test de conexión Gemini:', text);
      return text.includes('OK') || text.includes('ok');
    } catch (error) {
      console.error('❌ Test de conexión Gemini falló:', error);
      return false;
    }
  }

  /**
   * Hace una llamada a Gemini con reintentos automáticos
   */
  private async callGeminiWithRetry(prompt: string, maxRetries: number = 3): Promise<string> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Intento ${attempt}/${maxRetries} - Llamando a Gemini...`);
        
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();
        
        console.log(`✅ Intento ${attempt} exitoso`);
        return responseText;
        
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const isOverloaded = errorMessage.includes('overloaded') || errorMessage.includes('503');
        const isRateLimit = errorMessage.includes('429') || errorMessage.includes('quota');
        
        if ((isOverloaded || isRateLimit) && attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          console.log(`⏳ Intento ${attempt} falló (sobrecarga), reintentando en ${delay}ms...`);
          await this.sleep(delay);
          continue;
        }
        
        console.error(`❌ Intento ${attempt} falló definitivamente:`, error);
        throw error;
      }
    }
    
    throw new Error('Todos los reintentos fallaron');
  }

  /**
   * Utility para esperar
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Procesa texto y extrae preguntas estructuradas con mejor debugging
   */
  async extractQuestionsFromText(text: string): Promise<ExtractedQuestion[]> {
    const prompt = this.buildQuestionExtractionPrompt(text);
    
    console.log('🤖 Enviando a Gemini:', {
      textLength: text.length,
      textPreview: text.substring(0, 200) + '...'
    });
    
    try {
      const responseText = await this.callGeminiWithRetry(prompt);
      
      console.log('📨 Respuesta de Gemini:', {
        responseLength: responseText.length,
        responsePreview: responseText.substring(0, 300) + '...'
      });
      
      if (!responseText || responseText.trim() === '') {
        console.error('❌ Gemini devolvió respuesta vacía');
        return [];
      }
      
      const extractedData = this.parseQuestionResponse(responseText);
      
      console.log('✅ Preguntas parseadas:', extractedData.length);
      
      return extractedData.map(q => ({
        ...q,
        id: this.generateQuestionId(),
        confidence: 0.8,
        source: 'text' as const,
        needsReview: false
      }));
    } catch (error) {
      console.error('❌ Error extracting questions:', error);
      throw new Error(`Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Genera explicación para una pregunta
   */
  async generateExplanation(questionText: string, correctAnswers: string[]): Promise<string> {
    const prompt = `
Genera una explicación clara y concisa para esta pregunta de examen:

PREGUNTA: ${questionText}
RESPUESTA(S) CORRECTA(S): ${correctAnswers.join(', ')}

Requisitos:
- Explicación en español
- Máximo 200 palabras
- Enfoque educativo
- Incluye el "por qué" es correcta la respuesta

Responde solo con la explicación, sin formato adicional:
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error generating explanation:', error);
      return 'No se pudo generar explicación automáticamente.';
    }
  }

  /**
   * Busca y sugiere links de referencia
   */
  async findReferenceLinks(questionText: string, subject?: string): Promise<string> {
    const prompt = `
Para esta pregunta de examen, sugiere un link de referencia oficial o educativo confiable:

PREGUNTA: ${questionText}
${subject ? `MATERIA: ${subject}` : ''}

Requisitos:
- Solo URLs oficiales (documentación, sitios educativos reconocidos)
- Preferir: Wikipedia, sitios .edu, documentación oficial
- Si no encuentras algo específico, sugiere una búsqueda en Google
- Responde solo con la URL, sin explicaciones

URL sugerida:
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const suggestedUrl = response.text().trim();
      
      // Validar que sea una URL válida
      if (this.isValidUrl(suggestedUrl)) {
        return suggestedUrl;
      } else {
        // Fallback a búsqueda de Google
        const searchQuery = encodeURIComponent(questionText.substring(0, 100));
        return `https://www.google.com/search?q=${searchQuery}`;
      }
    } catch (error) {
      console.error('Error finding reference:', error);
      const searchQuery = encodeURIComponent(questionText.substring(0, 100));
      return `https://www.google.com/search?q=${searchQuery}`;
    }
  }

  /**
   * Mejora una pregunta extraída por OCR
   */
  async improveOCRQuestion(rawText: string): Promise<ExtractedQuestion | null> {
    const prompt = `
Analiza este texto extraído por OCR y conviértelo en una pregunta de examen estructurada:

TEXTO OCR: ${rawText}

Tareas:
1. Corregir errores de OCR comunes
2. Identificar la pregunta principal
3. Extraer las opciones de respuesta
4. Determinar cuál(es) es(son) correcta(s)
5. Generar una explicación breve

Responde en formato JSON exacto:
{
  "question_text": "pregunta corregida",
  "options": [
    {"option_letter": "A", "option_text": "opción A", "is_correct": false},
    {"option_letter": "B", "option_text": "opción B", "is_correct": true}
  ],
  "requires_multiple_answers": false,
  "explanation": "explicación breve",
  "link": ""
}

Si no puedes extraer una pregunta válida, responde: null
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const jsonText = response.text().trim();
      
      if (jsonText === 'null') {
        return null;
      }

      const parsedQuestion = JSON.parse(jsonText);
      
      return {
        ...parsedQuestion,
        id: this.generateQuestionId(),
        confidence: 0.6, // Menor confianza para OCR
        source: 'ocr' as const,
        needsReview: true
      };
    } catch (error) {
      console.error('Error improving OCR question:', error);
      return null;
    }
  }

  /**
   * Construye el prompt para extracción de preguntas - VERSIÓN SIMPLIFICADA
   */
  private buildQuestionExtractionPrompt(text: string): string {
    return `
Extrae TODAS las preguntas de examen del siguiente texto y devuelve SOLO un JSON array válido.

TEXTO:
${text.substring(0, 4000)} ${text.length > 4000 ? '...[texto truncado]' : ''}

IMPORTANTE: 
- Responde ÚNICAMENTE con JSON válido
- No agregues explicaciones antes o después del JSON
- Si no encuentras preguntas, responde: []

FORMATO JSON REQUERIDO:
[
  {
    "question_text": "pregunta completa aquí",
    "options": [
      {"option_letter": "A", "option_text": "opción A", "is_correct": false},
      {"option_letter": "B", "option_text": "opción B", "is_correct": true},
      {"option_letter": "C", "option_text": "opción C", "is_correct": false},
      {"option_letter": "D", "option_text": "opción D", "is_correct": false}
    ],
    "requires_multiple_answers": false,
    "explanation": "explicación breve",
    "link": ""
  }
]
`;
  }

  /**
   * Método de respaldo cuando el prompt principal no funciona
   */
  async extractQuestionsWithFallback(text: string): Promise<ExtractedQuestion[]> {
    try {
      // Primer intento con prompt principal
      const questions = await this.extractQuestionsFromText(text);
      if (questions.length > 0) {
        return questions;
      }
    } catch (error) {
      console.log('Prompt principal falló, intentando con prompt simplificado:', error);
    }

    // Segundo intento con prompt más simple
    const simplifiedPrompt = `
Extrae preguntas de examen del siguiente texto. Busca patrones como:
- Preguntas numeradas (1., 2., etc.)
- Opciones múltiples (A), B), C), D))
- Texto que termine en "?"

TEXTO:
${text}

Responde solo con JSON array:
[{"question_text": "pregunta", "options": [{"option_letter": "A", "option_text": "opción", "is_correct": true}], "requires_multiple_answers": false, "explanation": "", "link": ""}]

Si no hay preguntas, responde: []
`;

    try {
      const responseText = await this.callGeminiWithRetry(simplifiedPrompt);
      return this.parseQuestionResponse(responseText);
    } catch (error) {
      console.error('Todos los métodos de extracción fallaron:', error);
      return [];
    }
  }
  /**
   * Parsea la respuesta JSON de Gemini con mejor debugging
   */
  private parseQuestionResponse(responseText: string): ExtractedQuestion[] {
    console.log('🔍 Parseando respuesta de Gemini...');
    
    try {
      // Limpiar la respuesta de posibles caracteres extra
      const cleanedText = responseText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .replace(/^[^[{]+/, '') // Remover texto antes del JSON
        .replace(/[^}\]]+$/, '') // Remover texto después del JSON
        .trim();

      console.log('🧹 Texto limpiado:', {
        original: responseText.length,
        cleaned: cleanedText.length,
        cleanedPreview: cleanedText.substring(0, 200) + '...'
      });

      // Intentar parsear JSON
      const parsed = JSON.parse(cleanedText);
      
      if (Array.isArray(parsed)) {
        console.log('✅ JSON parseado correctamente:', parsed.length, 'elementos');
        return parsed;
      } else if (parsed && typeof parsed === 'object') {
        console.log('📦 JSON es objeto, convirtiendo a array');
        return [parsed];
      } else {
        console.error('❌ JSON no es array ni objeto válido:', typeof parsed);
        return [];
      }
      
    } catch (error) {
      console.error('❌ Error parsing JSON:', error);
      console.log('📝 Respuesta original que falló:', responseText);
      
      // Intentar extraer manualmente si el JSON falla
      return this.fallbackTextExtraction(responseText);
    }
  }

  /**
   * Extracción manual como fallback cuando JSON falla
   */
  private fallbackTextExtraction(text: string): ExtractedQuestion[] {
    console.log('🔄 Intentando extracción manual...');
    
    // Buscar patrones básicos de preguntas
    const questionMatches = text.match(/question[_\s]*text["\s]*:[\s]*["']([^"']+)["']/gi);
    
    if (questionMatches && questionMatches.length > 0) {
      console.log('🎯 Encontradas', questionMatches.length, 'preguntas con extracción manual');
      
      return questionMatches.map((match) => ({
        id: this.generateQuestionId(),
        question_text: match.replace(/question[_\s]*text["\s]*:[\s]*["']/, '').replace(/["']$/, ''),
        options: [
          { option_letter: "A", option_text: "Opción A (extraída manualmente)", is_correct: true },
          { option_letter: "B", option_text: "Opción B (extraída manualmente)", is_correct: false }
        ],
        requires_multiple_answers: false,
        explanation: "Pregunta extraída mediante fallback manual",
        link: "",
        confidence: 0.3,
        source: 'text' as const,
        needsReview: true
      }));
    }
    
    console.log('❌ Extracción manual también falló');
    return [];
  }

  /**
   * Genera un ID único para la pregunta
   */
  private generateQuestionId(): string {
    return `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Valida si una cadena es una URL válida
   */
  private isValidUrl(string: string): boolean {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verifica si la API key está configurada
   */
  static isConfigured(): boolean {
    return !!(import.meta.env.VITE_GEMINI_API_KEY && 
             import.meta.env.VITE_GEMINI_API_KEY !== 'your_gemini_api_key_here');
  }

  /**
   * Obtiene información sobre los límites de uso
   */
  static getUsageLimits() {
    return {
      freeQuota: {
        requestsPerMinute: 60,
        requestsPerDay: 1500,
        tokensPerMonth: 1000000
      },
      recommendation: 'Procesa en lotes pequeños para evitar límites'
    };
  }
}

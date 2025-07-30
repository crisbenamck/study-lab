import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ExtractedQuestion } from '../types/PDFProcessor';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: ReturnType<GoogleGenerativeAI['getGenerativeModel']>;
  private currentModelIndex: number = 0;
  private readonly FALLBACK_MODELS = [
    'gemini-2.5-pro',
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash-15',
    'gemini-2.0-flash-lite'
  ];

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: this.FALLBACK_MODELS[0] });
    console.log('🤖 Gemini configurado con modelo inicial:', this.FALLBACK_MODELS[0]);
  }

  /**
   * Cambia al siguiente modelo en caso de error de cuota
   */
  private switchToNextModel(): boolean {
    if (this.currentModelIndex < this.FALLBACK_MODELS.length - 1) {
      this.currentModelIndex++;
      const newModel = this.FALLBACK_MODELS[this.currentModelIndex];
      this.model = this.genAI.getGenerativeModel({ model: newModel });
      console.log('🔄 Cambiando a modelo de respaldo:', newModel);
      return true;
    }
    return false;
  }

  /**
   * Verifica si el error es de límite de cuota
   */
  private isQuotaExceededError(error: unknown): boolean {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return errorMessage.includes('429') || 
           errorMessage.includes('quota') || 
           errorMessage.includes('requests per day') ||
           errorMessage.includes('QUOTA_EXCEEDED') ||
           errorMessage.includes('Resource has been exhausted');
  }

  /**
   * Obtiene el modelo actual
   */
  getCurrentModel(): string {
    return this.FALLBACK_MODELS[this.currentModelIndex];
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
   * Hace una llamada a Gemini con reintentos automáticos y fallback de modelos
   */
  private async callGeminiWithRetry(prompt: string, maxRetries: number = 3): Promise<string> {
    let lastError: unknown = null;

    // Intentar con cada modelo disponible
    for (let modelAttempt = this.currentModelIndex; modelAttempt < this.FALLBACK_MODELS.length; modelAttempt++) {
      // Asegurar que estamos usando el modelo correcto
      if (modelAttempt !== this.currentModelIndex) {
        this.currentModelIndex = modelAttempt;
        this.model = this.genAI.getGenerativeModel({ model: this.FALLBACK_MODELS[this.currentModelIndex] });
        console.log(`🔄 Probando con modelo: ${this.FALLBACK_MODELS[this.currentModelIndex]}`);
      }

      // Intentar con el modelo actual
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`🔄 Modelo ${this.getCurrentModel()} - Intento ${attempt}/${maxRetries}`);
          
          const result = await this.model.generateContent(prompt);
          const response = await result.response;
          const responseText = response.text();
          
          console.log(`✅ Exitoso con modelo ${this.getCurrentModel()} en intento ${attempt}`);
          return responseText;
          
        } catch (error: unknown) {
          lastError = error;
          const errorMessage = error instanceof Error ? error.message : String(error);
          
          console.log(`❌ Error con modelo ${this.getCurrentModel()}, intento ${attempt}:`, errorMessage);

          // Si es error de cuota, intentar con el siguiente modelo inmediatamente
          if (this.isQuotaExceededError(error)) {
            console.log(`🚫 Error de cuota detectado con modelo ${this.getCurrentModel()}`);
            break; // Salir del loop de reintentos y probar siguiente modelo
          }

          // Si es error de sobrecarga, esperar y reintentar con el mismo modelo
          const isOverloaded = errorMessage.includes('overloaded') || errorMessage.includes('503');
          if (isOverloaded && attempt < maxRetries) {
            const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
            console.log(`⏳ Modelo sobrecargado, reintentando en ${delay}ms...`);
            await this.sleep(delay);
            continue;
          }

          // Para otros errores, reintentar hasta maxRetries
          if (attempt < maxRetries && !this.isQuotaExceededError(error)) {
            const delay = 1000 * attempt; // 1s, 2s, 3s
            console.log(`⏳ Reintentando en ${delay}ms...`);
            await this.sleep(delay);
            continue;
          }
        }
      }

      // Si llegamos aquí, el modelo actual falló, intentar siguiente
      console.log(`❌ Modelo ${this.getCurrentModel()} agotado, probando siguiente modelo...`);
    }
    
    // Todos los modelos fallaron
    console.error('❌ Todos los modelos de Gemini han fallado');
    throw new Error(`Todos los modelos de Gemini fallaron. Último error: ${lastError instanceof Error ? lastError.message : 'Error desconocido'}`);
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
   * Obtiene información sobre los límites de uso y modelo fallback
   */
  static getUsageLimits() {
    return {
      freeQuota: {
        requestsPerMinute: 60,
        requestsPerDay: 1500,
        tokensPerMonth: 1000000
      },
      fallbackModels: [
        'gemini-2.5-pro',
        'gemini-2.5-flash', 
        'gemini-2.5-flash-lite',
        'gemini-2.0-flash-15',
        'gemini-2.0-flash-lite'
      ],
      recommendation: 'El sistema cambiará automáticamente de modelo si se agota la cuota'
    };
  }

  /**
   * Obtiene el estado actual del sistema de fallback
   */
  getFallbackStatus() {
    return {
      currentModel: this.getCurrentModel(),
      currentModelIndex: this.currentModelIndex,
      totalModels: this.FALLBACK_MODELS.length,
      remainingModels: this.FALLBACK_MODELS.length - this.currentModelIndex - 1,
      availableModels: this.FALLBACK_MODELS.slice(this.currentModelIndex + 1)
    };
  }

  /**
   * Analiza directamente una imagen usando Gemini Vision para extraer preguntas
   * Basado en la documentación: https://ai.google.dev/gemini-api/docs/document-processing
   */
  async extractQuestionsFromImage(imageData: string): Promise<ExtractedQuestion[]> {
    console.log('🔍 Iniciando análisis de imagen con Gemini Vision...');
    
    // Convertir base64 a formato que acepta Gemini
    const imageBase64 = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
    
    const prompt = `
Analiza esta imagen que contiene preguntas de examen y extrae TODAS las preguntas que encuentres.

INSTRUCCIONES IMPORTANTES:
1. Extrae CADA pregunta visible en la imagen
2. Para cada pregunta, identifica TODAS las opciones de respuesta (A, B, C, D, E, etc.)
3. Determina cuál(es) opción(es) es/son correcta(s) si está marcado o indicado
4. Si no puedes determinar la respuesta correcta, marca la primera opción como correcta

Formato de respuesta (JSON array):
[
  {
    "question_text": "Texto completo de la pregunta",
    "options": [
      {"option_letter": "A", "option_text": "Texto de la opción A", "is_correct": false},
      {"option_letter": "B", "option_text": "Texto de la opción B", "is_correct": true},
      {"option_letter": "C", "option_text": "Texto de la opción C", "is_correct": false}
    ],
    "requires_multiple_answers": false,
    "explanation": "",
    "link": ""
  }
]

IMPORTANTE: Responde SOLO con el JSON array, sin texto adicional.
`;

    try {
      const result = await this.model.generateContent([
        {
          inlineData: {
            data: imageBase64,
            mimeType: "image/png"
          }
        },
        prompt
      ]);

      const response = await result.response;
      const text = response.text();
      console.log('📝 Respuesta de Gemini Vision:', text.substring(0, 200) + '...');

      // Usar el método existente de parsing
      const questions = this.parseQuestionResponse(text);

      console.log(`✅ Gemini Vision extrajo ${questions.length} preguntas de la imagen`);
      
      // Actualizar metadatos para Vision
      return questions.map((q, index) => ({
        ...q,
        id: `gemini_vision_${Date.now()}_${index}`,
        confidence: 0.8, // Alta confianza para Gemini Vision
        source: 'ocr' as const,
        explanation: q.explanation || 'Extraído mediante Gemini Vision',
        needsReview: false
      }));

    } catch (error) {
      console.error('❌ Error en Gemini Vision:', error);
      throw new Error(`Error procesando imagen con Gemini Vision: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}

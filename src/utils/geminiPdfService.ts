import { GoogleGenAI, createPartFromUri } from '@google/genai';
import type { ExtractedQuestion } from '../types/PDFProcessor';

export class GeminiPdfService {
  private ai: GoogleGenAI;
  private currentModelIndex: number = 0;
  private readonly FALLBACK_MODELS = [
    'gemini-2.5-pro',
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash-15',
    'gemini-2.0-flash-lite'
  ];
  private onRetryProgress?: (modelIndex: number, attempt: number, model: string, isRetrying: boolean) => void;

  constructor(apiKey: string, onRetryProgress?: (modelIndex: number, attempt: number, model: string, isRetrying: boolean) => void) {
    this.ai = new GoogleGenAI({ apiKey });
    this.onRetryProgress = onRetryProgress;
    console.log('🤖 GeminiPdfService configurado con modelo inicial:', this.FALLBACK_MODELS[0]);
  }

  /**
   * Verifica si el error es temporal y permite reintentos
   */
  private isRetryableError(error: unknown): boolean {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return errorMessage.includes('overloaded') || 
           errorMessage.includes('503') || 
           errorMessage.includes('502') ||
           errorMessage.includes('UNAVAILABLE') ||
           errorMessage.includes('temporarily');
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
   * Utility para esperar
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Obtiene el modelo actual
   */
  getCurrentModel(): string {
    return this.FALLBACK_MODELS[this.currentModelIndex];
  }

  /**
   * Hace una llamada a Gemini con reintentos automáticos y fallback de modelos
   */
  private async callGeminiWithRetry(content: (string | ReturnType<typeof createPartFromUri>)[], maxRetries: number = 3): Promise<string> {
    let lastError: unknown = null;

    // Intentar con cada modelo disponible
    for (let modelAttempt = this.currentModelIndex; modelAttempt < this.FALLBACK_MODELS.length; modelAttempt++) {
      // Asegurar que estamos usando el modelo correcto
      if (modelAttempt !== this.currentModelIndex) {
        this.currentModelIndex = modelAttempt;
        console.log(`🔄 Probando con modelo: ${this.FALLBACK_MODELS[this.currentModelIndex]}`);
      }

      // Intentar con el modelo actual
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`🔄 Modelo ${this.getCurrentModel()} - Intento ${attempt}/${maxRetries}`);
          
          // Notificar progreso si hay callback
          if (this.onRetryProgress) {
            this.onRetryProgress(modelAttempt, attempt, this.getCurrentModel(), true);
          }
          
          const response = await this.ai.models.generateContent({
            model: this.getCurrentModel(),
            contents: content,
          });
          
          const responseText = response.text;
          
          if (!responseText || responseText.trim() === '') {
            throw new Error('Gemini devolvió una respuesta vacía');
          }
          
          console.log(`✅ Exitoso con modelo ${this.getCurrentModel()} en intento ${attempt}`);
          return responseText;
          
        } catch (error: unknown) {
          lastError = error;
          const errorMessage = error instanceof Error ? error.message : String(error);
          
          console.log(`❌ Error con modelo ${this.getCurrentModel()}, intento ${attempt}:`, errorMessage);

          // Notificar error si hay callback
          if (this.onRetryProgress && attempt === maxRetries) {
            this.onRetryProgress(modelAttempt, attempt, this.getCurrentModel(), false);
          }

          // Si es error de cuota, intentar con el siguiente modelo inmediatamente
          if (this.isQuotaExceededError(error)) {
            console.log(`🚫 Error de cuota detectado con modelo ${this.getCurrentModel()}`);
            break; // Salir del loop de reintentos y probar siguiente modelo
          }

          // Si es error de sobrecarga o temporal, esperar y reintentar con el mismo modelo
          if (this.isRetryableError(error) && attempt < maxRetries) {
            const delay = Math.pow(2, attempt) * 2000; // 4s, 8s, 16s
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
   * Procesa un archivo PDF directamente con Gemini sin costo adicional
   */
  async extractQuestionsFromPDF(file: File): Promise<ExtractedQuestion[]> {
    console.log('📄 Iniciando procesamiento directo de PDF con Gemini...');
    
    try {
      // Subir el archivo PDF a Gemini
      console.log('📤 Subiendo PDF a Gemini...');
      const uploadedFile = await this.ai.files.upload({
        file: file,
        config: {
          displayName: file.name,
        },
      });

      // Esperar a que el archivo sea procesado
      console.log('⏳ Esperando procesamiento del archivo...');
      
      if (!uploadedFile.name) {
        throw new Error('No se obtuvo el nombre del archivo subido');
      }
      
      let fileStatus = await this.ai.files.get({ name: uploadedFile.name });
      
      while (fileStatus.state === 'PROCESSING') {
        console.log(`📊 Estado del archivo: ${fileStatus.state}`);
        await new Promise((resolve) => {
          setTimeout(resolve, 2000); // Esperar 2 segundos
        });
        fileStatus = await this.ai.files.get({ name: uploadedFile.name });
      }

      if (fileStatus.state === 'FAILED') {
        throw new Error('El procesamiento del archivo falló en Gemini');
      }

      console.log('✅ Archivo procesado exitosamente');

      // Crear el prompt para extraer preguntas
      const prompt = `
Analyze this PDF document and extract ALL exam questions you find.

INSTRUCTIONS:
1. Look for questions throughout the ENTIRE document
2. Identify answer options (A, B, C, D, etc.)
3. If you cannot determine the correct answer, mark the first one as correct
4. Extract maximum 50 questions to avoid very long responses
5. ALL extracted content must be in English only

REQUIRED JSON FORMAT:
[
  {
    "question_text": "What is the capital of France?",
    "options": [
      {"option_letter": "A", "option_text": "Madrid", "is_correct": false},
      {"option_letter": "B", "option_text": "Paris", "is_correct": true},
      {"option_letter": "C", "option_text": "London", "is_correct": false}
    ],
    "requires_multiple_answers": false,
    "explanation": "",
    "link": ""
  }
]

IMPORTANT: 
- Respond ONLY with the JSON array
- Do not add text before or after the JSON
- ALL text must be in English
- If no questions are found, respond: []
`;

      // Preparar el contenido para la solicitud
      const content: (string | ReturnType<typeof createPartFromUri>)[] = [prompt];

      if (fileStatus.uri && fileStatus.mimeType) {
        const fileContent = createPartFromUri(fileStatus.uri, fileStatus.mimeType);
        content.push(fileContent);
      } else {
        throw new Error('No se pudo obtener la URI del archivo procesado');
      }

      // Generar respuesta con Gemini usando reintentos y fallback
      console.log('🤖 Generando análisis con Gemini con reintentos automáticos...');
      console.log('📄 Enviando contenido:', { 
        promptLength: prompt.length, 
        hasFileContent: !!fileStatus.uri,
        fileUri: fileStatus.uri?.substring(0, 50) + '...'
      });
      
      const startTime = Date.now();
      
      try {
        console.log('⏳ Enviando solicitud a Gemini con sistema de reintentos...');
        
        // Usar el sistema de reintentos con timeout
        const timeoutPromise = new Promise<string>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout: Gemini tardó más de 5 minutos')), 300000)
        );
        
        const geminiPromise = this.callGeminiWithRetry(content);
        
        const responseText = await Promise.race([geminiPromise, timeoutPromise]);
        
        const endTime = Date.now();
        console.log(`⏱️ Gemini respondió exitosamente en ${endTime - startTime}ms`);
        
        console.log('📝 Respuesta de Gemini PDF recibida:', {
          length: responseText.length,
          preview: responseText.substring(0, 300) + '...',
          endsWithBracket: responseText.trim().endsWith(']'),
          startsWithBracket: responseText.trim().startsWith('[')
        });

        // Parsear la respuesta JSON
        const questions = this.parseQuestionsResponse(responseText);
        
        console.log(`✅ Extraídas ${questions.length} preguntas del PDF completo`);

        // Limpiar el archivo temporal (opcional)
        try {
          if (uploadedFile.name) {
            await this.ai.files.delete({ name: uploadedFile.name });
            console.log('🗑️ Archivo temporal eliminado de Gemini');
          }
        } catch (cleanupError) {
          console.warn('⚠️ No se pudo eliminar el archivo temporal:', cleanupError);
        }

        return questions;
        
      } catch (genError) {
        console.error('❌ Error específico de Gemini:', genError);
        
        // Intentar limpiar archivo en caso de error
        try {
          if (uploadedFile.name) {
            await this.ai.files.delete({ name: uploadedFile.name });
            console.log('🗑️ Archivo temporal eliminado tras error');
          }
        } catch (cleanupError) {
          console.warn('⚠️ No se pudo eliminar archivo tras error:', cleanupError);
        }
        
        // Re-lanzar el error con más contexto
        throw new Error(`Error en generación de Gemini: ${genError instanceof Error ? genError.message : 'Error desconocido'}`);
      }

    } catch (error) {
      console.error('❌ Error en procesamiento de PDF con Gemini:', error);
      throw new Error(`Error procesando PDF: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Parsea la respuesta JSON de Gemini
   */
  private parseQuestionsResponse(responseText: string): ExtractedQuestion[] {
    console.log('🔍 Iniciando parseo de respuesta...');
    console.log('📄 Respuesta completa de Gemini:', responseText);
    
    try {
      // Limpiar la respuesta
      let cleanedText = responseText
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/gi, '')
        .trim();

      // Detectar si el JSON está incompleto
      if (cleanedText.endsWith('...') || cleanedText.endsWith('"')) {
        console.log('⚠️ JSON parece estar truncado, intentando completar...');
        // Si termina con una comilla, probablemente se cortó a mitad de una respuesta
        if (cleanedText.lastIndexOf('[') > cleanedText.lastIndexOf(']')) {
          // Cerrar el array si está abierto
          if (!cleanedText.trim().endsWith(']')) {
            cleanedText = cleanedText.trim();
            // Remover la última coma si existe
            if (cleanedText.endsWith(',')) {
              cleanedText = cleanedText.slice(0, -1);
            }
            cleanedText += ']';
            console.log('🔧 JSON completado automáticamente');
          }
        }
      }

      // Buscar el array JSON más completo
      if (!cleanedText.startsWith('[')) {
        // Remover texto antes del primer [
        const firstBracket = cleanedText.indexOf('[');
        if (firstBracket !== -1) {
          cleanedText = cleanedText.substring(firstBracket);
        }
      }

      // Validar que terminemos en ] y no en texto adicional
      const lastBracket = cleanedText.lastIndexOf(']');
      if (lastBracket !== -1 && lastBracket < cleanedText.length - 1) {
        // Cortar después del último ]
        cleanedText = cleanedText.substring(0, lastBracket + 1);
      }

      console.log('🧹 Texto limpio para parsear:', cleanedText.substring(0, 500) + '...');

      // Si no encuentra JSON válido, intentar extraer manualmente
      if (!cleanedText.startsWith('[')) {
        console.log('⚠️ No se detectó JSON válido, buscando array en el texto...');
        // Buscar diferentes patrones de JSON
        const patterns = [
          /\[[\s\S]*?\]/g,  // Array básico
          /```json\s*(\[[\s\S]*?\])\s*```/gi,  // JSON en markdown
          /JSON:\s*(\[[\s\S]*?\])/gi,  // JSON con prefijo
          /(\[[\s\S]*?\])/g  // Cualquier array
        ];
        
        let found = false;
        for (const pattern of patterns) {
          const matches = responseText.match(pattern);
          if (matches && matches.length > 0) {
            // Tomar el match más largo (probablemente el más completo)
            cleanedText = matches.reduce((longest, current) => 
              current.length > longest.length ? current : longest, '');
            
            // Limpiar el resultado
            cleanedText = cleanedText
              .replace(/```json\s*/gi, '')
              .replace(/```\s*/gi, '')
              .replace(/JSON:\s*/gi, '')
              .trim();
              
            console.log('🔄 JSON extraído del texto:', cleanedText.substring(0, 200) + '...');
            found = true;
            break;
          }
        }
        
        if (!found) {
          console.error('❌ No se encontró JSON válido en la respuesta');
          console.error('📄 Respuesta completa para debug:', responseText);
          return [];
        }
      }

      const questionsData = JSON.parse(cleanedText);

      if (!Array.isArray(questionsData)) {
        console.error('❌ La respuesta no es un array válido:', typeof questionsData);
        return [];
      }

      console.log(`📊 Array parseado exitosamente con ${questionsData.length} elementos`);

      // Convertir a formato ExtractedQuestion
      const questions: ExtractedQuestion[] = questionsData.map((q: {
        question_text?: string;
        options?: Array<{option_letter: string; option_text: string; is_correct: boolean}>;
        requires_multiple_answers?: boolean;
        explanation?: string;
        link?: string;
        page_number?: number;
      }, index: number) => {
        console.log(`🔍 Procesando pregunta ${index + 1}:`, {
          question_text: q.question_text?.substring(0, 50) + '...',
          options_count: q.options?.length || 0,
          requires_multiple_answers: q.requires_multiple_answers
        });

        return {
          id: `gemini_pdf_${Date.now()}_${index}`,
          question_text: q.question_text || '',
          options: (q.options || []).map(opt => ({
            option_letter: opt.option_letter || '',
            option_text: opt.option_text || '',
            is_correct: opt.is_correct || false
          })),
          requires_multiple_answers: q.requires_multiple_answers || false,
          explanation: q.explanation || 'Extraído directamente del PDF con Gemini',
          link: q.link || '',
          confidence: 0.9, // Alta confianza para procesamiento directo
          source: 'text' as const,
          needsReview: false,
          page_number: q.page_number || 1
        };
      });

      console.log(`✅ Se procesaron exitosamente ${questions.length} preguntas`);
      
      return questions.filter(q => q.question_text && q.options.length >= 2);

    } catch (error) {
      console.error('❌ Error al parsear respuesta JSON:', error);
      console.error('📄 Texto completo que falló:', responseText);
      
      // Mostrar información de debug adicional
      if (error instanceof SyntaxError) {
        console.error('🔍 Error de sintaxis JSON:', error.message);
        const syntaxError = error as SyntaxError & { position?: number };
        console.error('🔍 Posición del error:', syntaxError.position || 'No disponible');
      }
      
      throw new Error('No se pudo parsear la respuesta de Gemini como JSON válido');
    }
  }

  /**
   * Verifica si la API key está configurada
   */
  static isConfigured(apiKey: string): boolean {
    return Boolean(apiKey && 
                   apiKey.trim() !== '' && 
                   apiKey !== 'your_gemini_api_key_here');
  }
}

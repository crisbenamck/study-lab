import { GoogleGenAI, createPartFromUri } from '@google/genai';
import type { ExtractedQuestion } from '../types/PDFProcessor';

export class GeminiPdfService {
  private ai: GoogleGenAI;
  private readonly GEMINI_MODEL = 'gemini-2.5-flash';

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
    console.log('🤖 Gemini PDF Service configurado con modelo:', this.GEMINI_MODEL);
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

      // Generar respuesta con Gemini
      console.log('🤖 Generando análisis con Gemini...');
      console.log('📄 Enviando contenido:', { 
        promptLength: prompt.length, 
        hasFileContent: !!fileStatus.uri,
        fileUri: fileStatus.uri?.substring(0, 50) + '...'
      });
      
      const startTime = Date.now();
      
      try {
        console.log('⏳ Enviando solicitud a Gemini...');
        
        // Crear timeout para evitar colgado
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout: Gemini tardó más de 2 minutos')), 120000)
        );
        
        const geminiPromise = this.ai.models.generateContent({
          model: this.GEMINI_MODEL,
          contents: content,
        });
        
        const response = await Promise.race([geminiPromise, timeoutPromise]);
        
        const endTime = Date.now();
        console.log(`⏱️ Gemini respondió en ${endTime - startTime}ms`);

        const responseText = (response as { text: string }).text;
        
        if (!responseText || responseText.trim() === '') {
          console.error('❌ Respuesta vacía de Gemini');
          throw new Error('Gemini devolvió una respuesta vacía');
        }
        
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

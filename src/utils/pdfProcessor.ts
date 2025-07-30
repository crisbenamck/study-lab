import * as pdfjsLib from 'pdfjs-dist';
import { createWorker, PSM } from 'tesseract.js';
import type { PDFPage, PDFProcessingResult, ProcessingProgress, ExtractedQuestion } from '../types/PDFProcessor';
import { GeminiService } from './geminiService';

// Configurar worker para PDF.js con mejor manejo de errores
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
} catch (error) {
  console.warn('Worker local no disponible, usando fallback:', error);
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

// Configurar opciones de PDF.js para mejor compatibilidad
const PDF_OPTIONS = {
  standardFontDataUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/standard_fonts/',
  cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
  cMapPacked: true,
  disableFontFace: false,
  disableRange: false,
  disableStream: false,
  isEvalSupported: false,
  maxImageSize: 1024 * 1024,
  verbosity: 0 // Reducir logs de debug
};

export class PDFProcessorService {
  private geminiService: GeminiService | null = null;
  private onProgress?: (progress: ProcessingProgress) => void;
  private onQuestionExtracted?: (question: ExtractedQuestion, pageNumber: number) => void;

  constructor(geminiApiKey?: string) {
    if (geminiApiKey && geminiApiKey.trim() !== '') {
      console.log('🔑 Configurando Gemini con API key...');
      this.geminiService = new GeminiService(geminiApiKey);
      console.log('✅ Gemini configurado correctamente');
    } else {
      console.log('⚠️ No se proporcionó API key de Gemini, funcionará sin IA');
    }
  }

  /**
   * Obtiene información básica del PDF sin procesarlo
   */
  async getPDFInfo(file: File): Promise<{ totalPages: number; fileSize: number }> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer, ...PDF_OPTIONS }).promise;
    
    return {
      totalPages: pdf.numPages,
      fileSize: file.size
    };
  }

  /**
   * Procesa un archivo PDF completo o una página específica
   */
  async processPDF(
    file: File, 
    onProgress?: (progress: ProcessingProgress) => void,
    specificPage?: number,
    onQuestionExtracted?: (question: ExtractedQuestion, pageNumber: number) => void
  ): Promise<PDFProcessingResult> {
    this.onProgress = onProgress;
    this.onQuestionExtracted = onQuestionExtracted;
    const startTime = Date.now();

    try {
      // Validar archivo
      this.validateFile(file);

      // Cargar PDF
      this.updateProgress(0, 0, 'analyzing', 'Analizando archivo PDF...');
      const pdf = await this.loadPDF(file);
      const totalPages = pdf.numPages;
      
      // Determinar qué páginas procesar
      let pagesToProcess: number[];
      if (specificPage && specificPage > 0 && specificPage <= totalPages) {
        pagesToProcess = [specificPage];
        console.log(`📊 PDF tiene ${totalPages} páginas, procesando solo la página ${specificPage}`);
      } else {
        pagesToProcess = Array.from({ length: totalPages }, (_, i) => i + 1);
        console.log(`📊 PDF tiene ${totalPages} páginas, procesando todas`);
      }

      // Procesar páginas
      const pages: PDFPage[] = [];
      const allErrors: string[] = [];

      for (let i = 0; i < pagesToProcess.length; i++) {
        const pageNum = pagesToProcess[i];
        this.updateProgress(i + 1, pagesToProcess.length, 'extracting-text', `Procesando página ${pageNum}...`);
        
        try {
          const page = await this.processPage(pdf, pageNum);
          pages.push(page);
        } catch (error) {
          const errorMsg = `Error en página ${pageNum}: ${error instanceof Error ? error.message : 'Error desconocido'}`;
          allErrors.push(errorMsg);
          console.error(errorMsg);
          
          // Crear página con error
          pages.push({
            pageNumber: pageNum,
            hasText: false,
            hasImages: false,
            extractedQuestions: [],
            processingStatus: 'error',
            error: errorMsg
          });
        }
      }

      // Contar preguntas totales
      const totalQuestions = pages.reduce((sum, page) => 
        sum + (page.extractedQuestions?.length || 0), 0
      );

      this.updateProgress(pagesToProcess.length, pagesToProcess.length, 'completed', 'Procesamiento completado');

      return {
        file,
        pages,
        totalQuestions,
        processingTime: Date.now() - startTime,
        errors: allErrors
      };

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error de procesamiento desconocido';
      throw new Error(`Error procesando PDF: ${errorMsg}`);
    }
  }

  /**
   * Procesa una página individual del PDF
   */
  private async processPage(pdf: pdfjsLib.PDFDocumentProxy, pageNumber: number): Promise<PDFPage> {
    const page = await pdf.getPage(pageNumber);
    
    // Analizar contenido de la página
    const textContent = await page.getTextContent();
    const hasText = textContent.items.length > 0;
    
    // Renderizar página para detectar imágenes
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('No se pudo obtener contexto del canvas');
    }
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport,
      canvas: canvas
    }).promise;

    const imageData = canvas.toDataURL('image/png');
    const hasImages = await this.detectImages(canvas);

    let pageData: PDFPage = {
      pageNumber,
      hasText,
      hasImages,
      imageData,
      extractedQuestions: [],
      processingStatus: 'processing'
    };

    // Procesar contenido según tipo
    if (hasText) {
      pageData = await this.processTextContent(pageData, textContent as { items: Array<{ str?: string }> });
    }
    
    // Si hay imágenes, procesar con OCR si no hay texto O si no se encontraron preguntas en el texto
    if (hasImages && (!hasText || !pageData.extractedQuestions || pageData.extractedQuestions.length === 0)) {
      console.log(`🔍 Página ${pageData.pageNumber}: Procesando imágenes con OCR...`);
      pageData = await this.processImageContent(pageData, imageData);
    }

    // SIEMPRE configurar opción de Gemini Vision si Gemini está disponible
    if (this.geminiService) {
      pageData.geminiVisionOption = {
        available: true,
        imageData: imageData,
        reason: pageData.extractedQuestions && pageData.extractedQuestions.length > 0 
          ? 'Gemini Vision disponible como alternativa'
          : 'No se detectaron preguntas, Gemini Vision disponible'
      };
      console.log(`🔍 Página ${pageData.pageNumber}: Gemini Vision configurado como opción`);
    }

    pageData.processingStatus = 'completed';
    return pageData;
  }

  /**
   * Procesa contenido de texto extraído del PDF con mejor detección
   */
  private async processTextContent(pageData: PDFPage, textContent: { items: Array<{ str?: string }> }): Promise<PDFPage> {
    // Extraer texto con mejor formateo
    const textItems = textContent.items
      .filter((item): item is { str: string } => Boolean(item.str && item.str.trim()))
      .map((item) => item.str)
      .join(' ')
      .replace(/\s+/g, ' ') // Normalizar espacios
      .trim();
    
    pageData.textContent = textItems;

    // Mostrar el texto extraído para debug
    console.log(`📄 Página ${pageData.pageNumber} - Texto extraído (${textItems.length} chars):`, 
      textItems.substring(0, 200) + (textItems.length > 200 ? '...' : ''));

    // Solo procesar si hay suficiente texto y contenido que parezca ser preguntas
    if (textItems.length < 50) {
      console.log(`⚠️ Página ${pageData.pageNumber}: Texto insuficiente (${textItems.length} chars)`);
      return pageData;
    }

    // Detectar si parece contener preguntas
    const questionIndicators = [
      /\d+[.)]\s*/, // 1. o 1)
      /Question\s*\d+/i,
      /Pregunta\s*\d+/i,
      /[ABC][).]\s*/g, // A) o A.
      /\?\s*$/m, // Líneas que terminan en ?
      /Choose\s+(one|the|all)/i,
      /Select\s+(one|the|all)/i,
      /Which\s+of\s+the\s+following/i,
      /¿[^?]+\?/g // Preguntas en español
    ];

    const hasQuestionPattern = questionIndicators.some(pattern => pattern.test(textItems));
    
    if (!hasQuestionPattern) {
      console.log(`⚠️ Página ${pageData.pageNumber}: No se detectaron patrones de preguntas`);
      return pageData;
    }

    console.log(`✅ Página ${pageData.pageNumber}: Patrones de preguntas detectados, procesando con IA...`);

    if (!this.geminiService) {
      console.log(`⚠️ Página ${pageData.pageNumber}: Gemini no configurado`);
      return this.extractQuestionsManually(pageData, textItems);
    }

    try {
      this.updateProgress(pageData.pageNumber, 1, 'ai-processing', 'Procesando con IA...');
      
      // Usar Gemini para extraer preguntas del texto con fallback
      const questions = await this.geminiService.extractQuestionsWithFallback(textItems);
      
      console.log(`📊 Página ${pageData.pageNumber}: ${questions.length} preguntas extraídas`);
      
      if (questions.length > 0) {
        // Notificar preguntas básicas primero
        questions.forEach(question => {
          if (this.onQuestionExtracted) {
            this.onQuestionExtracted(question, pageData.pageNumber);
          }
        });
        
        // Generar explicaciones y links para cada pregunta
        const enhancedQuestions = await this.enhanceQuestions(questions, pageData.pageNumber);
        pageData.extractedQuestions = enhancedQuestions;
      } else {
        // Si IA falló, intentar extracción manual
        console.log(`🔄 Página ${pageData.pageNumber}: IA no encontró preguntas, intentando extracción manual...`);
        return this.extractQuestionsManually(pageData, textItems);
      }
      
    } catch (error) {
      console.error(`❌ Error procesando página ${pageData.pageNumber} con Gemini:`, error);
      
      // Si hay error de sobrecarga, intentar extracción manual como fallback
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('overloaded') || errorMessage.includes('503')) {
        console.log(`🔄 Página ${pageData.pageNumber}: Gemini sobrecargado, usando extracción manual...`);
        return this.extractQuestionsManually(pageData, textItems);
      }
      
      pageData.error = `Error de IA: ${error instanceof Error ? error.message : 'Error desconocido'}`;
    }

    return pageData;
  }

  /**
   * Extrae preguntas usando patrones regulares cuando IA no está disponible
   */
  private extractQuestionsManually(pageData: PDFPage, textContent: string): PDFPage {
    console.log(`🔧 Página ${pageData.pageNumber}: Extrayendo preguntas manualmente...`);
    
    const questions: ExtractedQuestion[] = [];
    
    // Dividir el texto en bloques potenciales de preguntas
    const questionBlocks = this.splitIntoQuestionBlocks(textContent);
    
    questionBlocks.forEach((block) => {
      const question = this.parseQuestionBlock(block);
      if (question) {
        const enhancedQuestion = {
          ...question,
          id: this.generateQuestionId(),
          confidence: 0.4, // Baja confianza para extracción manual
          source: 'text' as const,
          needsReview: true
        };
        
        questions.push(enhancedQuestion);
        
        // Notificar pregunta extraída manualmente
        if (this.onQuestionExtracted) {
          this.onQuestionExtracted(enhancedQuestion, pageData.pageNumber);
        }
      }
    });
    
    console.log(`🔧 Página ${pageData.pageNumber}: ${questions.length} preguntas extraídas manualmente`);
    pageData.extractedQuestions = questions;
    
    return pageData;
  }

  /**
   * Divide el texto en bloques que podrían ser preguntas
   */
  private splitIntoQuestionBlocks(text: string): string[] {
    // Buscar patrones como "1.", "Question 1", etc.
    const questionMarkers = /(?:^|\n)\s*(?:\d+[.)]\s*|Question\s+\d+[.:]\s*|Pregunta\s+\d+[.:]\s*)/gi;
    const blocks = text.split(questionMarkers);
    
    // Filtrar bloques que tengan contenido suficiente
    return blocks.filter(block => block.trim().length > 20);
  }

  /**
   * Intenta parsear un bloque de texto como una pregunta
   */
  private parseQuestionBlock(block: string): ExtractedQuestion | null {
    const lines = block.trim().split('\n').map(line => line.trim()).filter(line => line);
    
    if (lines.length < 3) return null; // Muy poco contenido
    
    // Buscar la pregunta (línea que termina en ? o es la primera línea larga)
    let questionText = '';
    let startIndex = 0;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].endsWith('?') || (lines[i].length > 30 && !this.isOptionLine(lines[i]))) {
        questionText = lines[i];
        startIndex = i + 1;
        break;
      }
    }
    
    if (!questionText && lines[0].length > 15) {
      questionText = lines[0];
      startIndex = 1;
    }
    
    if (!questionText) return null;
    
    // Buscar opciones (A), B), C), etc.
    const options: Array<{ option_letter: string; option_text: string; is_correct: boolean }> = [];
    
    for (let i = startIndex; i < lines.length; i++) {
      const optionMatch = lines[i].match(/^([A-E])[.)]\s*(.+)$/i);
      if (optionMatch) {
        options.push({
          option_letter: optionMatch[1].toUpperCase(),
          option_text: optionMatch[2].trim(),
          is_correct: false // No podemos determinar esto sin IA
        });
      }
    }
    
    if (options.length < 2) return null; // Necesitamos al menos 2 opciones
    
    return {
      id: this.generateQuestionId(),
      question_text: questionText,
      options,
      requires_multiple_answers: false,
      explanation: '(Extracción manual - requiere revisión)',
      link: '',
      confidence: 0.4,
      source: 'text' as const,
      needsReview: true
    };
  }

  /**
   * Verifica si una línea parece ser una opción de respuesta
   */
  private isOptionLine(line: string): boolean {
    return /^[A-E][.)]\s/.test(line);
  }

  /**
   * Genera un ID único para cada pregunta
   */
  private generateQuestionId(): string {
    return `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Procesa contenido de imágenes usando OCR mejorado
   */
  private async processImageContent(pageData: PDFPage, imageData: string): Promise<PDFPage> {
    try {
      this.updateProgress(pageData.pageNumber, 1, 'ocr', 'Ejecutando OCR mejorado...');
      
      console.log(`🔍 Página ${pageData.pageNumber}: Iniciando OCR con preprocesamiento...`);
      
      // Preprocesar imagen para mejorar OCR
      const enhancedImageData = await this.preprocessImageForOCR(imageData);
      
      // Crear worker de Tesseract con configuración optimizada para exámenes
      const worker = await createWorker(['eng', 'spa'], 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progreso: ${Math.round(m.progress * 100)}%`);
          }
        }
      });

      // Configuración optimizada para documentos académicos/exámenes
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK, // Uniform block of text
        tessedit_ocr_engine_mode: '3', // Default + LSTM
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,;:!?()[]{}"\'-/\\+=*&%$#@^~`|<> \n\t¿¡áéíóúñüÁÉÍÓÚÑÜ',
        preserve_interword_spaces: '1',
        tessedit_do_invert: '0',
        tessedit_write_images: '0'
      });
      
      // Ejecutar OCR con imagen mejorada
      const { data: { text, confidence } } = await worker.recognize(enhancedImageData);
      await worker.terminate();

      console.log(`📝 OCR completado - Confianza: ${confidence.toFixed(1)}%, Texto: ${text.length} chars`);
      console.log(`📄 Texto extraído:`, text.substring(0, 300) + (text.length > 300 ? '...' : ''));

      pageData.textContent = text;

      if (text.trim().length > 20 && confidence > 30) { // Umbral de confianza más bajo
        if (this.geminiService) {
          this.updateProgress(pageData.pageNumber, 1, 'ai-processing', 'Procesando texto OCR con IA...');
          
          console.log(`🤖 Procesando texto OCR con IA...`);
          
          // Primero intentar extraer preguntas directamente del texto OCR
          try {
            const questions = await this.geminiService.extractQuestionsWithFallback(text);
            if (questions.length > 0) {
              console.log(`✅ ${questions.length} preguntas extraídas directamente del OCR`);
              pageData.extractedQuestions = await this.enhanceQuestions(questions, pageData.pageNumber);
              return pageData;
            }
          } catch (error) {
            console.log(`⚠️ Extracción directa falló:`, error);
          }
        }
      } else {
        console.log(`⚠️ OCR texto insuficiente o baja confianza: ${text.length} chars, ${confidence.toFixed(1)}%`);
      }

      // Si OCR falló o no extrajo preguntas, marcar para opción de Gemini Vision
      pageData.ocrFailed = true;
      pageData.geminiVisionOption = {
        available: Boolean(this.geminiService),
        imageData: enhancedImageData,
        reason: confidence < 30 ? 'Baja confianza en OCR' : 'No se detectaron preguntas en el texto'
      };
    } catch (error) {
      console.error(`❌ Error en procesamiento OCR:`, error);
      pageData.error = `Error OCR: ${error instanceof Error ? error.message : 'Error desconocido'}`;
    }

    return pageData;
  }

  /**
   * Mejora preguntas con explicaciones y links, notificando progreso en tiempo real
   */
  private async enhanceQuestions(questions: ExtractedQuestion[], pageNumber?: number): Promise<ExtractedQuestion[]> {
    if (!this.geminiService) {
      return questions;
    }

    const enhanced = await Promise.all(
      questions.map(async (question, index) => {
        try {
          console.log(`🔧 Mejorando pregunta ${index + 1}/${questions.length} de página ${pageNumber}...`);
          
          // Generar explicación si está vacía
          if (!question.explanation) {
            const correctAnswers = question.options
              .filter(opt => opt.is_correct)
              .map(opt => opt.option_text);
            
            this.updateProgress(pageNumber || 0, 1, 'ai-processing', 
              `Generando explicación para pregunta ${index + 1}...`);
            
            question.explanation = await this.geminiService!.generateExplanation(
              question.question_text,
              correctAnswers
            );
            
            // Notificar actualización de pregunta
            if (this.onQuestionExtracted && pageNumber) {
              this.onQuestionExtracted(question, pageNumber);
            }
          }

          // Generar link de referencia si está vacío
          if (!question.link) {
            this.updateProgress(pageNumber || 0, 1, 'ai-processing', 
              `Buscando referencias para pregunta ${index + 1}...`);
              
            question.link = await this.geminiService!.findReferenceLinks(
              question.question_text
            );
            
            // Notificar actualización final de pregunta
            if (this.onQuestionExtracted && pageNumber) {
              this.onQuestionExtracted(question, pageNumber);
            }
          }

          console.log(`✅ Pregunta ${index + 1} mejorada con explicación y links`);
          return question;
        } catch (error) {
          console.error('Error enhancing question:', error);
          return question;
        }
      })
    );

    return enhanced;
  }

  /**
   * Detecta si hay imágenes significativas en el canvas
   */
  private async detectImages(canvas: HTMLCanvasElement): Promise<boolean> {
    const context = canvas.getContext('2d');
    if (!context) return false;

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Análisis simple: detectar variación de color
    let colorVariation = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const gray = (r + g + b) / 3;
      
      if (Math.abs(r - gray) > 10 || Math.abs(g - gray) > 10 || Math.abs(b - gray) > 10) {
        colorVariation++;
      }
    }

    // Si hay suficiente variación, probablemente hay imágenes/gráficos
    return colorVariation > (data.length / 4) * 0.1;
  }

  /**
   * Carga el archivo PDF con opciones mejoradas
   */
  private async loadPDF(file: File): Promise<pdfjsLib.PDFDocumentProxy> {
    const arrayBuffer = await file.arrayBuffer();
    
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      ...PDF_OPTIONS
    });

    // Agregar listener para warnings específicos
    loadingTask.onProgress = (progress: { loaded: number; total: number }) => {
      console.log(`Cargando PDF: ${Math.round((progress.loaded / progress.total) * 100)}%`);
    };

    return await loadingTask.promise;
  }

  /**
   * Valida el archivo antes de procesarlo
   */
  private validateFile(file: File): void {
    // Validar tipo
    if (file.type !== 'application/pdf') {
      throw new Error('Solo se permiten archivos PDF');
    }

    // Validar tamaño
    const maxSizeBytes = (import.meta.env.VITE_MAX_PDF_SIZE_MB || 5) * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new Error(`El archivo excede el tamaño máximo de ${maxSizeBytes / 1024 / 1024}MB`);
    }
  }

  /**
   * Preprocesa la imagen para mejorar la calidad del OCR
   */
  private async preprocessImageForOCR(imageData: string): Promise<string> {
    try {
      // Crear canvas temporal para procesamiento
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      if (!ctx) {
        console.warn('No se pudo obtener contexto del canvas, usando imagen original');
        return imageData;
      }

      return new Promise<string>((resolve) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Dibujar imagen original
          ctx.drawImage(img, 0, 0);
          
          // Obtener datos de imagen
          const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageDataObj.data;
          
          // Aplicar mejoras de imagen
          for (let i = 0; i < data.length; i += 4) {
            // Convertir a escala de grises
            const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            
            // Mejorar contraste (simple threshold)
            const enhanced = gray > 128 ? 255 : 0;
            
            data[i] = enhanced;     // R
            data[i + 1] = enhanced; // G
            data[i + 2] = enhanced; // B
            // Alpha permanece igual
          }
          
          // Aplicar datos procesados
          ctx.putImageData(imageDataObj, 0, 0);
          
          // Devolver imagen mejorada
          resolve(canvas.toDataURL('image/png'));
        };
        
        img.onerror = () => {
          console.warn('Error procesando imagen, usando original');
          resolve(imageData);
        };
        
        img.src = imageData;
      });
      
    } catch (error) {
      console.warn('Error en preprocesamiento, usando imagen original:', error);
      return imageData;
    }
  }

  /**
   * Actualiza el progreso del procesamiento
   */
  private updateProgress(current: number, total: number, stage: ProcessingProgress['stage'], message: string): void {
    if (this.onProgress) {
      this.onProgress({
        currentPage: current,
        totalPages: total,
        stage,
        message
      });
    }
  }

  /**
   * Obtiene información sobre limitaciones de memoria
   */
  static getMemoryLimitations() {
    return {
      maxPDFSize: `${import.meta.env.VITE_MAX_PDF_SIZE_MB || 5}MB`,
      maxPages: import.meta.env.VITE_MAX_PAGES_PER_PDF || 20,
      localStorageLimit: '~10MB total',
      recommendation: 'Procesar PDFs pequeños de máximo 10-15 páginas'
    };
  }

  getGeminiService(): GeminiService | null {
    return this.geminiService;
  }

  /**
   * Procesa una página usando Gemini Vision directamente
   */
  async processPageWithGeminiVision(pageData: PDFPage): Promise<PDFPage> {
    if (!this.geminiService || !pageData.geminiVisionOption?.imageData) {
      throw new Error('Gemini Vision no está disponible o no hay datos de imagen');
    }

    console.log(`🔍 Procesando página ${pageData.pageNumber} con Gemini Vision...`);
    
    try {
      this.updateProgress(pageData.pageNumber, 1, 'ai-processing', 'Analizando imagen con Gemini Vision...');
      
      const questions = await this.geminiService.extractQuestionsFromImage(pageData.geminiVisionOption.imageData);
      
      if (questions.length > 0) {
        // Notificar preguntas extraídas
        questions.forEach(question => {
          if (this.onQuestionExtracted) {
            this.onQuestionExtracted(question, pageData.pageNumber);
          }
        });
        
        // Generar explicaciones y links si es necesario
        const enhancedQuestions = await this.enhanceQuestions(questions, pageData.pageNumber);
        pageData.extractedQuestions = enhancedQuestions;
        pageData.processingStatus = 'completed';
        pageData.ocrFailed = false; // Ya no necesita OCR
        
        console.log(`✅ Gemini Vision completado: ${questions.length} preguntas extraídas`);
      } else {
        pageData.error = 'Gemini Vision no encontró preguntas en la imagen';
        pageData.processingStatus = 'error';
      }
      
    } catch (error) {
      console.error(`❌ Error en Gemini Vision:`, error);
      pageData.error = `Error Gemini Vision: ${error instanceof Error ? error.message : 'Error desconocido'}`;
      pageData.processingStatus = 'error';
    }
    
    return pageData;
  }

  /**
   * Obtiene la instancia del servicio de Gemini
   */

  /**
   * Estima el uso de memoria para un PDF
   */
  static estimateMemoryUsage(fileSize: number): {
    estimated: string;
    warning: boolean;
    recommendation: string;
  } {
    // Estimación: archivo original + OCR data + preguntas procesadas
    const estimatedBytes = fileSize * 2.5; // Factor de multiplicación estimado
    const estimatedMB = estimatedBytes / 1024 / 1024;
    
    const warning = estimatedMB > 8; // Advertir si supera 8MB
    
    return {
      estimated: `~${estimatedMB.toFixed(1)}MB`,
      warning,
      recommendation: warning 
        ? 'Considera procesar el PDF en secciones más pequeñas'
        : 'Uso de memoria dentro de límites normales'
    };
  }
}

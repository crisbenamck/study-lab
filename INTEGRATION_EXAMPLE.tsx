// Ejemplo de cómo integrar las mejoras en App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Páginas mejoradas
import StudyResultsPageImproved from './pages/StudyResultsPageImproved';
import StudyPageImproved from './pages/StudyPageImproved';

// Páginas existentes (que pueden ser migradas gradualmente)
import HomePage from './pages/HomePage';
import CreateQuestionPage from './pages/CreateQuestionPage';
import ViewQuestionsPage from './pages/ViewQuestionsPage';
import ImportPDFPage from './pages/ImportPDFPage';
import StudyTestPage from './pages/StudyTestPage';
import StudyFlashCardsPage from './pages/StudyFlashCardsPage';
import TestAPIPage from './pages/TestAPIPage';

// Componentes mejorados
import Layout from './components/Layout';

// Hooks
import { useTheme } from './hooks/useTheme';

// Importar design tokens
import './styles/design-tokens.css';

function App() {
  // Inicializar tema
  const { theme } = useTheme();

  // Aplicar tema al documento
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Router>
      <div className="App theme-transition">
        <Routes>
          {/* Rutas con páginas mejoradas */}
          <Route 
            path="/study" 
            element={<StudyPageImproved />} 
          />
          <Route 
            path="/study/results" 
            element={<StudyResultsPageImproved />} 
          />
          
          {/* Rutas existentes - pueden ser migradas gradualmente usando Layout */}
          <Route 
            path="/" 
            element={
              <Layout>
                <HomePage />
              </Layout>
            } 
          />
          <Route 
            path="/create" 
            element={
              <Layout>
                <CreateQuestionPage />
              </Layout>
            } 
          />
          <Route 
            path="/questions" 
            element={
              <Layout>
                <ViewQuestionsPage />
              </Layout>
            } 
          />
          <Route 
            path="/import" 
            element={
              <Layout>
                <ImportPDFPage />
              </Layout>
            } 
          />
          <Route 
            path="/test" 
            element={
              <Layout>
                <TestAPIPage />
              </Layout>
            } 
          />
          
          {/* Rutas de estudio que mantienen su lógica actual */}
          <Route path="/study/test" element={<StudyTestPage />} />
          <Route path="/study/flashcards" element={<StudyFlashCardsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

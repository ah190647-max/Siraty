import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TemplatesGallery from './components/TemplatesGallery';
import ImportPage from './components/ImportPage';
import ImportReviewPage from './components/ImportReviewPage';
import EditorPage from './components/EditorPage';
import Dashboard from './components/Dashboard';
import AboutPage from './components/AboutPage';
import ErrorBoundary from './components/ErrorBoundary';
import SEOHead from './components/SEOHead';
import Analytics from './components/Analytics';

function App() {
  return (
    <Router>
      <SEOHead page="gallery" />
      <Analytics />
      <div className="app">
        <Routes>
          <Route path="/" element={<TemplatesGallery />} />
          <Route path="/import" element={<ImportPage />} />
          <Route path="/review" element={<ImportReviewPage />} />
          <Route path="/editor" element={
            <ErrorBoundary message="تعذر تحميل محرر السيرة الذاتية. قد يكون القالب المختار غير متوافق.">
              <EditorPage />
            </ErrorBoundary>
          } />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
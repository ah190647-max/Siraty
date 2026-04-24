import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useResumeStore from '../store/useResumeStore';
import { parseResumeText } from '../utils/parser';
import SEOHead from './SEOHead';

export default function ImportPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState('paste');
  const [text, setText] = useState('');
  const [charCount, setCharCount] = useState(0);

  const setParsedData = useResumeStore((state) => state.setParsedData);
  const navigate = useNavigate();

  const handleImport = () => {
    if (!text.trim()) return;
    const parsed = parseResumeText(text);
    setParsedData(parsed);
    navigate('/review');
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target.result;
      setText(content);
      setCharCount(content.length);
    };
    reader.readAsText(file, 'UTF-8');
  };

  return (
    <>
      <SEOHead page="import" />
      <div className="import-page">
        <h2>{t('import.title')}</h2>
        <div className="tabs">
          <button className={tab === 'file' ? 'active' : ''} onClick={() => setTab('file')}>
            {t('import.fileTab')}
          </button>
          <button className={tab === 'paste' ? 'active' : ''} onClick={() => setTab('paste')}>
            {t('import.pasteTab')}
          </button>
        </div>

        {tab === 'file' && (
          <div className="file-upload">
            <input type="file" accept=".txt,.pdf,.docx" onChange={handleFile} />
            <p>.pdf, .docx, .txt</p>
            {text && (
              <>
                <textarea value={text} readOnly rows={8} />
                <button onClick={handleImport}>{t('import.importBtn')}</button>
              </>
            )}
          </div>
        )}

        {tab === 'paste' && (
          <div className="paste-area">
            <textarea
              placeholder={t('import.pastePlaceholder')}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setCharCount(e.target.value.length);
              }}
              rows={15}
            />
            <div className="char-counter">{charCount}/20000</div>
            <button onClick={handleImport} disabled={!text.trim()} className="import-btn">
              {t('import.importBtn')}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
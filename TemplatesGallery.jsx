import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useResumeStore from '../store/useResumeStore';
import SEOHead from './SEOHead';

const templates = [
  { id: 'modern', nameEn: 'Modern', nameAr: 'مودرن', color: '#2c3e50' },
  { id: 'creative', nameEn: 'Creative', nameAr: 'كرييتف', color: '#e67e22' },
  { id: 'classic', nameEn: 'Classic', nameAr: 'كلاسيك', color: '#7f8c8d' },
  { id: 'europass', nameEn: 'Europass', nameAr: 'Europass', color: '#003399' },
  { id: 'rirekisho', nameEn: 'Rirekisho (Japan)', nameAr: 'ريريكيشو (اليابان)', color: '#c0392b' },
  { id: 'minimalist', nameEn: 'Minimalist', nameAr: 'مينيماليست', color: '#1a1a1a' },
  { id: 'twocolumn', nameEn: 'Two Column', nameAr: 'عمودين', color: '#3498db' },
  { id: 'modernpro', nameEn: 'Modern Pro', nameAr: 'مودرن برو', color: '#2b2b2b' },
];

export default function TemplatesGallery() {
  const { t, i18n } = useTranslation();
  const setTemplate = useResumeStore((state) => state.setTemplate);
  const navigate = useNavigate();

  const handleSelect = (id) => {
    setTemplate(id);
    navigate('/import');
  };

  return (
    <>
      <SEOHead page="gallery" />
      <div className="gallery-page">
        <h1>{t('gallery.title')}</h1>
        <div className="template-cards">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="template-card"
              onClick={() => handleSelect(tpl.id)}
            >
              <div
                className="template-thumb"
                style={{ backgroundColor: tpl.color }}
              >
                <span>
                  {i18n.language === 'ar' ? tpl.nameAr : tpl.nameEn}
                </span>
              </div>
              <h3>{i18n.language === 'ar' ? tpl.nameAr : tpl.nameEn}</h3>
            </div>
          ))}
        </div>
        <p className="subtitle">{t('gallery.subtitle')}</p>
      </div>
    </>
  );
}
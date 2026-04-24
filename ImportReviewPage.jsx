import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useResumeStore from '../store/useResumeStore';
import SEOHead from './SEOHead';

export default function ImportReviewPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const parsedData = useResumeStore((state) => state.parsedData);
  const clearParsedData = useResumeStore((state) => state.clearParsedData);
  const setFullProfile = useResumeStore((state) => state.setFullProfile);
  const setExperience = useResumeStore((state) => state.setExperience);
  const setEducation = useResumeStore((state) => state.setEducation);
  const setSkills = useResumeStore((state) => state.setSkills);
  const setLanguages = useResumeStore((state) => state.setLanguages);
  const setCertifications = useResumeStore((state) => state.setCertifications);
  const setAwards = useResumeStore((state) => state.setAwards);

  const [editableData, setEditableData] = useState(parsedData || {});

  if (!parsedData) {
    navigate('/import');
    return null;
  }

  const handleSave = () => {
    setFullProfile({
      name: editableData.name,
      title: editableData.title,
      email: editableData.email,
      phone: editableData.phone,
      location: editableData.location,
      linkedin: editableData.linkedin,
      website: editableData.website,
      summary: editableData.summary,
    });
    setExperience(editableData.experience || []);
    setEducation(editableData.education || []);
    setSkills(editableData.skills || []);
    setLanguages(editableData.languages || []);
    setCertifications(editableData.certifications || []);
    setAwards(editableData.awards || []);
    clearParsedData();
    navigate('/editor');
  };

  const updateField = (field, value) => {
    setEditableData(prev => ({ ...prev, [field]: value }));
  };

  const updateExperience = (index, key, value) => {
    const updated = [...editableData.experience];
    updated[index][key] = value;
    setEditableData(prev => ({ ...prev, experience: updated }));
  };

  return (
    <>
      <SEOHead page="import" />
      <div className="import-page">
        <h2>{t('review.title')}</h2>
        <p>{t('review.subtitle')}</p>

        <label>{t('editor.name')}</label>
        <input value={editableData.name || ''} onChange={e => updateField('name', e.target.value)} />

        <label>{t('editor.titleField')}</label>
        <input value={editableData.title || ''} onChange={e => updateField('title', e.target.value)} />

        <label>{t('editor.email')}</label>
        <input value={editableData.email || ''} onChange={e => updateField('email', e.target.value)} />

        <label>{t('editor.phone')}</label>
        <input value={editableData.phone || ''} onChange={e => updateField('phone', e.target.value)} />

        <h3>{t('editor.experience')}</h3>
        {(editableData.experience || []).map((exp, idx) => (
          <div key={exp.id || idx} className="drag-item">
            <input
              placeholder={t('editor.titleField')}
              value={exp.title || ''}
              onChange={e => updateExperience(idx, 'title', e.target.value)}
            />
            <input
              placeholder="الشركة"
              value={exp.company || ''}
              onChange={e => updateExperience(idx, 'company', e.target.value)}
            />
          </div>
        ))}

        <div style={{ marginTop: 20 }}>
          <button onClick={handleSave} className="download-btn">
            {t('review.save')}
          </button>
        </div>
      </div>
    </>
  );
}
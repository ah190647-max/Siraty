import React, { useTransition, useCallback, useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useResumeStore, { REGION_PRESETS } from '../store/useResumeStore';
import DraggableExperienceList from './DraggableList';
import DraggableEducationList from './DraggableEducationList';
import ResumeScore from './ResumeScore';
import ATSChecklist from './ATSChecklist';
import TemplatePreview from './TemplatePreview';
import SEOHead from './SEOHead';
import { downloadPDF } from '../utils/pdfGenerator';
import { downloadZ83Form } from '../utils/z83Generator';
import { downloadBilingualCV } from '../utils/bilingualGenerator';
import { downloadWord } from '../utils/wordGenerator';
import { exportResumeJSON, importResumeJSON } from '../utils/backupUtils';
import { initFonts } from '../utils/fontLoader';
import { resizeImage } from '../utils/imageUtils';

const EditorPage = React.memo(() => {
  const { t, i18n } = useTranslation();

  const profile = useResumeStore((s) => s.profile);
  const setRegion = useResumeStore((s) => s.setRegion);
  const updateProfileField = useResumeStore((s) => s.updateProfileField);
  const updateDesign = useResumeStore((s) => s.updateDesign);
  const updateRegional = useResumeStore((s) => s.updateRegional);
  const updatePrivacy = useResumeStore((s) => s.updatePrivacy);
  const addExperience = useResumeStore((s) => s.addExperience);
  const addEducation = useResumeStore((s) => s.addEducation);
  const addSkill = useResumeStore((s) => s.addSkill);
  const addLanguage = useResumeStore((s) => s.addLanguage);
  const addCertification = useResumeStore((s) => s.addCertification);
  const addAward = useResumeStore((s) => s.addAward);
  const setFullProfile = useResumeStore((s) => s.setFullProfile);
  const setExperience = useResumeStore((s) => s.setExperience);
  const setEducation = useResumeStore((s) => s.setEducation);
  const setSkills = useResumeStore((s) => s.setSkills);
  const setLanguages = useResumeStore((s) => s.setLanguages);
  const setCertifications = useResumeStore((s) => s.setCertifications);
  const setAwards = useResumeStore((s) => s.setAwards);

  const skills = useResumeStore((s) => s.skills);
  const languages = useResumeStore((s) => s.languages);
  const certifications = useResumeStore((s) => s.certifications);
  const awards = useResumeStore((s) => s.awards);
  const updateSkill = useResumeStore((s) => s.updateSkill);
  const updateLanguage = useResumeStore((s) => s.updateLanguage);
  const updateCertification = useResumeStore((s) => s.updateCertification);
  const updateAward = useResumeStore((s) => s.updateAward);
  const removeSkill = useResumeStore((s) => s.removeSkill);
  const removeLanguage = useResumeStore((s) => s.removeLanguage);
  const removeCertification = useResumeStore((s) => s.removeCertification);
  const removeAward = useResumeStore((s) => s.removeAward);

  const [pending, startTransition] = useTransition();
  const isRTL = i18n.language === 'ar';
  const regionConfig = REGION_PRESETS[profile.region] || REGION_PRESETS.international;
  const showATSwarning = regionConfig.atsStrict && profile.design.columns !== 1;
  const showPhotoWarning = regionConfig.privacyForced && !profile.privacy.hidePhoto;
  const [photoPreview, setPhotoPreview] = useState(profile.photo);

  useEffect(() => {
    import('pdfmake-rtl/build/pdfmake').then(module => {
      initFonts(module.default);
    });
  }, []);

  const handlePhoto = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const compressed = await resizeImage(file, 200, 0.6);
      setPhotoPreview(compressed);
      updateProfileField('photo', compressed);
    } catch (error) {
      alert('فشل معالجة الصورة');
    }
  }, [updateProfileField]);

  const canDownload = useMemo(() => {
    return profile.name.trim() || profile.email.trim();
  }, [profile.name, profile.email]);

  const isEmpty = !profile.name && skills.length === 0 && useResumeStore.getState().experience.length === 0 && useResumeStore.getState().education.length === 0;

  const handleImportJSON = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = await importResumeJSON(file);
      if (data.profile) setFullProfile(data.profile);
      if (data.experience) setExperience(data.experience);
      if (data.education) setEducation(data.education);
      if (data.skills) setSkills(data.skills);
      if (data.languages) setLanguages(data.languages);
      if (data.certifications) setCertifications(data.certifications);
      if (data.awards) setAwards(data.awards);
      alert(isRTL ? 'تم استيراد البيانات بنجاح' : 'Data imported successfully');
    } catch (err) {
      alert('ملف JSON غير صالح');
    }
  };

  const getResumeData = () => ({
    ...profile,
    experience: useResumeStore.getState().experience,
    education: useResumeStore.getState().education,
    skills,
    languages,
    certifications,
    awards,
  });

  return (
    <>
      <SEOHead page="editor" />
      <div className="editor-layout" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="form-panel">
          {isEmpty && (
            <div className="empty-state" style={{ textAlign: 'center', padding: 40, color: '#999' }}>
              <p style={{ fontSize: 48 }}>📄</p>
              <h3>{isRTL ? 'ابدأ سيرتك الذاتية من هنا' : 'Start your resume here'}</h3>
              <p>{isRTL ? 'أضف اسمك وخبراتك وسنقوم بتنسيقها بشكل احترافي' : 'Add your name and experience, and we will format it professionally'}</p>
            </div>
          )}

          <ResumeScore />
          <ATSChecklist />

          <div className="destination-panel">
            <label><strong>🌍 {t('country.label')}</strong></label>
            <select value={profile.region} onChange={e => setRegion(e.target.value)}>
              {Object.entries(REGION_PRESETS).map(([key, val]) => <option key={key} value={key}>{val.name}</option>)}
            </select>
          </div>

          {showATSwarning && <div className="info-box ats-warn">{t('ats.warning')}</div>}
          {showPhotoWarning && <div className="info-box photo-warn">{t('privacy.mode')}: {t('privacy.hidePhoto')}</div>}

          <h2>{t('editor.title')}</h2>
          <label>{t('editor.name')}</label>
          <input value={profile.name} onChange={e => startTransition(() => updateProfileField('name', e.target.value))} />
          <label>{t('editor.titleField')}</label>
          <input value={profile.title} onChange={e => updateProfileField('title', e.target.value)} />
          <label>{t('editor.email')}</label>
          <input value={profile.email} onChange={e => updateProfileField('email', e.target.value)} />
          <label>{t('editor.phone')}</label>
          <input value={profile.phone} onChange={e => updateProfileField('phone', e.target.value)} />
          <label>LinkedIn</label>
          <input value={profile.linkedin} onChange={e => updateProfileField('linkedin', e.target.value)} />
          <label>Website</label>
          <input value={profile.website} onChange={e => updateProfileField('website', e.target.value)} />
          <label>{t('editor.summary')}</label>
          <textarea value={profile.summary} onChange={e => updateProfileField('summary', e.target.value)} rows={4} />

          <div className="photo-section" style={{ margin: '15px 0' }}>
            <label>{t('editor.photo')}</label>
            <input type="file" accept="image/*" onChange={handlePhoto} />
            {photoPreview && <img src={photoPreview} alt="preview" style={{ width: 60, height: 60, borderRadius: '50%', marginTop: 10 }} />}
          </div>

          <div className="privacy-section">
            <h3>🔒 {t('privacy.mode')}</h3>
            <label><input type="checkbox" checked={profile.privacy.hidePhoto} onChange={e => updatePrivacy('hidePhoto', e.target.checked)} /> {t('privacy.hidePhoto')}</label><br />
            <label><input type="checkbox" checked={profile.privacy.hideNationality} onChange={e => updatePrivacy('hideNationality', e.target.checked)} /> {t('privacy.hideNationality')}</label><br />
            <label><input type="checkbox" checked={profile.privacy.hideVisa} onChange={e => updatePrivacy('hideVisa', e.target.checked)} /> {t('privacy.hideVisa')}</label><br />
            <label><input type="checkbox" checked={profile.privacy.hideDOB} onChange={e => updatePrivacy('hideDOB', e.target.checked)} /> {t('privacy.hideDOB')}</label>
          </div>

          {regionConfig.fields.length > 0 && (
            <div className="regional-fields">
              <h3>📌 {t('editor.regional')}</h3>
              {regionConfig.fields.includes('nationality') && !profile.privacy.hideNationality && <div><label>{t('editor.nationality')}</label><input value={profile.regional.nationality} onChange={e => updateRegional('nationality', e.target.value)} /></div>}
              {regionConfig.fields.includes('visaStatus') && !profile.privacy.hideVisa && <div><label>{t('editor.visaStatus')}</label><input value={profile.regional.visaStatus} onChange={e => updateRegional('visaStatus', e.target.value)} /></div>}
              {regionConfig.fields.includes('noticePeriod') && <div><label>Notice Period</label><input value={profile.regional.noticePeriod} onChange={e => updateRegional('noticePeriod', e.target.value)} /></div>}
              {regionConfig.fields.includes('immediateJoiner') && <label><input type="checkbox" checked={profile.regional.immediateJoiner} onChange={e => updateRegional('immediateJoiner', e.target.checked)} /> Immediate Joiner</label>}
              {regionConfig.fields.includes('expectedSalary') && <div><label>Expected Salary</label><input value={profile.regional.expectedSalary} onChange={e => updateRegional('expectedSalary', e.target.value)} /></div>}
              {regionConfig.fields.includes('references') && <div><label>References</label><textarea value={profile.regional.references} onChange={e => updateRegional('references', e.target.value)} rows={3} /></div>}
              {regionConfig.fields.includes('idNumber') && <div><label>ID Number</label><input value={profile.regional.idNumber} onChange={e => updateRegional('idNumber', e.target.value)} /></div>}
              {regionConfig.fields.includes('placeOfBirth') && <div><label>Place of Birth</label><input value={profile.regional.placeOfBirth} onChange={e => updateRegional('placeOfBirth', e.target.value)} /></div>}
              {regionConfig.fields.includes('maritalStatus') && <div><label>Marital Status</label><input value={profile.regional.maritalStatus} onChange={e => updateRegional('maritalStatus', e.target.value)} /></div>}
              {regionConfig.fields.includes('signature') && <div><label>Signature</label><input value={profile.regional.signature} onChange={e => updateRegional('signature', e.target.value)} /></div>}
            </div>
          )}

          <h3>{t('editor.experience')}</h3>
          <DraggableExperienceList />
          <button onClick={addExperience} className="add-btn">{t('editor.addExperience')}</button>

          <h3>{t('editor.education')}</h3>
          <DraggableEducationList />
          <button onClick={addEducation} className="add-btn">{t('editor.addEducation')}</button>

          <h3>{t('editor.skills')}</h3>
          {skills.map((s, i) => <div key={`skill-${i}`} className="list-item"><input value={s} onChange={e => updateSkill(i, e.target.value)} /><button onClick={() => removeSkill(i)} className="small-remove">✕</button></div>)}
          <button onClick={addSkill} className="add-btn">{t('editor.addSkill')}</button>

          <h3>{t('editor.languages')}</h3>
          {languages.map((l, i) => <div key={`lang-${i}`} className="list-item"><input value={l} onChange={e => updateLanguage(i, e.target.value)} /><button onClick={() => removeLanguage(i)} className="small-remove">✕</button></div>)}
          <button onClick={addLanguage} className="add-btn">{t('editor.addLanguage')}</button>

          <h3>{t('editor.certifications')}</h3>
          {certifications.map((c, i) => <div key={`cert-${i}`} className="list-item"><input value={c} onChange={e => updateCertification(i, e.target.value)} /><button onClick={() => removeCertification(i)} className="small-remove">✕</button></div>)}
          <button onClick={addCertification} className="add-btn">{t('editor.addCertification')}</button>

          <h3>{t('editor.awards')}</h3>
          {awards.map((a, i) => <div key={`award-${i}`} className="list-item"><input value={a} onChange={e => updateAward(i, e.target.value)} /><button onClick={() => removeAward(i)} className="small-remove">✕</button></div>)}
          <button onClick={addAward} className="add-btn">{t('editor.addAward')}</button>

          <h3>{t('editor.design')}</h3>
          <label>{t('editor.columns')}</label>
          <select value={profile.design.columns} onChange={e => updateDesign('columns', Number(e.target.value))}>
            <option value={1}>{t('editor.oneColumn')}</option>
            <option value={2}>{t('editor.twoColumn')}</option>
          </select>
          <label>{t('editor.fontSize')}</label>
          <input type="number" step="0.5" value={profile.design.fontSize} onChange={e => updateDesign('fontSize', Number(e.target.value))} />
          <label>{t('editor.subtitleStyle')}</label>
          <select value={profile.design.subtitleStyle} onChange={e => updateDesign('subtitleStyle', e.target.value)}>
            <option value="normal">{t('editor.normal')}</option>
            <option value="bold">{t('editor.bold')}</option>
            <option value="italic">{t('editor.italic')}</option>
          </select>
        </div>

        <div className="preview-panel">
          <div id="resume-preview"><TemplatePreview /></div>

          <div className="backup-buttons" style={{ margin: '15px 0' }}>
            <input type="file" accept=".json" id="importJson" style={{ display: 'none' }} onChange={handleImportJSON} />
            <label htmlFor="importJson" className="add-btn" style={{ marginRight: 10 }}>
              📥 {t('import.importJson')}
            </label>
            <button onClick={exportResumeJSON} className="add-btn" style={{ marginRight: 10 }}>
              📤 {t('export.exportJson')}
            </button>
          </div>

          <button disabled={!canDownload} className="download-btn" onClick={() => downloadPDF(getResumeData())}>
            📄 {t('editor.download')}
          </button>
          <button className="download-btn" style={{ backgroundColor: '#3498db', marginTop: 10 }} onClick={() => downloadWord(getResumeData())}>
            📝 {isRTL ? 'تحميل Word' : 'Download Word'}
          </button>
          {regionConfig.exportZ83 && (
            <button className="download-btn" style={{ backgroundColor: '#e67e22', marginTop: 10 }} onClick={() => downloadZ83Form(getResumeData())}>
              🧾 {isRTL ? 'تحميل نموذج Z83' : 'Download Z83 Form'}
            </button>
          )}
          {profile.template === 'rirekisho' && (
            <button className="download-btn" style={{ backgroundColor: '#c0392b', marginTop: 10 }} onClick={() => downloadPDF(getResumeData())}>
              🇯🇵 {isRTL ? 'تحميل Shokumu Keirekisho' : 'Download Shokumu Keirekisho'}
            </button>
          )}
          <button className="download-btn" style={{ backgroundColor: '#2ecc71', marginTop: 10 }} onClick={() => downloadBilingualCV(getResumeData())}>
            🌐 {isRTL ? 'تحميل سي في ثنائي اللغة' : 'Download Bilingual CV'}
          </button>
        </div>
      </div>
    </>
  );
});

export default EditorPage;
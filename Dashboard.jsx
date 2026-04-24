import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useResumeStore from '../store/useResumeStore';
import { exportResumeJSON, importResumeJSON } from '../utils/backupUtils';
import SEOHead from './SEOHead';

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const profile = useResumeStore((state) => state.profile);
  const setFullProfile = useResumeStore((state) => state.setFullProfile);
  const isRTL = i18n.language === 'ar';

  const [userProfile, setUserProfile] = useState({
    defaultEmail: profile.email || '',
    defaultPhone: profile.phone || '',
    defaultName: profile.name || '',
  });

  const totalResumes = 1;

  const handleImportJSON = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = await importResumeJSON(file);
      setFullProfile(data.profile);
      useResumeStore.setState({
        experience: data.experience || [],
        education: data.education || [],
        skills: data.skills || [],
        languages: data.languages || [],
        certifications: data.certifications || [],
        awards: data.awards || [],
      });
      alert(isRTL ? 'تم استيراد البيانات بنجاح' : 'Data imported successfully');
    } catch (err) {
      alert('Invalid JSON file');
    }
  };

  return (
    <>
      <SEOHead page="dashboard" />
      <div className="dashboard" dir={isRTL ? 'rtl' : 'ltr'}>
        <h1>{t('dashboard.title')}</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginTop: 30 }}>
          <div className="dash-card">
            <h3>{t('dashboard.stats')}</h3>
            <p>{isRTL ? 'السير الذاتية المحفوظة' : 'Saved Resumes'}: {totalResumes}</p>
            <p>{isRTL ? 'القوالب المتاحة' : 'Templates Available'}: 8</p>
          </div>

          <div className="dash-card">
            <h3>{t('dashboard.settings')}</h3>
            <label>{isRTL ? 'البريد الإلكتروني الافتراضي' : 'Default Email'}</label>
            <input
              value={userProfile.defaultEmail}
              onChange={(e) => setUserProfile(prev => ({ ...prev, defaultEmail: e.target.value }))}
              placeholder="email@example.com"
            />
            <label>{isRTL ? 'رقم الهاتف الافتراضي' : 'Default Phone'}</label>
            <input
              value={userProfile.defaultPhone}
              onChange={(e) => setUserProfile(prev => ({ ...prev, defaultPhone: e.target.value }))}
              placeholder="+966..."
            />
            <button
              onClick={() => {
                setFullProfile({ email: userProfile.defaultEmail, phone: userProfile.defaultPhone, name: userProfile.defaultName });
                alert(isRTL ? 'تم الحفظ' : 'Settings saved');
              }}
              className="add-btn"
              style={{ marginTop: 10 }}
            >
              {isRTL ? 'حفظ الإعدادات' : 'Save Settings'}
            </button>
          </div>

          <div className="dash-card">
            <h3>{t('dashboard.backup')}</h3>
            <input type="file" accept=".json" id="importJsonDash" style={{ display: 'none' }} onChange={handleImportJSON} />
            <label htmlFor="importJsonDash" className="add-btn" style={{ marginRight: 10, marginBottom: 10, display: 'inline-block' }}>
              📥 {isRTL ? 'استيراد JSON' : 'Import JSON'}
            </label>
            <button onClick={exportResumeJSON} className="add-btn">
              📤 {isRTL ? 'تصدير JSON' : 'Export JSON'}
            </button>
          </div>
        </div>

        <style>{`
          .dash-card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .dash-card h3 { margin-top: 0; color: #2c3e50; }
          .dash-card input { width: 100%; padding: 8px; margin: 5px 0 15px; border: 1px solid #ddd; border-radius: 4px; }
        `}</style>
      </div>
    </>
  );
}

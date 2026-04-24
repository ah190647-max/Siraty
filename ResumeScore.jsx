import React from 'react';
import { useTranslation } from 'react-i18next';
import useResumeStore, { REGION_PRESETS } from '../store/useResumeStore';

const POWER_VERBS_AR = ['حقق', 'قاد', 'طور', 'أنشأ', 'خفض', 'زاد', 'وفر', 'أدار'];
const POWER_VERBS_EN = ['achieved', 'led', 'developed', 'increased', 'reduced', 'saved', 'managed', 'created'];

const REGIONAL_POWER_WORDS = {
  gcc: ['Immediate Joiner', 'Valid Driving License', 'NOC available', 'جاهز للعمل فوراً', 'رخصة قيادة سارية'],
  africa_english: ['References available on request', 'ID number', 'Valid work permit'],
  dach: ['GDPR compliant', 'Right to work in EU', 'Arbeitserlaubnis'],
  international: ['Authorized to work', 'US Citizen', 'Green Card holder'],
};

export default function ResumeScore() {
  const { t } = useTranslation();
  const profile = useResumeStore((state) => state.profile);
  const experience = useResumeStore((state) => state.experience);
  const education = useResumeStore((state) => state.education);
  const skills = useResumeStore((state) => state.skills);
  const languages = useResumeStore((state) => state.languages);
  const certifications = useResumeStore((state) => state.certifications);

  const regionConfig = REGION_PRESETS[profile.region] || REGION_PRESETS.international;

  const calculateScore = () => {
    let score = 0;
    const max = 100;

    if (profile.name?.trim()) score += 5;
    if (profile.email?.includes('@')) score += 5;
    if (profile.phone?.trim()) score += 5;
    if (profile.title?.trim()) score += 5;
    if (profile.summary?.length > 20) score += 5;

    if (experience.length > 0) {
      score += 10;
      const hasMetrics = experience.some((exp) =>
        exp.bullets?.some((b) => /\d+%|\d+\s*(increase|decrease|saved|revenue|AED|USD|SAR|جنيه|دولار)/i.test(b))
      );
      const hasPowerVerb = experience.some((exp) =>
        exp.bullets?.some((b) => POWER_VERBS_AR.some((v) => b.includes(v)) || POWER_VERBS_EN.some((v) => b.toLowerCase().includes(v)))
      );
      if (hasMetrics) score += 15;
      if (hasPowerVerb) score += 5;
    }

    if (education.length > 0) score += 15;
    if (skills.length >= 3) score += 5;
    if (languages.length >= 1) score += 5;
    if (certifications.length >= 1) score += 5;

    const fields = regionConfig.fields;
    if (fields.includes('nationality') && profile.regional?.nationality) score += 3;
    if (fields.includes('visaStatus') && profile.regional?.visaStatus) score += 3;
    if (fields.includes('noticePeriod') && profile.regional?.noticePeriod) score += 3;
    if (fields.includes('references') && profile.regional?.references) score += 3;
    if (fields.includes('idNumber') && profile.regional?.idNumber) score += 3;

    if (REGIONAL_POWER_WORDS[profile.region]) {
      const words = REGIONAL_POWER_WORDS[profile.region];
      const combinedText = JSON.stringify({ ...profile, experience, education }).toLowerCase();
      const found = words.some((w) => combinedText.includes(w.toLowerCase()));
      if (found) score += 10;
    }

    if (regionConfig.atsStrict && profile.design.columns !== 1) score -= 20;
    if (regionConfig.privacyForced && !profile.privacy.hidePhoto) score -= 10;

    return Math.min(Math.max(score, 0), max);
  };

  const score = calculateScore();
  const color = score >= 80 ? '#2ecc71' : score >= 50 ? '#f39c12' : '#e74c3c';

  const tips = [];
  if (!experience.some((exp) => exp.bullets?.some((b) => /\d/.test(b)))) tips.push(t('scoring.metricsTip'));
  if (profile.design.columns !== 1 && regionConfig.atsStrict) tips.push(t('ats.warning'));
  if (regionConfig.privacyForced && !profile.privacy.hidePhoto) tips.push(t('privacy.hidePhoto'));

  return (
    <div style={{ marginBottom: 20, padding: 15, background: 'white', borderRadius: 8, border: '1px solid #ddd' }}>
      <h3>🏆 {t('editor.score')}</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{score}/{100}</span>
        <span style={{ color, fontWeight: 'bold' }}>{score}%</span>
      </div>
      <div style={{ width: '100%', height: 10, background: '#eee', borderRadius: 5, marginTop: 8 }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 5 }}></div>
      </div>
      {tips.length > 0 && (
        <ul style={{ marginTop: 10, fontSize: '0.9em' }}>
          {tips.map((tip, i) => <li key={i}>{tip}</li>)}
        </ul>
      )}
    </div>
  );
}
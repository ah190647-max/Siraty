import React from 'react';
import { useTranslation } from 'react-i18next';
import useResumeStore from '../store/useResumeStore';

export default function ATSChecklist() {
  const { t } = useTranslation();
  const profile = useResumeStore((state) => state.profile);
  const experience = useResumeStore((state) => state.experience);

  const checklist = [
    {
      key: 'name',
      label: t('ats.name', 'الاسم الكامل موجود'),
      done: !!profile.name.trim(),
      tip: t('ats.nameTip', 'أضف اسمك الثلاثي كما في جواز السفر'),
    },
    {
      key: 'email',
      label: t('ats.email', 'بريد إلكتروني احترافي'),
      done: profile.email.includes('@'),
      tip: t('ats.emailTip', 'تجنب العناوين غير الرسمية مثل coolguy123@'),
    },
    {
      key: 'phone',
      label: t('ats.phone', 'رقم هاتف محدث'),
      done: profile.phone.trim().length > 5,
      tip: t('ats.phoneTip', 'أضف رمز الدولة لزيادة فرص الاتصال'),
    },
    {
      key: 'summary',
      label: t('ats.summary', 'ملخص احترافي'),
      done: profile.summary.length > 50,
      tip: t('ats.summaryTip', '3-5 جمل تبرز قيمتك المضافة'),
    },
    {
      key: 'metrics',
      label: t('ats.metrics', 'إنجازات رقمية'),
      done: experience.some((exp) => exp.bullets?.some((b) => /\d+%|\d+/.test(b))),
      tip: t('ats.metricsTip', 'مثال: "زيادة المبيعات بنسبة 20%"'),
    },
    {
      key: 'noColumns',
      label: t('ats.columns', 'تصميم عمود واحد'),
      done: profile.design.columns === 1,
      tip: t('ats.columnsTip', 'العمود الواحد أكثر أماناً لأنظمة ATS'),
    },
  ];

  const doneCount = checklist.filter((c) => c.done).length;
  const total = checklist.length;
  const percent = Math.round((doneCount / total) * 100);

  return (
    <div style={{ marginBottom: 20, padding: 15, background: 'white', borderRadius: 8, border: '1px solid #ddd' }}>
      <h3>✅ {t('ats.checklist')} ({doneCount}/{total})</h3>
      <div style={{ width: '100%', height: 6, background: '#eee', borderRadius: 3, margin: '10px 0' }}>
        <div style={{ width: `${percent}%`, height: '100%', background: '#2ecc71', borderRadius: 3 }} />
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {checklist.map((item) => (
          <li key={item.key} style={{ marginBottom: 10, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ color: item.done ? '#2ecc71' : '#e74c3c', fontWeight: 'bold' }}>
              {item.done ? '✓' : '✗'}
            </span>
            <div>
              <span style={{ textDecoration: item.done ? 'line-through' : 'none', color: item.done ? '#999' : '#333' }}>
                {item.label}
              </span>
              {!item.done && (
                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#888' }}>{item.tip}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
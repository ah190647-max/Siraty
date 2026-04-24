import React from 'react';
import SEOHead from './SEOHead';
import { useTranslation } from 'react-i18next';

export default function AboutPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <>
      <SEOHead page="about" />
      <div className="about-page" style={{ maxWidth: 800, margin: '40px auto', padding: 20 }}>
        <h1>{lang === 'ar' ? 'عن Sirati CV' : 'About Sirati CV'}</h1>
        <p>
          {lang === 'ar'
            ? 'Sirati CV هي أداة بناء سير ذاتية مجانية تحترم خصوصية المستخدمين. جميع بياناتك تُعالج محلياً في متصفحك ولا يتم رفعها إلى أي خادم.'
            : 'Sirati CV is a free resume builder that respects your privacy. All your data is processed locally in your browser and never uploaded to any server.'}
        </p>
        <h2>{lang === 'ar' ? 'الخصوصية' : 'Privacy'}</h2>
        <p>
          {lang === 'ar'
            ? 'نحن لا نجمع أو نخزن أو نبيع أي بيانات شخصية. سيرتك الذاتية تبقى في جهازك فقط.'
            : 'We do not collect, store, or sell any personal data. Your resume stays on your device only.'}
        </p>
        <h2>{lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}</h2>
        <ul>
          <li>{lang === 'ar' ? 'هل سيرتي الذاتية متوافقة مع أنظمة ATS؟' : 'Is my resume ATS-friendly?'} – {lang === 'ar' ? 'نعم، جميع القوالب مُحسَّنة.' : 'Yes, all templates are optimized.'}</li>
          <li>{lang === 'ar' ? 'هل يمكنني استخدامها مجاناً؟' : 'Can I use it for free?'} – {lang === 'ar' ? 'نعم، إلى الأبد.' : 'Yes, forever.'}</li>
        </ul>
      </div>
    </>
  );
}
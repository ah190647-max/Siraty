export function generateMetaTitle(page, language = 'ar', data = {}) {
  const titles = {
    ar: {
      gallery: 'قوالب سيرة ذاتية احترافية | Sirati CV',
      import: 'استيراد سيرتك الذاتية | Sirati CV',
      editor: 'محرر السيرة الذاتية | Sirati CV',
      dashboard: 'لوحة التحكم | Sirati CV',
      about: 'عن Sirati CV - أداة بناء سيرة ذاتية آمنة',
    },
    en: {
      gallery: 'Professional Resume Templates | Sirati CV',
      import: 'Import Your Resume | Sirati CV',
      editor: 'Resume Editor | Sirati CV',
      dashboard: 'Dashboard | Sirati CV',
      about: 'About Sirati CV - Secure Resume Builder',
    },
  };
  return titles[language]?.[page] || 'Sirati CV';
}

export function generateMetaDescription(page, language = 'ar') {
  const descriptions = {
    ar: {
      gallery: 'اكتشف 8+ قوالب سيرة ذاتية احترافية متوافقة مع أنظمة ATS. صمم سيرتك الذاتية بالعربية والإنجليزية والفرنسية. قوالب للخليج وأوروبا واليابان.',
      import: 'استورد سيرتك الذاتية القديمة بنقرة واحدة. ارفع ملف PDF أو Word أو ألصق النص مباشرة. حافظ على بياناتك آمنة.',
      editor: 'حرر سيرتك الذاتية بطريقة احترافية مع المعاينة المباشرة. اسحب وأفلت الأقسام، أضف صورك، وحمل PDF أو Word بضغطة.',
      dashboard: 'لوحة تحكم Sirati CV - احفظ سيرتك الذاتية، استورد/صدر JSON، واضبط إعداداتك الافتراضية.',
      about: 'Sirati CV هي أداة بناء سيرة ذاتية مجانية تحترم خصوصيتك. جميع بياناتك تُعالج محلياً ولا يتم رفعها لأي خادم.',
    },
    en: {
      gallery: 'Discover 8+ professional ATS-friendly resume templates. Create your CV in Arabic, English, and French. Templates for Gulf, Europe, Japan.',
      import: 'Import your old resume with one click. Upload PDF or Word, or paste text. Keep your data safe and secure.',
      editor: 'Edit your resume like a pro with live preview. Drag & drop sections, add photos, and download PDF or Word.',
      dashboard: 'Sirati CV Dashboard - Save your resume, import/export JSON, manage default settings.',
      about: 'Sirati CV is a free resume builder that respects your privacy. All data is processed locally on your device.',
    },
  };
  return descriptions[language]?.[page] || descriptions.ar.gallery;
}

export function generateKeywords(page, language = 'ar') {
  const base = 'سيرة ذاتية، CV، بناء سيرة ذاتية، قوالب سيرة ذاتية';
  const extras = {
    gallery: 'ATS Resume Template, Professional Resume Builder',
    import: 'استيراد سيرة ذاتية، رفع سيرة ذاتية، PDF to Resume',
    editor: 'تعديل سيرة ذاتية، محرر سيرة ذاتية، Live Preview Resume Editor',
    dashboard: 'لوحة تحكم سيرة ذاتية، Resume Backup, Resume Dashboard',
    about: 'عن Sirati CV, خصوصية, Privacy-focused resume builder',
  };
  return `${base}, ${extras[page] || ''}`;
}

export function generateStructuredData(page, data = {}, language = 'ar') {
  const baseUrl = 'https://your-domain.com';
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: language === 'ar' ? 'سيرتي CV' : 'Sirati CV',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: generateMetaDescription(page, language),
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
    },
  };
}
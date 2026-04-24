import React from 'react';
import { Helmet } from 'react-helmet-async';
import { generateMetaTitle, generateMetaDescription, generateKeywords, generateStructuredData } from '../utils/seoUtils';
import { useTranslation } from 'react-i18next';

export default function SEOHead({ page, data = {} }) {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'ar';
  const title = generateMetaTitle(page, lang, data);
  const description = generateMetaDescription(page, lang);
  const keywords = generateKeywords(page, lang);
  const structuredData = generateStructuredData(page, data, lang);
  const canonicalUrl = `https://your-domain.com/${page === 'gallery' ? '' : page}`;
  const imageUrl = 'https://your-domain.com/logo.png';

  return (
    <Helmet>
      {/* أساسي */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      <html lang={lang === 'ar' ? 'ar' : 'en'} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={lang === 'ar' ? 'سيرتي CV' : 'Sirati CV'} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* البيانات المنظمة (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}
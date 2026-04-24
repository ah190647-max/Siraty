import pdfMake from 'pdfmake-rtl/build/pdfmake';
import { isFontsLoaded } from './fontLoader';
import { REGION_PRESETS } from '../store/useResumeStore';

export async function downloadPDF(resume) {
  if (!isFontsLoaded()) {
    alert('الخطوط لم تحمل بعد. حاول مرة أخرى.');
    return;
  }
  if (!resume.name?.trim() && !resume.email?.trim()) {
    alert('يرجى إدخال الاسم أو البريد الإلكتروني على الأقل.');
    return;
  }

  try {
    const isRTL = resume.language === 'ar';
    const docContent = [];

    if (resume.photo && !resume.privacy?.hidePhoto) {
      docContent.push({
        image: resume.photo,
        width: 50,
        height: 50,
        alignment: isRTL ? 'right' : 'left',
        margin: [0, 0, 0, 10],
      });
    }

    docContent.push({ text: resume.name || '', style: 'name' });
    docContent.push({ text: resume.title || '', style: 'title' });
    docContent.push({
      text: [resume.email, resume.phone].filter(Boolean).join(' | '),
      style: 'contact',
    });

    if (resume.summary) {
      docContent.push({ text: resume.summary, style: 'text', margin: [0, 0, 0, 15] });
    }

    if (!resume.privacy?.hideNationality && resume.regional?.nationality) {
      docContent.push({ text: `Nationality: ${resume.regional.nationality}`, style: 'text' });
    }
    if (!resume.privacy?.hideVisa && resume.regional?.visaStatus) {
      docContent.push({ text: `Visa Status: ${resume.regional.visaStatus}`, style: 'text' });
    }
    if (resume.regional?.noticePeriod) {
      docContent.push({ text: `Notice Period: ${resume.regional.noticePeriod}`, style: 'text' });
    }
    if (resume.regional?.immediateJoiner) {
      docContent.push({ text: 'Immediate Joiner', bold: true });
    }
    if (resume.regional?.references) {
      docContent.push({ text: `References: ${resume.regional.references}`, style: 'text' });
    }
    if (resume.regional?.idNumber) {
      docContent.push({ text: `ID Number: ${resume.regional.idNumber}`, style: 'text' });
    }

    docContent.push({
      text: isRTL ? 'الخبرات المهنية' : 'Professional Experience',
      style: 'sectionTitle',
    });
    resume.experience?.forEach((exp) => {
      docContent.push({
        text: `${exp.title || ''} – ${exp.company || ''}`,
        bold: true,
        margin: [0, 5, 0, 0],
      });
      exp.bullets?.forEach((b) => {
        docContent.push({ text: `• ${b}`, style: 'bullet' });
      });
    });

    docContent.push({
      text: isRTL ? 'التعليم' : 'Education',
      style: 'sectionTitle',
    });
    resume.education?.forEach((edu) => {
      docContent.push({
        text: `${edu.degree || ''} – ${edu.school || ''}`,
        style: 'text',
      });
    });

    if (resume.skills?.length > 0) {
      docContent.push({ text: isRTL ? 'المهارات' : 'Skills', style: 'sectionTitle' });
      docContent.push({ text: resume.skills.join(' • '), style: 'text' });
    }
    if (resume.languages?.length > 0) {
      docContent.push({ text: isRTL ? 'اللغات' : 'Languages', style: 'sectionTitle' });
      docContent.push({ text: resume.languages.join(' • '), style: 'text' });
    }
    if (resume.certifications?.length > 0) {
      docContent.push({ text: isRTL ? 'الشهادات' : 'Certifications', style: 'sectionTitle' });
      docContent.push({ text: resume.certifications.join(' • '), style: 'text' });
    }

    const docDefinition = {
      pageSize: resume.design?.paperSize || 'A4',
      pageMargins: [30, 30, 30, 30],
      defaultStyle: {
        font: resume.language === 'ar' ? 'Cairo' : 'Roboto',
        fontSize: resume.design?.fontSize || 12,
        alignment: isRTL ? 'right' : 'left',
        direction: isRTL ? 'rtl' : 'ltr',
      },
      content: docContent,
      styles: {
        name: { fontSize: 22, bold: true },
        title: { fontSize: 14, color: '#555' },
        contact: { fontSize: 12, color: '#666' },
        sectionTitle: { fontSize: 14, bold: true, decoration: 'underline', margin: [0, 20, 0, 10] },
        text: { fontSize: 12, lineHeight: 1.6 },
        bullet: { fontSize: 12, marginLeft: 10 },
      },
    };

    pdfMake.createPdf(docDefinition).download(`${(resume.name || 'CV').trim()}_Sirati.pdf`);
  } catch (error) {
    console.error('PDF generation failed:', error);
    alert('فشل في توليد PDF. تأكد من وجود الخطوط في public/fonts.');
  }
}
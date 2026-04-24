import pdfMake from 'pdfmake-rtl/build/pdfmake';
import { isFontsLoaded } from './fontLoader';

export async function downloadBilingualCV(resume) {
  if (!isFontsLoaded()) {
    alert('الخطوط لم تحمل بعد. حاول مرة أخرى.');
    return;
  }

  try {
    const summaryAr = resume.summaryAr || resume.summary || '';
    const summaryEn = resume.summaryEn || resume.summary || '';

    const content = [
      {
        text: `${resume.name || 'Name'} / ${resume.nameAr || resume.name || ''}`,
        style: 'name',
        alignment: 'center',
      },
      {
        text: `${resume.title || ''} / ${resume.titleAr || resume.title || ''}`,
        alignment: 'center',
        margin: [0, 0, 0, 15],
      },
      { text: 'Summary / ملخص', style: 'sectionTitle' },
      {
        columns: [
          { width: '48%', text: summaryEn },
          { width: '4%', text: '' },
          { width: '48%', text: summaryAr, rtl: true },
        ],
      },
      { text: 'Experience / الخبرات', style: 'sectionTitle' },
      ...(resume.experience || []).map((exp) => ({
        columns: [
          {
            width: '48%',
            text: `${exp.titleEn || exp.title || ''} – ${exp.companyEn || exp.company || ''}\n${
              (exp.bulletsEn || exp.bullets || []).join('\n')
            }`,
          },
          { width: '4%', text: '' },
          {
            width: '48%',
            text: `${exp.titleAr || exp.title || ''} – ${exp.companyAr || exp.company || ''}\n${
              (exp.bulletsAr || exp.bullets || []).join('\n')
            }`,
            rtl: true,
          },
        ],
        margin: [0, 0, 0, 10],
      })),
      { text: 'Education / التعليم', style: 'sectionTitle' },
      {
        columns: [
          {
            width: '48%',
            text: (resume.education || [])
              .map((e) => `${e.degreeEn || e.degree || ''} – ${e.schoolEn || e.school || ''}`)
              .join('\n'),
          },
          { width: '4%', text: '' },
          {
            width: '48%',
            text: (resume.education || [])
              .map((e) => `${e.degreeAr || e.degree || ''} – ${e.schoolAr || e.school || ''}`)
              .join('\n'),
            rtl: true,
          },
        ],
      },
      { text: 'Skills / المهارات', style: 'sectionTitle' },
      {
        columns: [
          { width: '48%', text: (resume.skills || []).join(' • ') },
          { width: '4%', text: '' },
          { width: '48%', text: (resume.skills || []).join(' • '), rtl: true },
        ],
      },
    ];

    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [20, 20, 20, 20],
      defaultStyle: { fontSize: 10 },
      content,
      styles: {
        name: { fontSize: 20, bold: true },
        sectionTitle: {
          fontSize: 13,
          bold: true,
          decoration: 'underline',
          margin: [0, 20, 0, 8],
        },
      },
    };

    pdfMake.createPdf(docDefinition).download(`${resume.name || 'CV'}_Bilingual_CV.pdf`);
  } catch (error) {
    console.error('Bilingual CV generation failed:', error);
    alert('فشل في توليد السيرة ثنائية اللغة. تأكد من وجود الخطوط في public/fonts.');
  }
}
import pdfMake from 'pdfmake-rtl/build/pdfmake';
import { isFontsLoaded } from './fontLoader';

export async function downloadZ83Form(resume) {
  if (!isFontsLoaded()) {
    alert('الخطوط لم تحمل بعد. حاول مرة أخرى.');
    return;
  }

  try {
    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [20, 20, 20, 20],
      defaultStyle: {
        font: 'Roboto',
        fontSize: 10,
      },
      content: [
        { text: 'Z83: APPLICATION FOR EMPLOYMENT', style: 'header', alignment: 'center' },
        { text: '(Revised 2021)', alignment: 'center', margin: [0, 0, 0, 20] },
        { text: 'SECTION A: POSITION DETAILS', style: 'sectionHeader' },
        { text: `Position applied for: ${resume.title || '____________________________'}` },
        { text: `Reference number: ____________________________` },
        { text: `Department: ____________________________` },
        { text: 'SECTION B: PERSONAL DETAILS', style: 'sectionHeader' },
        { text: `Surname: ${resume.name?.split(' ').pop() || ''}` },
        { text: `Full names: ${resume.name || ''}` },
        { text: `ID Number: ${resume.regional?.idNumber || ''}` },
        { text: `Date of birth: ${resume.regional?.dateOfBirth || ''}` },
        { text: `Nationality: ${resume.regional?.nationality || ''}` },
        { text: `Contact: ${resume.phone || ''} / ${resume.email || ''}` },
        { text: 'SECTION C: QUALIFICATIONS', style: 'sectionHeader' },
        {
          ul: resume.education?.map(
            (edu) => `${edu.degree || ''} from ${edu.school || ''}`
          ) || [],
        },
        { text: 'SECTION D: WORK EXPERIENCE', style: 'sectionHeader' },
        {
          ul: resume.experience?.map(
            (exp) =>
              `${exp.title || ''} at ${exp.company || ''}: ${exp.bullets?.join('; ') || ''}`
          ) || [],
        },
        { text: 'SECTION E: REFERENCES', style: 'sectionHeader' },
        { text: resume.regional?.references || 'Available on request' },
        { text: 'SECTION F: DECLARATION', style: 'sectionHeader' },
        {
          text: 'I declare that all information provided is true and complete.',
          margin: [0, 10, 0, 20],
        },
        { text: `Signature: ${resume.regional?.signature || '______________________'}` },
        { text: `Date: ${new Date().toLocaleDateString('en-ZA')}` },
      ],
      styles: {
        header: { fontSize: 16, bold: true },
        sectionHeader: {
          fontSize: 12,
          bold: true,
          margin: [0, 15, 0, 5],
          decoration: 'underline',
        },
      },
    };

    pdfMake.createPdf(docDefinition).download(`Z83_${resume.name?.trim() || 'Application'}.pdf`);
  } catch (error) {
    console.error('Z83 generation failed:', error);
    alert('فشل في توليد نموذج Z83. تأكد من وجود الخطوط في public/fonts.');
  }
}
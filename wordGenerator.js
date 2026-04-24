import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, convertInchesToTwip } from 'docx';

export async function downloadWord(resume) {
  const isRTL = resume.language === 'ar';
  
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(0.5),
            right: convertInchesToTwip(0.5),
            bottom: convertInchesToTwip(0.5),
            left: convertInchesToTwip(0.5),
          },
        },
      },
      children: [
        new Paragraph({
          text: resume.name || '',
          heading: HeadingLevel.HEADING_1,
          alignment: isRTL ? AlignmentType.RIGHT : AlignmentType.LEFT,
        }),
        new Paragraph({
          text: resume.title || '',
          spacing: { after: 200 },
          alignment: isRTL ? AlignmentType.RIGHT : AlignmentType.LEFT,
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `${resume.email || ''} | ${resume.phone || ''}`, size: 20, color: '666666' }),
          ],
          spacing: { after: 400 },
          alignment: isRTL ? AlignmentType.RIGHT : AlignmentType.LEFT,
        }),
        ...(resume.summary ? [
          new Paragraph({
            text: isRTL ? 'الملخص' : 'Summary',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            alignment: isRTL ? AlignmentType.RIGHT : AlignmentType.LEFT,
          }),
          new Paragraph({
            text: resume.summary,
            spacing: { after: 300 },
            alignment: isRTL ? AlignmentType.RIGHT : AlignmentType.LEFT,
          }),
        ] : []),
        ...(resume.experience?.length > 0 ? [
          new Paragraph({
            text: isRTL ? 'الخبرات المهنية' : 'Professional Experience',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            alignment: isRTL ? AlignmentType.RIGHT : AlignmentType.LEFT,
          }),
          ...resume.experience.flatMap(exp => [
            new Paragraph({
              children: [
                new TextRun({ text: `${exp.title || ''} – ${exp.company || ''}`, bold: true }),
              ],
              spacing: { before: 100 },
              alignment: isRTL ? AlignmentType.RIGHT : AlignmentType.LEFT,
            }),
            ...(exp.bullets || []).map(b => 
              new Paragraph({
                text: `• ${b}`,
                spacing: { before: 50 },
                alignment: isRTL ? AlignmentType.RIGHT : AlignmentType.LEFT,
              })
            ),
          ]),
        ] : []),
        ...(resume.education?.length > 0 ? [
          new Paragraph({
            text: isRTL ? 'التعليم' : 'Education',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            alignment: isRTL ? AlignmentType.RIGHT : AlignmentType.LEFT,
          }),
          ...resume.education.map(edu =>
            new Paragraph({
              text: `${edu.degree || ''} – ${edu.school || ''}`,
              spacing: { after: 50 },
              alignment: isRTL ? AlignmentType.RIGHT : AlignmentType.LEFT,
            })
          ),
        ] : []),
        ...(resume.skills?.length > 0 ? [
          new Paragraph({
            text: isRTL ? 'المهارات' : 'Skills',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            alignment: isRTL ? AlignmentType.RIGHT : AlignmentType.LEFT,
          }),
          new Paragraph({
            text: resume.skills.join(' • '),
            spacing: { after: 200 },
            alignment: isRTL ? AlignmentType.RIGHT : AlignmentType.LEFT,
          }),
        ] : []),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(resume.name || 'CV').replace(/\s+/g, '_')}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}
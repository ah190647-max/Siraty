const SECTION_KEYWORDS = {
  summary: ['profile', 'summary', 'ملخص', 'الملف الشخصي', 'profil', 'résumé'],
  experience: ['professional experience', 'work experience', 'الخبرات', 'خبرات العمل', 'expérience professionnelle', 'expérience de travail'],
  education: ['education', 'التعليم', 'formation', 'المؤهلات العلمية'],
  skills: ['skills', 'المهارات', 'compétences', 'technical skills'],
  languages: ['languages', 'اللغات', 'langues'],
  certifications: ['certifications', 'الشهادات', 'certifications'],
  awards: ['awards', 'الجوائز', 'récompenses']
};

function findSection(lines, keywords) {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase().trim();
    for (let kw of keywords) {
      if (line.includes(kw)) return i;
    }
  }
  return -1;
}

function extractSectionContent(lines, startIdx, nextIdx) {
  return lines.slice(startIdx + 1, nextIdx).join('\n').trim();
}

export function parseResumeText(rawText) {
  const lines = rawText.replace(/\*\*/g, '').replace(/\*/g, '').split('\n').map(l => l.trim()).filter(Boolean);
  const resume = {
    name: '', title: '', email: '', phone: '', location: '', linkedin: '', website: '',
    summary: '', experience: [], education: [], skills: [], languages: [], certifications: [], awards: []
  };

  if (lines.length === 0) return resume;

  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const line = lines[i];
    if (line.includes('@')) resume.email = line;
    else if (/^\+?\d[\d\s-]{6,}$/.test(line)) resume.phone = line;
    else if (line.toLowerCase().includes('linkedin')) resume.linkedin = line;
    else if (line.includes('http')) resume.website = line;
  }

  resume.name = lines[0] || '';
  resume.title = lines[1] || '';

  const sections = {
    summary: findSection(lines, SECTION_KEYWORDS.summary),
    experience: findSection(lines, SECTION_KEYWORDS.experience),
    education: findSection(lines, SECTION_KEYWORDS.education),
    skills: findSection(lines, SECTION_KEYWORDS.skills),
    languages: findSection(lines, SECTION_KEYWORDS.languages),
    certifications: findSection(lines, SECTION_KEYWORDS.certifications),
    awards: findSection(lines, SECTION_KEYWORDS.awards),
  };

  const sortedIndices = Object.values(sections).filter(i => i !== -1).sort((a, b) => a - b);
  if (sortedIndices.length === 0) {
    resume.summary = lines.slice(2).join('\n');
    return resume;
  }

  const getContent = (key) => {
    const idx = sections[key];
    if (idx === -1) return '';
    const nextIdx = sortedIndices.find(i => i > idx) || lines.length;
    return extractSectionContent(lines, idx, nextIdx);
  };

  resume.summary = getContent('summary');
  resume.skills = getContent('skills').split('\n').map(s => s.replace(/^[-•]\s*/, '').trim()).filter(Boolean);
  resume.languages = getContent('languages').split('\n').map(s => s.replace(/^[-•]\s*/, '').trim()).filter(Boolean);
  resume.certifications = getContent('certifications').split('\n').map(s => s.replace(/^[-•]\s*/, '').trim()).filter(Boolean);
  resume.awards = getContent('awards').split('\n').map(s => s.replace(/^[-•]\s*/, '').trim()).filter(Boolean);

  const expText = getContent('experience');
  if (expText) {
    const entries = expText.split(/\n(?=[\u0600-\u06FFA-Za-z])/);
    entries.forEach((entry, idx) => {
      const entryLines = entry.split('\n').map(l => l.replace(/^[-•]\s*/, '').trim()).filter(Boolean);
      if (entryLines.length === 0) return;
      const first = entryLines[0];
      const job = {
        id: crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${idx}-${Math.random()}`,
        title: '',
        titleAr: '',
        company: first,
        companyAr: first,
        bullets: [],
        bulletsAr: [],
        bulletsEn: [],
      };
      if (/(\d{4}\s*[-–]\s*\d{4}|present)/i.test(first) || first.includes('–') || first.includes('-')) {
        job.title = first;
        job.titleAr = first;
        job.company = '';
        job.companyAr = '';
      }
      if (entryLines.length > 1) {
        job.bullets = entryLines.slice(1);
        job.bulletsAr = entryLines.slice(1);
        job.bulletsEn = entryLines.slice(1);
      }
      resume.experience.push(job);
    });
  }

  const eduText = getContent('education');
  if (eduText) {
    const eduLines = eduText.split('\n').map(l => l.trim()).filter(Boolean);
    let edu = { id: crypto.randomUUID ? crypto.randomUUID() : `edu-${Date.now()}`, degree: '', degreeAr: '', school: '', schoolAr: '' };
    let degree = '', school = '';
    for (let line of eduLines) {
      if (/(Bachelor|Master|PhD|B\.Sc|M\.Sc|Licence|Master|Doctorat|بكالوريوس|ماجستير|دكتوراه)/i.test(line)) degree = line;
      if (/(University|College|School|Université|École|جامعة|كلية|معهد)/i.test(line)) school = line;
    }
    if (degree || school) {
      edu.degree = degree; edu.degreeAr = degree; edu.school = school; edu.schoolAr = school;
      resume.education.push(edu);
    }
  }

  return resume;
}
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { encryptStorage } from '../utils/encryptStorage';

export const REGION_PRESETS = {
  gcc: {
    name: 'الخليج (GCC)',
    fields: ['nationality', 'visaStatus', 'noticePeriod', 'immediateJoiner', 'references'],
    atsStrict: true,
    paperSize: 'A4',
    language: 'ar',
    privacyForced: false,
    dateFormat: 'DD/MM/YYYY',
  },
  africa_english: {
    name: 'أفريقيا (نيجيريا/كينيا)',
    fields: ['references', 'idNumber'],
    atsStrict: true,
    paperSize: 'A4',
    language: 'en',
    privacyForced: false,
    dateFormat: 'DD/MM/YYYY',
  },
  south_africa: {
    name: 'جنوب أفريقيا',
    fields: ['idNumber', 'references', 'z83'],
    atsStrict: false,
    paperSize: 'A4',
    language: 'en',
    privacyForced: false,
    exportZ83: true,
    dateFormat: 'DD/MM/YYYY',
  },
  francophone: {
    name: 'أفريقيا الفرنكوفونية',
    fields: ['references', 'europassStyle'],
    atsStrict: false,
    paperSize: 'A4',
    language: 'fr',
    privacyForced: false,
    dateFormat: 'DD/MM/YYYY',
  },
  international: {
    name: 'عالمي (أمريكا/كندا)',
    fields: [],
    atsStrict: true,
    paperSize: 'Letter',
    language: 'en',
    privacyForced: true,
    forceSingleColumn: true,
    dateFormat: 'MM/DD/YYYY',
  },
  dach: {
    name: 'ألمانيا والنمسا (DACH)',
    fields: ['placeOfBirth', 'maritalStatus', 'signature'],
    atsStrict: false,
    paperSize: 'A4',
    language: 'de',
    privacyForced: false,
    dateFormat: 'DD.MM.YYYY',
  },
  japan: {
    name: 'اليابان (JIS)',
    fields: ['expectedSalary', 'noticePeriod'],
    atsStrict: false,
    paperSize: 'A4',
    language: 'ja',
    forceTabular: true,
    separateDocuments: true,
    dateFormat: 'YYYY年 MM月 DD日',
  },
  singapore: {
    name: 'سنغافورة',
    fields: ['noticePeriod', 'expectedSalary', 'references'],
    atsStrict: false,
    paperSize: 'A4',
    language: 'en',
    privacyForced: false,
    dateFormat: 'DD/MM/YYYY',
  },
};

const useResumeStore = create(
  persist(
    (set, get) => ({
      profile: {
        template: 'modern',
        language: 'ar',
        region: 'gcc',
        name: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        website: '',
        summary: '',
        photo: null,
        design: {
          columns: 1,
          fontSize: 12,
          subtitleStyle: 'normal',
          paperSize: 'A4',
        },
        regional: {
          nationality: '',
          visaStatus: '',
          dateOfBirth: '',
          placeOfBirth: '',
          maritalStatus: '',
          noticePeriod: '',
          immediateJoiner: false,
          expectedSalary: '',
          references: '',
          idNumber: '',
          signature: '',
        },
        privacy: {
          hidePhoto: false,
          hideNationality: false,
          hideVisa: false,
          hideDOB: false,
        },
      },
      experience: [],
      education: [],
      skills: [],
      languages: [],
      certifications: [],
      awards: [],
      parsedData: null,

      // الملف الشخصي
      setTemplate: (id) => set((state) => ({ profile: { ...state.profile, template: id } })),
      setLanguage: (lang) => set((state) => ({ profile: { ...state.profile, language: lang } })),
      setRegion: (regionKey) => {
        const config = REGION_PRESETS[regionKey] || REGION_PRESETS.gcc;
        set((state) => ({
          profile: {
            ...state.profile,
            region: regionKey,
            design: { ...state.profile.design, paperSize: config.paperSize, columns: config.forceSingleColumn ? 1 : state.profile.design.columns },
            privacy: config.privacyForced ? { hidePhoto: true, hideNationality: true, hideVisa: true, hideDOB: true } : state.profile.privacy,
          },
        }));
      },
      updateProfileField: (field, value) => set((state) => ({ profile: { ...state.profile, [field]: value } })),
      updateDesign: (key, value) => set((state) => ({ profile: { ...state.profile, design: { ...state.profile.design, [key]: value } } })),
      updateRegional: (key, value) => set((state) => ({ profile: { ...state.profile, regional: { ...state.profile.regional, [key]: value } } })),
      updatePrivacy: (key, value) => set((state) => ({ profile: { ...state.profile, privacy: { ...state.profile.privacy, [key]: value } } })),
      setFullProfile: (data) => set((state) => ({ profile: { ...state.profile, ...data } })),

      // الخبرات
      addExperience: () => set((state) => ({ experience: [...state.experience, { id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(), title: '', titleAr: '', company: '', companyAr: '', bullets: [], bulletsAr: [], bulletsEn: [] }] })),
      updateExperience: (id, key, value) => set((state) => ({ experience: state.experience.map(e => e.id === id ? { ...e, [key]: value } : e) })),
      addBullet: (expId) => set((state) => ({ experience: state.experience.map(e => e.id === expId ? { ...e, bullets: [...e.bullets, ''], bulletsAr: [...(e.bulletsAr || []), ''], bulletsEn: [...(e.bulletsEn || []), ''] } : e) })),
      updateBullet: (expId, bulletIndex, value, lang = 'en') => set((state) => {
        const field = lang === 'ar' ? 'bulletsAr' : lang === 'en' ? 'bulletsEn' : 'bullets';
        return { experience: state.experience.map(e => e.id === expId ? { ...e, [field]: (e[field] || e.bullets).map((b, i) => i === bulletIndex ? value : b) } : e) };
      }),
      removeBullet: (expId, bulletIndex) => set((state) => ({ experience: state.experience.map(e => e.id === expId ? { ...e, bullets: e.bullets.filter((_, i) => i !== bulletIndex), bulletsAr: (e.bulletsAr || []).filter((_, i) => i !== bulletIndex), bulletsEn: (e.bulletsEn || []).filter((_, i) => i !== bulletIndex) } : e) })),
      removeExperience: (id) => set((state) => ({ experience: state.experience.filter(e => e.id !== id) })),
      reorderExperience: (startIndex, endIndex) => set((state) => { const exp = [...state.experience]; const [rem] = exp.splice(startIndex, 1); exp.splice(endIndex, 0, rem); return { experience: exp }; }),
      setExperience: (data) => set({ experience: data }),

      // التعليم
      addEducation: () => set((state) => ({ education: [...state.education, { id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(), degree: '', degreeAr: '', school: '', schoolAr: '' }] })),
      updateEducation: (id, key, value) => set((state) => ({ education: state.education.map(e => e.id === id ? { ...e, [key]: value } : e) })),
      removeEducation: (id) => set((state) => ({ education: state.education.filter(e => e.id !== id) })),
      reorderEducation: (startIndex, endIndex) => set((state) => { const edu = [...state.education]; const [rem] = edu.splice(startIndex, 1); edu.splice(endIndex, 0, rem); return { education: edu }; }),
      setEducation: (data) => set({ education: data }),

      // مهارات
      addSkill: () => set((state) => ({ skills: [...state.skills, ''] })),
      updateSkill: (index, value) => set((state) => { const skills = [...state.skills]; skills[index] = value; return { skills }; }),
      removeSkill: (index) => set((state) => ({ skills: state.skills.filter((_, i) => i !== index) })),
      setSkills: (data) => set({ skills: data }),

      // لغات
      addLanguage: () => set((state) => ({ languages: [...state.languages, ''] })),
      updateLanguage: (index, value) => set((state) => { const languages = [...state.languages]; languages[index] = value; return { languages }; }),
      removeLanguage: (index) => set((state) => ({ languages: state.languages.filter((_, i) => i !== index) })),
      setLanguages: (data) => set({ languages: data }),

      // شهادات
      addCertification: () => set((state) => ({ certifications: [...state.certifications, ''] })),
      updateCertification: (index, value) => set((state) => { const certifications = [...state.certifications]; certifications[index] = value; return { certifications }; }),
      removeCertification: (index) => set((state) => ({ certifications: state.certifications.filter((_, i) => i !== index) })),
      setCertifications: (data) => set({ certifications: data }),

      // جوائز
      addAward: () => set((state) => ({ awards: [...state.awards, ''] })),
      updateAward: (index, value) => set((state) => { const awards = [...state.awards]; awards[index] = value; return { awards }; }),
      removeAward: (index) => set((state) => ({ awards: state.awards.filter((_, i) => i !== index) })),
      setAwards: (data) => set({ awards: data }),

      // بيانات الاستيراد المؤقتة
      setParsedData: (data) => set({ parsedData: data }),
      clearParsedData: () => set({ parsedData: null }),
    }),
    {
      name: 'sirati-cv-store',
      getStorage: () => encryptStorage,
    }
  )
);

export default useResumeStore;
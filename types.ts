export interface Regional {
  nationality: string;
  visaStatus: string;
  dateOfBirth: string;
  placeOfBirth: string;
  maritalStatus: string;
  noticePeriod: string;
  immediateJoiner: boolean;
  expectedSalary: string;
  references: string;
  idNumber: string;
  signature: string;
}

export interface PrivacySettings {
  hidePhoto: boolean;
  hideNationality: boolean;
  hideVisa: boolean;
  hideDOB: boolean;
}

export interface DesignSettings {
  columns: number;
  fontSize: number;
  subtitleStyle: string;
  paperSize: string;
}

export interface Profile {
  template: string;
  language: string;
  region: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
  photo: string | null;
  design: DesignSettings;
  regional: Regional;
  privacy: PrivacySettings;
}

export interface ExperienceItem {
  id: string;
  title: string;
  titleAr: string;
  company: string;
  companyAr: string;
  bullets: string[];
  bulletsAr: string[];
  bulletsEn: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  degreeAr: string;
  school: string;
  schoolAr: string;
}

export interface ParsedResume {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  languages: string[];
  certifications: string[];
  awards: string[];
}

export interface RegionConfig {
  name: string;
  fields: string[];
  atsStrict: boolean;
  paperSize: string;
  language: string;
  privacyForced: boolean;
  forceSingleColumn?: boolean;
  exportZ83?: boolean;
  europass?: boolean;
  forceTabular?: boolean;
  separateDocuments?: boolean;
  dateFormat: string;
}

export interface ResumeState {
  profile: Profile;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  languages: string[];
  certifications: string[];
  awards: string[];
  parsedData: ParsedResume | null;
}
import useResumeStore from '../store/useResumeStore';

export function exportResumeJSON() {
  const state = useResumeStore.getState();
  const data = {
    profile: state.profile,
    experience: state.experience,
    education: state.education,
    skills: state.skills,
    languages: state.languages,
    certifications: state.certifications,
    awards: state.awards,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sirati-cv-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importResumeJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsText(file);
  });
}
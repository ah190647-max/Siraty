export const encryptStorage = {
  getItem: (name) => {
    const value = localStorage.getItem(name);
    if (!value) return null;
    try {
      return JSON.parse(decodeURIComponent(atob(value)));
    } catch (e) {
      return null;
    }
  },
  setItem: (name, value) => {
    const str = btoa(encodeURIComponent(JSON.stringify(value)));
    localStorage.setItem(name, str);
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

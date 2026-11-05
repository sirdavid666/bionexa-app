
const PREFIX = "bionexa_";

export const Storage = {
  get(key, fallback = null) {
    try {
      const value = localStorage.getItem(PREFIX + key);
      return value === null ? fallback : JSON.parse(value);
    } catch (error) {
      console.error("Storage read error:", error);
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Storage save error:", error);
      return false;
    }
  },

  remove(key) {
    localStorage.removeItem(PREFIX + key);
  },

  clear() {
    Object.keys(localStorage)
      .filter(key => key.startsWith(PREFIX))
      .forEach(key => localStorage.removeItem(key));
  },

  getAll() {
    const result = {};

    Object.keys(localStorage)
      .filter(key => key.startsWith(PREFIX))
      .forEach(key => {
        const name = key.slice(PREFIX.length);
        result[name] = this.get(name);
      });

    return result;
  }
};

export default Storage;

const PREFIX = "bionexa_";

export const Storage = {
  get(key, fallback = null) {
    try {
      const value = globalThis.localStorage?.getItem(PREFIX + key);
      return value === null || value === undefined ? fallback : JSON.parse(value);
    } catch (error) { console.error("Storage read error:", error); return fallback; }
  },
  set(key, value) {
    try {
      if (!globalThis.localStorage) return false;
      globalThis.localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (error) { console.error("Storage save error:", error); return false; }
  },
  remove(key) {
    try { globalThis.localStorage?.removeItem(PREFIX + key); }
    catch (error) { console.error("Storage remove error:", error); }
  },
  clear() {
    try { Object.keys(globalThis.localStorage || {}).filter(key => key.startsWith(PREFIX)).forEach(key => globalThis.localStorage.removeItem(key)); }
    catch (error) { console.error("Storage clear error:", error); }
  },
  getAll() {
    const result = {};
    Object.keys(globalThis.localStorage || {}).filter(key => key.startsWith(PREFIX)).forEach(key => { const name = key.slice(PREFIX.length); result[name] = this.get(name); });
    return result;
  }
};

export default Storage;

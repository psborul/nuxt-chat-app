export default {
  get<T>(key: string): T | undefined {
    const item = localStorage.getItem(key);
    if (!item) return undefined;
    return JSON.parse(item);
  },
  set<T>(key: string, data: T) {
    const dataAsString = JSON.stringify(data);
    localStorage.setItem(key, dataAsString);
  },
  remove(key: string) {
    localStorage.removeItem(key);
  }
};
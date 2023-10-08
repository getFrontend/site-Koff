export class LocalStorageService {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }

  set(key, value) {
    return localStorage.setItem(key, value);
  }

  get(key) {
    localStorage.getItem(key);
  }

  delete(key) {
    localStorage.removeItem(key);
  }
}
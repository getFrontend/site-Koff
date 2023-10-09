export class LocalStorageService {
  constructor() {
  }

  set(key, value) {
    localStorage.setItem(key, value);
  }

  get(key) {
    return localStorage.getItem(key);
  }

  delete(key) {
    return localStorage.removeItem(key);
  }
}
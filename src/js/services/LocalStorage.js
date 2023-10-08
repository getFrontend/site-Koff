export class LocalStorageService {
  constructor() {
    this.localStorage = localStorage;
    this.key = localStorage.key;
    this.value = localStorage.value;
  }

  set(key, value) {
    return this.localStorage.setItem(key, value);
  }

  get(key) {
    return this.localStorage.getItem(key);
  }

  delete(key) {
    return this.localStorage.removeItem(key);
  }
}
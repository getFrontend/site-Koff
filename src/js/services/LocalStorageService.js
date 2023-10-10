export class LocalStorageService {
  constructor(key) {
    this.key = key;
  }

  get() {
    const value = localStorage.getItem(this.key);

    if (value) {
      return value;
    }

    return null;
  }

  set(data) {
    if (typeof data === 'object') {
      data = JSON.stringify(data);
    }

    localStorage.setItem(this.key, data);
  }

  delete() {
    localStorage.removeItem(this.key);
  }
}

export class FavouriteService extends LocalStorageService {
  static instance;

  constructor(key = 'favourite') {
    if (!FavouriteService.instance) {
      super(key);
      this.favourite = new Set(this.get());
      FavouriteService.instance = this;
    }

    return FavouriteService.instance;
  }

  get() {
    const data = super.get();

    if (data) {
      const favourite = JSON.parse(data);

      if (Array.isArray(favourite)) {
        return favourite;
      }
    }

    return [];
  }

  add(value) {
    this.favourite.add(value);
    this.set([...this.favourite]);
  }

  remove(value) {
    if (this.check(value)) {
      this.favourite.delete(value);
      this.set([...this.favourite]);

      return true;
    }
    return false;
  }

  check(value) {
    return this.favourite.has(value);
  }
}

export class AccessKeyService extends LocalStorageService {
  static instance;

  constructor(key = 'accessKey') {
    if (!AccessKeyService.instance) {
      super(key);
      // this.accessKey = new Set(this.get());
      AccessKeyService.instance = this;
    }

    return AccessKeyService.instance;
  }
}
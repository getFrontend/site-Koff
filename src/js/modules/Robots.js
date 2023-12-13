export class Robots {
  static instance = null;

  constructor() {
    if (!Robots.instance) {
      Robots.instance = this;
      this.element = document.querySelector('html');
      this.isMounted = false;
    }

    return Robots.instance;
  }

  mount() {
    if (this.isMounted) {
      return;
    }

    this.element.innerHTML = `robots.txt`;
    this.isMounted = true;
  }

  unmount() {
    this.element.remove();
    this.isMounted = false;
  }

}
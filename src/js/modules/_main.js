// import { addContainer } from "../helpers/addContainer";

export class Main {
  static instance = null;

  constructor() {
    if (!Main.instance) {
      Main.instance = this;
      this.element = document.createElement('main');
      this.element.classList.add('main');
      // this.containerElement = addContainer(this.element);
      this.isMounted = false;
    }

    return Main.instance;
  }

  mount() {
    if (this.isMounted) {
      return;
    }

    document.body.append(this.element);
    this.isMounted = true;
  }

  unmount() {
    this.element.remove();
    this.isMounted = false;
  }

}
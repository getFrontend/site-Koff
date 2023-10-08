import { addContainer } from "../helpers/addContainer";
import { getHTML } from "../helpers/getHTML";
import { page404HTML } from "../html/page404-html";

export class Page404 {
  static instance = null;

  constructor() {
    if (!Page404.instance) {
      Page404.instance = this;
      this.element = document.createElement('section');
      this.element.classList.add('page404');
      this.containerElement = addContainer(this.element, 'page404__container');
      this.isMounted = false;
    }

    return Page404.instance;
  }

  mount(parent) {
    if (this.isMounted) {
      return;
    }

    this.containerElement.innerHTML = getHTML(page404HTML);

    parent.append(this.element);
    this.isMounted = true;
  }

  unmount() {
    this.element.remove();
    this.isMounted = false;
  }

}
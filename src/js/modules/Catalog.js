import { addContainer } from "../helpers/addContainer";

export class Catalog {

  static instance = null;

  constructor() {
    if (!Catalog.instance) {
      Catalog.instance = this;
      this.element = document.createElement('nav');
      this.element.classList.add('catalog');
      this.containerElement = addContainer(this.element, 'catalog__container');
      this.isMounted = false;
    }

    return Catalog.instance;
  }

  mount(parent, data) {
    if (this.isMounted) {
      return;
    }

    this.renderListElem(data);

    parent.prepend(this.element);
    this.isMounted = true;
  }

  unmount() {
    this.element.remove();
    this.isMounted = false;
  }

  renderListElem(data) {
    const listElem = document.createElement('ul');
    listElem.classList.add('catalog__list');

    const listItems = data.map((item) => {
      const listItemElem = document.createElement('li');
      listItemElem.classList.add('catalog__item');

      const link = document.createElement('a');
      link.classList.add('catalog__link');
      link.href = `/category?slug=${item}`;
      link.title = `${item}`;
      link.textContent = `${item}`;

      listItemElem.append(link);

      return listItemElem;
    });

    listElem.append(...listItems);
    this.containerElement.append(listElem);
  }

}
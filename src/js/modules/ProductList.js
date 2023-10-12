import { Card } from "../features/Card";
import { addContainer } from "../helpers/addContainer";

export class ProductList {
  static instance = null;

  constructor() {
    if (!ProductList.instance) {
      ProductList.instance = this;
      this.element = document.createElement('section');
      this.element.classList.add('goods');
      this.containerElement = addContainer(this.element, 'goods__container');
      this.isMounted = false;
      this.addEvents();
    }

    return ProductList.instance;
  }

  mount(parent, data, title, emptyText) {
    this.containerElement.textContent = '';
    const titleElement = document.createElement('h2');
    titleElement.textContent = title
      ? title
      : 'Список товаров';
    titleElement.className = title
      ? 'goods__title'
      : 'goods__title visually-hidden';

    this.containerElement.append(titleElement);

    if (data && data.length) {
      this.updateListElem(data);
    } else {
      this.containerElement.insertAdjacentHTML('beforeend', `
        <p class="goods__empty-text">${emptyText || 'Произошла ошибка, попробуйте снова'}</p>
      `)
    }

    if (this.isMounted) {
      return;
    }

    parent.append(this.element);
    this.isMounted = true;
  }

  unmount() {
    this.element.remove();
    this.isMounted = false;
  }

  addEvents() { }

  updateListElem(data = []) {
    const listElem = document.createElement('ul');
    listElem.classList.add('goods__list');

    const listItems = data.map(({
      id,
      images: [image],
      name: title,
      price
    }) => {
      const listItemElem = document.createElement('li');
      listItemElem.classList.add('goods__item');
      listItemElem.append(new Card({ id, image, title, price }).create());
      return listItemElem;
    });

    listElem.append(...listItems);
    this.containerElement.append(listElem);
  }
}
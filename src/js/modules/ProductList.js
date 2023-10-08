import { API_URL } from "../const";
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

  mount(parent, data, title) {
    this.containerElement.textContent = '';
    const titleElement = document.createElement('h2');
    titleElement.textContent = title
      ? title
      : 'Список товаров';
    titleElement.className = title
      ? 'goods__title'
      : 'goods__title visually-hidden';

    this.containerElement.append(titleElement);
    this.updateListElem(data);

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

    const listItems = data.map((item) => {
      const listItemElem = document.createElement('li');
      listItemElem.classList.add('goods__item');
      // console.log(item);
      listItemElem.innerHTML = this.getHTMLTemplateListItem(item);
      return listItemElem;
    });

    listElem.append(...listItems);
    this.containerElement.append(listElem);
  }

  getHTMLTemplateListItem(
    {
      id,
      images: [image],
      name: title,
      price
    }
  ) {
    return `
        <article class="goods__card card">
        <a class="card__link" href="/product/${id}">
            <img class="card__image" src="${API_URL}${image}"
                alt="${title}">
        </a>

        <div class="card__info">
            <h3 class="card__item-title">
                <a class="card__item-link" href="/product/${id}">${title}</a>
            </h3>
            <span class="card__item-price">${price.toLocaleString('ru-RU')}&nbsp;₽</span>
        </div>

        <button class="card__button-cart" data-id="${id}">В корзину</button>
        <button class="card__button-favourite" data-id="${id}">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M8.41325 13.8733C8.18659 13.9533 7.81325 13.9533 7.58659 13.8733C5.65325 13.2133 1.33325 10.46 1.33325 5.79332C1.33325 3.73332 2.99325 2.06665 5.03992 2.06665C6.25325 2.06665 7.32659 2.65332 7.99992 3.55998C8.67325 2.65332 9.75325 2.06665 10.9599 2.06665C13.0066 2.06665 14.6666 3.73332 14.6666 5.79332C14.6666 10.46 10.3466 13.2133 8.41325 13.8733Z"
                    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </button>
        </article>
    `;
  }
}
import { addContainer } from "../helpers/addContainer";
import { router } from "../main";

export class BreadCrumbs {
  static instance = null;

  constructor() {
    if (!BreadCrumbs.instance) {
      BreadCrumbs.instance = this;
      this.element = document.createElement('div');
      this.element.classList.add('breadcrumb');
      this.containerElement = addContainer(this.element);
    }

    return BreadCrumbs.instance;
  }

  mount(parent, data) {
    this.render(data);
    parent.append(this.element);
    router.updatePageLinks();
  }

  unmount() {
    this.element.remove();
  }

  render(list) {
    this.containerElement.textContent = '';
    const listElem = document.createElement('ul');
    listElem.classList.add('breadcrumb__list');

    const breadcrumbList = [
      { text: 'Главная', href: '/', },
      ...list
    ];

    const listItems = breadcrumbList.map((item) => {
      const listItemElem = document.createElement('li');
      listItemElem.classList.add('breadcrumb__item');

      const link = document.createElement('a');
      link.classList.add('breadcrumb__link');

      link.textContent = item.text;

      if (item.href) {
        link.href = item.href;
      }

      const separator = document.createElement('span');
      separator.classList.add('breadcrumb__separator');
      separator.innerHTML = '&gt;';

      listItemElem.append(link, separator);

      return listItemElem;
    });

    listElem.append(...listItems);

    this.containerElement.append(listElem);
  }
}
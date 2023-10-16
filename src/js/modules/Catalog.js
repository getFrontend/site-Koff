import { addContainer } from "../helpers/addContainer";
import { router } from "../main";
import { ApiService } from "../services/ApiService";

export class Catalog {
  static instance = null;

  constructor() {
    if (!Catalog.instance) {
      Catalog.instance = this;
      this.element = document.createElement('nav');
      this.element.classList.add('catalog');
      this.containerElement = addContainer(this.element, 'catalog__container');
      this.isMounted = false;
      this.linkList = [];
    }

    return Catalog.instance;
  }

  async getData() {
    this.catalogData = await new ApiService().getProductCategories();
  }

  async mount(parent) {
    if (this.isMounted) {
      return this;
    }

    if (!this.catalogData) {
      await this.getData();
      this.renderListElem(this.catalogData);
    }

    parent.prepend(this.element);
    this.isMounted = true;
    return this;
  }

  unmount() {
    this.element.remove();
    this.isMounted = false;
    return this;
  }

  renderListElem(data) {
    const listElem = document.createElement('ul');
    listElem.classList.add('catalog__list');

    const listItems = data.map((item) => {
      const listItemElem = document.createElement('li');
      listItemElem.classList.add('catalog__item');

      const link = document.createElement('a');
      this.linkList.push(link);
      link.classList.add('catalog__link');
      link.href = `/category?slug=${item}`;
      link.title = `${item}`;
      link.textContent = item;

      listItemElem.append(link);

      return listItemElem;
    });

    listElem.append(...listItems);
    this.containerElement.append(listElem);
  }

  setActiveLink(slug) {
    const [{ url }] = router.lastResolved();
    if (url === 'category') {
      this.linkList.forEach(link => {
        const linkSlug = new URL(link.href).searchParams.get('slug');
        if (slug === linkSlug) {
          link.classList.add('catalog__link_active');
        } else {
          link.classList.remove('catalog__link_active');
        }
      });
      router.updatePageLinks();
    }
  }
}
import { Logo } from "../features/Logo";
import { likeSVG } from "../features/likeSVG";
import { addContainer } from "../helpers/addContainer";
import { router } from "../main";

export class Header {
    static instance = null;


    constructor() {
        if (!Header.instance) {
            Header.instance = this;
            this.element = document.createElement('header');
            this.element.classList.add('header');
            this.containerElement = addContainer(this.element, 'header__container');
            this.isMounted = false;
        }

        return Header.instance;
    }

    mount() {
        if (this.isMounted) {
            return;
        }

        const logo = new Logo('header').create();
        const searchForm = this.getSearchForm();
        const navigation = this.getNavigation();

        this.containerElement.append(logo, searchForm, navigation);

        document.body.append(this.element);
        this.isMounted = true;
    }

    unmount() {
        this.element.remove();
        this.isMounted = false;
    }

    getSearchForm() {
        const searchForm = document.createElement('form');
        searchForm.classList.add('header__search');
        searchForm.method = 'get';

        const input = document.createElement('input');
        input.classList.add('header__input');
        input.type = 'search';
        input.name = 'search';
        input.placeholder = "Ведите запрос";

        const searchBtn = document.createElement('button');
        searchBtn.classList.add('header__search-button');
        searchBtn.type = 'submit';
        searchBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M7.66634 13.9999C11.1641 13.9999 13.9997 11.1644 13.9997 7.66659C13.9997 4.16878 11.1641 1.33325 7.66634 1.33325C4.16854 1.33325 1.33301 4.16878 1.33301 7.66659C1.33301 11.1644 4.16854 13.9999 7.66634 13.9999Z"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M14.6663 14.6666L13.333 13.3333" stroke="currentColor" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        `;

        searchForm.addEventListener('submit', (event) => {
            // Cancel page reload
            event.preventDefault();
            router.navigate(`/search?q=${input.value}`);
        });

        searchForm.append(input, searchBtn);
        return searchForm;
    };

    getNavigation() {
        const navigation = document.createElement('nav');
        navigation.classList.add('header__control');

        const favouriteLink = document.createElement('a');
        favouriteLink.classList.add('header__link');
        favouriteLink.href = '/favourite';

        const favouriteText = document.createElement('span');
        favouriteText.classList.add('header__link-text');
        favouriteText.textContent = 'Избранное';

        likeSVG().then((svg) => {
            favouriteLink.append(favouriteText, svg);
        })

        const cartLink = document.createElement('a');
        cartLink.classList.add('header__link');
        cartLink.href = '/cart';

        const cartText = document.createElement('span');
        cartText.classList.add('header__link-text');
        cartText.textContent = "Корзина";

        const cartCountElements = document.createElement('span');
        cartCountElements.classList.add('header__count');
        cartCountElements.textContent = "(0)";

        cartLink.append(cartText, cartCountElements);
        cartLink.insertAdjacentHTML('beforeend', `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M5.87329 1.33325L3.45996 3.75325" stroke="#1C1C1C" stroke-miterlimit="10"
                    stroke-linecap="round" stroke-linejoin="round" />
                <path d="M10.127 1.33325L12.5403 3.75325" stroke="#1C1C1C" stroke-miterlimit="10"
                    stroke-linecap="round" stroke-linejoin="round" />
                <path
                    d="M1.33301 5.23324C1.33301 3.9999 1.99301 3.8999 2.81301 3.8999H13.1863C14.0063 3.8999 14.6663 3.9999 14.6663 5.23324C14.6663 6.66657 14.0063 6.56657 13.1863 6.56657H2.81301C1.99301 6.56657 1.33301 6.66657 1.33301 5.23324Z"
                    stroke="#1C1C1C" />
                <path d="M6.50684 9.33325V11.6999" stroke="#1C1C1C" stroke-linecap="round" />
                <path d="M9.57324 9.33325V11.6999" stroke="#1C1C1C" stroke-linecap="round" />
                <path
                    d="M2.33301 6.66675L3.27301 12.4267C3.48634 13.7201 3.99967 14.6667 5.90634 14.6667H9.92634C11.9997 14.6667 12.3063 13.7601 12.5463 12.5067L13.6663 6.66675"
                    stroke="#1C1C1C" stroke-linecap="round" />
            </svg>
        `);

        navigation.append(favouriteLink, cartLink);

        this.cartCountElements = cartCountElements;

        return navigation;
    }

    changeCount(countNumber) {
        this.cartCountElements.textContent = `(${countNumber})`;
    }
}
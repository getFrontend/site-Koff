import { getHTML } from "../helpers/getHTML";
import { getLogo } from "../helpers/getLogo";
import { footerHTML } from "../html/footer-html";
import { addContainer } from "../helpers/addContainer";


export class Footer {
    static instance = null;

    constructor() {
        if (!Footer.instance) {
            Footer.instance = this;
            this.element = document.createElement('footer');
            this.element.classList.add('footer');
            this.containerElement = addContainer(this.element, 'footer__container');
            this.isMounted = false;
        }

        return Footer.instance;
    }

    mount() {
        if (this.isMounted) {
            return;
        }

        const logo = getLogo('footer__link-logo', 'footer__logo');

        this.containerElement.append(logo);

        this.containerElement.insertAdjacentHTML('beforeend', getHTML(footerHTML));

        document.body.append(this.element);
        this.isMounted = true;
    }

    unmount() {
        this.element.remove();
        this.isMounted = false;
    }

}